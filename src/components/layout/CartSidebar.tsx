import React from 'react';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CART_ITEMS } from '@/lib/graphql/queries/cart';
import { REMOVE_FROM_CART, CLEAR_CART, CHECKOUT } from '@/lib/graphql/mutations/cart';
import { X, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import Button from '../ui/button/Button';
import Image from 'next/image';
import { useSession } from '@/lib/hooks/useSession';

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

export default function CartSidebar() {
  const { sessionId, isLoading: sessionLoading, error: sessionError } = useSession();
  const [ready, setReady] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  // Auto-dismiss alert after 2 seconds
  useEffect(() => {
    if (cartError) {
      const timer = setTimeout(() => {
        setCartError(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [cartError]);

  // Wait until session is loaded before making queries
  useEffect(() => {
    if (!sessionLoading) {
      setReady(true);
    }
  }, [sessionLoading]);

  const { data, loading, error, refetch } = useQuery(GET_CART_ITEMS, {
    variables: { sessionId },
    skip: !ready || !sessionId,
  });

  const [removeFromCart] = useMutation(REMOVE_FROM_CART);
  const [clearCart] = useMutation(CLEAR_CART);
  const [checkout] = useMutation(CHECKOUT);

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart({ variables: { sessionId, itemId } });
      await refetch(); // Refresh the cart items after removal
      setCartError(null);
    } catch (err) {
      setCartError('Failed to remove item. Please try again.');
      console.error('Error removing item:', err);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart({ variables: { sessionId } });
      await refetch(); // Refresh the cart items after clearing
      setCartError(null);
    } catch (err) {
      setCartError('Failed to clear cart. Please try again.');
      console.error('Error clearing cart:', err);
    }
  };

  const handleCheckout = async () => {
    try {
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + (item.product.prices[item.selectedSizeIndex] * item.quantity),
        0
      );

      const { data: checkoutData } = await checkout({ variables: { sessionId, total: totalAmount } });
      console.log('Checkout successful:', checkoutData);
      setCartError(null);

      // Optional: Navigate to a success page or show a success message
      // router.push('/checkout/success');
    } catch (err) {
      setCartError('Checkout failed. Please try again.');
      console.error('Error during checkout:', err);
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

  const cartItems = data?.cartItems || [];
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product.prices[item.selectedSizeIndex] * item.quantity),
    0
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-light flex items-center">
          <ShoppingBag className="mr-2 h-5 w-5" />
          Your Bag
          <span className="ml-auto text-sm font-normal">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </span>
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
          cartItems.map((item: CartItem) => (
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
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-gray-400 hover:text-black"
                    aria-label="Remove item"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="mt-1 text-sm text-gray-500">
                  Size: {item.product.sizes[item.selectedSizeIndex]}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Qty: {item.quantity}
                </p>
                
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
          
          <div className="space-y-2">
            <Button
              onClick={handleCheckout}
              className="w-full flex items-center justify-between bg-black text-white hover:bg-gray-800"
              disabled={loading}
            >
              Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>
            
            <button
              onClick={handleClearCart}
              className="w-full flex items-center justify-center text-sm text-gray-500 hover:text-black"
              disabled={loading}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Bag
            </button>
          </div>
        </div>
      )}
    </div>
  );
}