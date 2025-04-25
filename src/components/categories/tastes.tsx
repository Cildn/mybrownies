"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import '../../app/globals.css';
import ProductCard from "@/components/product/ProductCard";
import CollectionCard from "../product/CollectionCard";
import Tabs from "./Tabs";
import Sidebar from "../layout/Sidebar";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/lib/graphql/queries/products";
import { GET_COLLECTIONS } from "@/lib/graphql/queries/collections";
import { GET_CATEGORY_BY_NAME } from "@/lib/graphql/queries/categories";

export default function TastesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarType, setSidebarType] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  // Fetch data
  const { data: categoryData } = useQuery(GET_CATEGORY_BY_NAME, {
    variables: { name: "Tastes" },
  });

  const { loading: productsLoading, error: productsError, data: productsData } = useQuery(GET_PRODUCTS);
  const { loading: collectionsLoading, error: collectionsError, data: collectionsData } = useQuery(GET_COLLECTIONS);

  const categoryVideo = categoryData?.category?.video || "/placeholder-video.mp4";

  // Filter and sort products - featured first, then alphabetically
  const filteredProducts = (productsData?.products || [])
    .filter((product) => {
      const matchesCategory = product.category?.name?.toLowerCase() === "Tastes";
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // Featured products first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      
      // Then sort alphabetically by name
      return a.name.localeCompare(b.name);
    });

  // Filter collections
  const filteredCollections = (collectionsData?.collections || [])
    .filter((collection) => {
      const matchesCategory = collection.category?.name?.toLowerCase() === "Tastes";
      const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  const handleFiltersOpen = () => {
    setSidebarType('filter');
  };

  const handleSidebarClose = () => {
    setSidebarType(null);
  };

  if (productsLoading || collectionsLoading) return <div className="text-center text-lg">Loading...</div>;
  if (productsError || collectionsError) return <div className="text-center text-red-500">Error loading data.</div>;

  const playVideo = async () => {
    if (videoElement) {
      try {
        await videoElement.play();
      } catch (error) {
        console.warn("Video playback interrupted:", error);
      }
    }
  };

  const pauseVideo = () => {
    if (videoElement) {
      videoElement.pause();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section
        className="relative w-full h-[500px] flex items-center justify-center bg-gray-200 mt-14 overflow-hidden"
        onMouseEnter={playVideo}
        onMouseLeave={pauseVideo}
      >
        <video
          ref={(el) => setVideoElement(el)}
          muted
          loop
          playsInline
          autoPlay
          className="absolute inset-0 z-0 w-full h-full object-cover transition-opacity duration-300"
        >
          <source src={`${categoryVideo}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <motion.div
          className="relative z-10 text-center text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl font-bold">Discover Luxurious Tastes</h1>
          <p className="text-lg mt-4">Indulge in captivating fragrances.</p>
        </motion.div>
      </section>

      {/* Products Info and Filters */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs
          onTabChange={setActiveTab}
          onFiltersOpen={handleFiltersOpen}
          productCount={filteredProducts.length}
          collectionCount={filteredCollections.length}
        />

        <Sidebar type={sidebarType} onClose={handleSidebarClose} />

        {/* Add featured indicator to the grid */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <AnimatePresence>
            {activeTab === 'products' ? (
              filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product.id} className="relative">
                    {product.isFeatured && (
                      <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs z-10">
                        Featured
                      </div>
                    )}
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <motion.p
                  className="col-span-full text-center text-gray-500 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No results found.
                </motion.p>
              )
            ) : (
              filteredCollections.length > 0 ? (
                filteredCollections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))
              ) : (
                <motion.p
                  className="col-span-full text-center text-gray-500 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No collections found.
                </motion.p>
              )
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </div>
  );
}