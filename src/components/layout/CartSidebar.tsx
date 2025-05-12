'use client';
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CART_ITEMS } from '@/lib/graphql/queries/cart';
import { REMOVE_FROM_CART, CLEAR_CART } from '@/lib/graphql/mutations/cart';
import { CREATE_USER, SEND_AGENT_EMAIL, ATTEMPT_BADGE_UPGRADE, VALIDATE_USER_BY_EMAIL } from '@/lib/graphql/mutations/campaign';
import { useSession } from '@/lib/hooks/useSession';
import { ShoppingBag, X, ArrowRight, Trash2 } from 'lucide-react';
import Button from '../ui/button/Button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Modal } from '../ui/modal';
import { useLazyQuery } from '@apollo/client';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    images: string[];
    prices: number[];
    sizes: string[];
    colors: string[];
  };
  quantity: number;
  selectedColorIndex: number;
  selectedSizeIndex: number;
}

const BROWNIE_PRODUCT_IDS: string[] = ['1e9bba4e-c404-49b0-a9f8-544d813ec52a'];

export default function CartSidebar() {
  const [couponCode, setCouponCode] = useState<string>('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [couponAid, setCouponAid] = useState<string>(''); // Added state for couponAid
  const { sessionId, isLoading: sessionLoading } = useSession();
  const [ready, setReady] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const router = useRouter();

  const [attemptBadgeUpgrade, { loading: upgrading }] = useMutation(ATTEMPT_BADGE_UPGRADE);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (cartError) {
      const timer = setTimeout(() => setCartError(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [cartError]);

  useEffect(() => {
    if (!sessionLoading) setReady(true);
  }, [sessionLoading]);

  // Extract first four characters of coupon code
  useEffect(() => {
    if (couponCode.length >= 4) {
      setCouponAid(couponCode.substring(0, 4));
    } else {
      setCouponAid('');
    }
  }, [couponCode]);

  const { data, loading, error, refetch } = useQuery(GET_CART_ITEMS, {
    variables: { sessionId },
    skip: !ready || !sessionId,
  });
  const [validateUserByEmail] = useLazyQuery(
    VALIDATE_USER_BY_EMAIL,
    {
      fetchPolicy: 'network-only'
    }
  );
  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  const [clearCart] = useMutation(CLEAR_CART);
  const [createUserMutation] = useMutation(CREATE_USER);
  const [sendAgentEmailMutation] = useMutation(SEND_AGENT_EMAIL);

  const cartItems: CartItem[] = data?.cartItems || [];
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.prices[item.selectedSizeIndex] * item.quantity,
    0
  );

  const hasBrownies = cartItems.some(item => BROWNIE_PRODUCT_IDS.includes(item.product.id));

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart({ variables: { sessionId, itemId } });
      await refetch();
    } catch (err) {
      console.error(err);
      setCartError('Failed to remove item. Please try again.');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart({ variables: { sessionId } });
      await refetch();
    } catch (err) {
      console.error(err);
      setCartError('Failed to clear cart.');
    }
  };

  const handleCheckout = async () => {
    if (!showCheckout) {
      setShowCheckout(true);
      return;
    }

    if (!buyerName || !buyerEmail) {
      setCartError('Please enter your full name and email.');
      return;
    }

    const email = buyerEmail;

    try {
      const handler = window.PaystackPop.setup({
        key: 'pk_test_8607d9e03822eff8e10c7dc17ba56ab3ef7d79a8',
        email,
        amount: subtotal * 100,
        currency: 'NGN',
        metadata: {
          custom_fields: [
            {
              display_name: 'Session ID',
              variable_name: 'session_id',
              value: sessionId as string,
            },
            {
              display_name: 'Full Name',
              variable_name: 'full_name',
              value: buyerName || 'Anonymous',
            }
          ],
        },
        callback: function (response: { reference: string }) {
          fetch(`http://localhost:4000/api/paystack/verify/${response.reference}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          })
            .then(res => res.json())
            .then(async result => {
              if (!result.success) throw new Error('Payment verification failed');

              await clearCart({ variables: { sessionId } });
              await refetch();

              alert('Payment successful!');

              if (hasBrownies) {
                try {
                  const { data } = await validateUserByEmail({
                    variables: {
                      email: buyerEmail,
                    },
                  });
            
                  if (!data?.validateUserById) {
                    // User doesn't exist, create new user and send email
                    const { data: userData } = await createUserMutation({
                      variables: { input: { fullName: buyerName, email: buyerEmail } }
                    });
                    const newAgentId = userData.createUser.agentId;

                    await sendAgentEmailMutation({
                      variables: {
                        input: {
                          agentId: newAgentId,
                          fullName: buyerName,
                          email: buyerEmail,
                        }
                      }
                    });

                    // Attempt badge upgrade after creating user
                    try {
                      const { data } = await attemptBadgeUpgrade({
                        variables: {
                          input: {
                            agentId: newAgentId,
                            couponCode: couponCode || '',
                          }
                        }
                      });
                      const { success, newBadge, attempt } = data.attemptBadgeUpgrade;
                      alert(
                        success
                          ? `Congrats! You’ve been upgraded to ${newBadge}.`
                          : `Upgrade failed (chance was ${attempt.chance}%). Try again!`
                      );
                      setShowUpgradeModal(false);
                      router.push('/brownie-city/');
                    } catch (err) {
                      console.error(err);
                      setShowUpgradeModal(true);
                    }
                  } else {
                    // User already exists, just proceed to badge
                   setShowUpgradeModal(true);
                  }
                } catch (err) {
                  console.error(err);
                  setCartError('User validation error. Please contact support.');
                }
              }

            })
            .catch(err => {
              console.error(err);
              setCartError('Post-payment error. Please contact support.');
            });
        },
        onClose: () => console.log('Payment closed'),
      });

      handler.openIframe();
    } catch (err) {
      console.error(err);
      setCartError('Could not initiate payment.');
    }
  };

  if (sessionLoading || !ready) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <ShoppingBag className="h-8 w-8 text-gray-400 animate-pulse" />
        <p className="mt-2 text-gray-500">Loading your session...</p>
      </div>
    );
  }

  if (!sessionId) {
    return (
      <div className="text-center py-10 text-gray-500">
        <ShoppingBag className="mx-auto h-8 w-8" />
        <p className="mt-2">Please sign in to view your cart</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border-l-4 border-red-500 bg-red-50">
        Error loading cart: {error.message}
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-light flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Your Bag
          <span className="ml-auto text-sm font-normal">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
 </         span>
        </h2>
      </div>

      {/* Error Message */}
      {cartError && (
        <div className="p-4 bg-red-50 text-red-500 text-sm border-l-4 border-red-500 my-2">
          {cartError}
        </div>
      )}

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-24 w-20 bg-gray-100 animate-pulse rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-1/2"></div>
                  <div className="h-4 bg-gray-100 animate-pulse rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <ShoppingBag className="mx-auto h-8 w-8" />
            <p className="mt-2">Your bag is empty</p>
          </div>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="flex border-b border-gray-100 pb-4">
              <div className="relative h-24 w-20 flex-shrink-0">
                <Image
                  src={item.product.images[item.selectedColorIndex] || '/placeholder-product.jpg'}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium">{item.product.name}</h3>
                  <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-black" aria-label="Remove item">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">Size: {item.product.sizes[item.selectedSizeIndex]}</p>
                <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                <p className="mt-2 text-sm font-medium">
                  ${(item.product.prices[item.selectedSizeIndex] * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && !loading && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between text-lg mb-4">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {cartItems.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Coupon (optional)</label>
              <input
                type="text"
                value={couponCode}
                onChange={e => setCouponCode(e.target.value.trim())}
                placeholder="Enter your coupon code"
                className="w-full p-2 border rounded"
              />
            </div>
          )}
          {showCheckout && (
            <div className="space-y-2 pb-4">
              <input
                type="text"
                placeholder="Full Name"
                value={buyerName}
                onChange={e => setBuyerName(e.target.value               )}
 className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={buyerEmail}
                onChange={e => setBuyerEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          )}
          <Button onClick={handleCheckout} className="w-full flex items-center justify-between bg-black text-white hover:bg-gray-800" disabled={loading}>
            {showCheckout ? 'Pay Now' : 'Proceed to Checkout'}
            <ArrowRight className="h-4 w-4" />
          </Button>
          {showUpgradeModal && couponAid && (
            <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)}>
              <h2 className="text-xl font-semibold mb-4">Badge Upgrade</h2>
              <p className="mb-4">
                You have <strong>{couponCode || 'no coupon'}</strong> ready to mint your next badge.
              </p>
              <button
                onClick={async () => {
                  try {
                    const { data } = await attemptBadgeUpgrade({
                      variables: {
                        input: {
                          agentId: couponAid,
                          couponCode: couponCode || '',
                        }
                      }
                    });
                    const { success, newBadge, attempt } = data.attemptBadgeUpgrade;
                    alert(
                      success
                        ? `Congrats! You’ve been upgraded to ${newBadge}.`
                        : `Upgrade failed (chance was ${attempt.chance}%). Try again!`
                    );
                    setShowUpgradeModal(false);
                  } catch (err) {
                    alert(err || 'Upgrade error');
                  }
                }}
                disabled={upgrading}
              >
                {upgrading ? 'Minting…' : 'Mint Badge'}
              </button>
            </Modal>
          )}

          <button onClick={handleClearCart} className="w-full flex items-center justify-center text-sm text-gray-500 hover:text-black mt-2" disabled={loading}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Bag
          </button>
        </div>
      )}
    </div>
  );
}