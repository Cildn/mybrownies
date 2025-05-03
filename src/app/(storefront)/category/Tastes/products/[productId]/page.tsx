"use client";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import ErrorPage from "next/error";
import { GET_PRODUCT_BY_ID } from "@/lib/graphql/queries/products";
import { SEARCH_QUERY } from "@/lib/graphql/queries/search";
import { ADD_TO_CART } from "@/lib/graphql/mutations/cart";
import { useSession } from "@/lib/hooks/useSession";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Alert from "@/components/ui/alert/Alert";
import Sidebar from "@/components/layout/Sidebar";

interface AlertProps {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  onClose: () => void;
}

const ProductPage = () => {
  const params = useParams<{ productId: string }>();
  const productId = params?.productId || "";
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showInfo, setShowInfo] = useState<{ howItWorks: boolean; delivery: boolean }>({
    howItWorks: false,
    delivery: false,
  });
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [alert, setAlert] = useState<null | AlertProps>(null);
  const [sidebarType, setSidebarType] = useState<"menu" | "search" | "cart" | "filter" | null>(null);

  const { sessionId, isLoading: sessionLoading } = useSession();

  const { loading, error, data } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: productId },
    skip: !productId,
  });

  const { data: searchData, refetch } = useQuery(SEARCH_QUERY, {
    variables: {
      query: "",
      categoryId: null,
      excludeProductId: "",
    },
    skip: true,
  });

  const [addToCartMutation] = useMutation(ADD_TO_CART);

  useEffect(() => {
    if (data?.product && refetch) {
      refetch({
        query: data.product.name || "",
        categoryId: data.product.category?.id || null,
        excludeProductId: productId,
      });
    }
  }, [data?.product, productId, refetch]);

  if (loading || sessionLoading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse text-lg">Loading product details...</div>
    </div>
  );

  if (error) return <ErrorPage statusCode={500} />;
  if (!data?.product) return <ErrorPage statusCode={404} />;

  const product = data.product;

  const { tabs, howItWorksContent } = parseAdditionalInfo(product.additionalInfo || "");

  const relatedProducts = searchData?.search.products || [];

  const handleAddToCart = async () => {
    if (!sessionId) {
      setAlert({
        variant: "error",
        title: "Error",
        message: "Please wait while we initialize your session",
        onClose: () => setAlert(null),
      });
      return;
    }

    try {
      await addToCartMutation({
        variables: {
          sessionId,
          productId: product.id,
          quantity,
          selectedSizeIndex,
          selectedColorIndex,
        },
      });

      setAlert({
        variant: "success",
        title: "Added to Bag",
        message: `${product.name} has been added to your shopping bag`,
        onClose: () => setAlert(null),
      });

      setSidebarType("cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setAlert({
        variant: "error",
        title: "Error",
        message: "Failed to add product to bag. Please try again.",
        onClose: () => setAlert(null),
      });
    }
  };

  return (
    <div className="bg-[#f8f6f2] text-[#333] min-h-screen mt-8">
      <Navbar isVisible />

      {/* Sidebar */}
      <Sidebar
        type={sidebarType}
        onClose={() => setSidebarType(null)}
        products={[]} // Pass relevant products if needed
        filters={{ colors: [], sizes: [], priceRange: null }}
        onFilterChange={() => {}}
        onDone={() => setSidebarType(null)}
        onClearAll={() => {}}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Section */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Product Images */}
          <div className="lg:w-1/2">
            <div className="sticky top-20">
              <div className="relative aspect-square w-full">
                <Image
                  src={`/uploads${product.images[selectedColorIndex].replace('/uploads', '')}`}
                  alt={product.name}
                  fill
                  className="object-contain rounded-sm"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-light tracking-wide mb-2">{product.name}</h1>
            
            <div className="text-xl font-light mb-6">
              {product.prices && product.prices.length > 0 && product.sizes && product.sizes.length > 0
                ? formatPrice(product.prices[selectedSizeIndex])
                : product.price !== null
                ? formatPrice(product.price)
                : "Price available upon request"}
            </div>

            <p className="text-gray-600 mb-8">{product.description}</p>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium uppercase tracking-wider mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: string, index: number) => (
                    <button
                      key={index}
                      className={`px-4 py-2 border ${
                        selectedSizeIndex === index 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-300 hover:border-gray-400'
                      } transition-colors`}
                      onClick={() => setSelectedSizeIndex(index)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium uppercase tracking-wider mb-3">Color</h3>
                <div className="flex gap-3">
                  {product.colors.map((color: string, index: number) => (
                    <button
                      key={index}
                      className={`w-10 h-10 rounded-full border-2 ${
                        selectedColorIndex === index ? 'border-black' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedColorIndex(index)}
                      aria-label={`Select color ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-medium uppercase tracking-wider mb-3">Quantity</h3>
              <div className="flex items-center border border-gray-300 w-max">
                <button 
                  className="px-4 py-2 hover:bg-gray-100"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                <button 
                  className="px-4 py-2 hover:bg-gray-100"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full py-3 bg-black text-white hover:bg-gray-800 transition-colors mb-6"
              onClick={handleAddToCart}
            >
              Add to Bag
            </button>

            {/* Product Info Accordions */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              {howItWorksContent && (
                <div>
                  <button
                    onClick={() => setShowInfo(prev => ({ ...prev, howItWorks: !prev.howItWorks }))}
                    className="flex justify-between items-center w-full text-left py-3"
                  >
                    <span>How It Works</span>
                    <FaChevronDown className={`transition-transform ${showInfo.howItWorks ? 'rotate-180' : ''}`} />
                  </button>
                  {showInfo.howItWorks && (
                    <div className="pb-4 text-sm text-gray-600">
                      {howItWorksContent}
                    </div>
                  )}
                </div>
              )}

              <div>
                <button
                  onClick={() => setShowInfo(prev => ({ ...prev, delivery: !prev.delivery }))}
                  className="flex justify-between items-center w-full text-left py-3"
                >
                  <span>Delivery & Returns</span>
                  <FaChevronDown className={`transition-transform ${showInfo.delivery ? 'rotate-180' : ''}`} />
                </button>
                {showInfo.delivery && (
                  <div className="pb-4 text-sm text-gray-600">
                    Free standard delivery on all orders. Express delivery available at checkout.
                    Easy 14-day returns policy.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        {tabs.length > 0 && (
          <div className="mt-16">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {tabs.map((tab: { title: string; content: string }, index: number) => (
                  <button
                    key={index}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === index
                        ? 'border-black text-black'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    {tab.title}
                  </button>
                ))}
              </nav>
            </div>
            <div className="py-8">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }} />
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-light mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: { id: string; name: string; images: string[]; price: number | null }) => (
                <div key={relatedProduct.id} className="group">
                  <div className="aspect-square relative overflow-hidden mb-3">
                    <Image
                      src={`/uploads${relatedProduct.images[0].replace('/uploads', '')}`}
                      fill
                      alt={relatedProduct.name}
                      className="object-cover transition-opacity group-hover:opacity-90"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  </div>
                  <h3 className="font-light">{relatedProduct.name}</h3>
                  <p className="font-medium">
                    {relatedProduct.price !== null
                      ? formatPrice(relatedProduct.price)
                      : "Price available upon request"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Alert */}
      {alert && (
        <div className="fixed bottom-4 right-4 z-50">
          <Alert
            variant={alert.variant}
            title={alert.title}
            message={alert.message}
            onClose={alert.onClose}
          />
        </div>
      )}

      <Footer/>

    </div>
  );

  // Helper function to format price with commas
  function formatPrice(price: number): string {
    return `₦${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  }

  // Function to parse additional info
  function parseAdditionalInfo(info: string): { tabs: Array<{ title: string; content: string }>; howItWorksContent: string } {
    const sections = info.split("#").filter((section) => section.trim() !== "");
    const tabs: Array<{ title: string; content: string }> = [];
    let howItWorksContent = "";

    for (const section of sections) {
      const lines = section.split("\n").map((line) => line.trim());
      const title = lines[0].replace(/#+/, "").trim();
      const content = lines.slice(1).join("\n");

      if (title.toLowerCase() === "how it works") {
        howItWorksContent = content;
      } else {
        tabs.push({ title, content });
      }
    }

    return { tabs, howItWorksContent };
  }
};

export default ProductPage;