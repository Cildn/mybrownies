"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react"; // Added useEffect import
import { useQuery } from "@apollo/client";
import { useState } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";
import ErrorPage from "next/error";
import { GET_PRODUCT_BY_ID } from "@/lib/graphql/queries/products";
import { SEARCH_QUERY } from "@/lib/graphql/queries/search";

interface Product {
  id: string;
  name: string;
  images: string[];
  description: string;
  prices?: number[];
  price?: number;
  sizes?: string[];
  colors?: string[];
  category?: { id: string };
  additionalInfo?: string;
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

  useEffect(() => {
    if (data?.product && refetch) {
      refetch({
        query: data.product.name || "",
        categoryId: data.product.category?.id || null,
        excludeProductId: productId,
      });
    }
  }, [data?.product, productId, refetch]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-pulse text-lg">Loading product details...</div>
    </div>
  );

  if (error) return <ErrorPage statusCode={500} />;
  if (!data?.product) return <ErrorPage statusCode={404} />;

  const product = data.product as Product;

  const { tabs, howItWorksContent } = parseAdditionalInfo(product.additionalInfo || "");
  const relatedProducts = searchData?.search.products || [];

  return (
    <div className="bg-[#f8f6f2] text-[#333] min-h-screen mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
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

          <div className="lg:w-1/2">
            <h1 className="text-3xl font-light tracking-wide mb-2">{product.name}</h1>
            
            <div className="text-xl font-light mb-6">
              {product.prices && product.prices.length > 0 && product.sizes && product.sizes.length > 0
                ? formatPrice(product.prices[selectedSizeIndex] ?? 0) // Handle undefined
                : product.price !== null
                ? formatPrice(product.price ?? 0) // Handle undefined
                : "Price available upon request"}
            </div>

            <p className="text-gray-600 mb-8">{product.description}</p>

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

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-light mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct: Product) => (
                <div key={relatedProduct.id} className="group">
                  <div className="aspect-square relative overflow-hidden mb-3">
                    <Image
                      src={`/uploads${relatedProduct.images[0].replace('/uploads', '')}`}
                      fill
                      alt={relatedProduct.name}
                      className="object-cover transition-opacity group-hover:opacity-90"
                      sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <h3 className="font-light">{relatedProduct.name}</h3>
                  <p className="font-medium">
                    {relatedProduct.price !== null
                      ? formatPrice(relatedProduct.price ?? 0) // Handle undefined
                      : "Price available upon request"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function formatPrice(price: number): string {
    return `₦${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  }

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