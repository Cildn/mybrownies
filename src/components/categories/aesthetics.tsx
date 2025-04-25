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

export default function AestheticsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarType, setSidebarType] = useState(null);
  const [activeTab, setActiveTab] = useState("products");
  const [filters, setFilters] = useState({
    colors: [],
    sizes: [],
    priceRange: null,
    collections: [],
  });

  // Fetch data
  const { data: categoryData } = useQuery(GET_CATEGORY_BY_NAME, {
    variables: { name: "Aesthetics" },
  });

  const { loading: productsLoading, error: productsError, data: productsData } = useQuery(GET_PRODUCTS);
  const { loading: collectionsLoading, error: collectionsError, data: collectionsData } = useQuery(GET_COLLECTIONS);

  const categoryVideo = categoryData?.category?.video || "/placeholder-video.mp4";

  // Filter and sort products - featured first, then alphabetically
  const allProducts = productsData?.products || [];
  const allCollections = collectionsData?.collections || [];

  const filteredProducts = allProducts
    .filter((product) => {
      const matchesCategory = product.category?.name?.toLowerCase() === "aesthetics";
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply filters
      const matchesColor = filters.colors.length === 0 || filters.colors.includes(product.colors[0]);
      const matchesSize = filters.sizes.length === 0 || filters.sizes.some((size) => product.sizes.includes(size));
      const matchesPrice =
        !filters.priceRange ||
        (filters.priceRange === "0-10000" && product.prices[0] <= 10000) ||
        (filters.priceRange === "10000-50000" && product.prices[0] > 10000 && product.prices[0] <= 50000) ||
        (filters.priceRange === "50000-100000" && product.prices[0] > 50000 && product.prices[0] <= 100000) ||
        (filters.priceRange === "100000+" && product.prices[0] > 100000);

      return matchesCategory && matchesSearch && matchesColor && matchesSize && matchesPrice;
    })
    .sort((a, b) => {
      // Featured products first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      // Then sort alphabetically by name
      return a.name.localeCompare(b.name);
    });

  // Filter collections
  const filteredCollections = allCollections.filter((collection) => {
    const matchesCategory = collection.category?.name?.toLowerCase() === "aesthetics";
    const matchesSearch = collection.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollection = filters.collections.length === 0 || filters.collections.includes(collection.name);

    return matchesCategory && matchesSearch && matchesCollection;
  });

  const handleFiltersOpen = () => {
    setSidebarType("filter");
  };

  const handleSidebarClose = () => {
    setSidebarType(null);
  };

  const handleFilterChange = (type, value) => {
    if (type === "colors") {
      setFilters((prev) => ({
        ...prev,
        colors: prev.colors.includes(value)
          ? prev.colors.filter((color) => color !== value)
          : [...prev.colors, value],
      }));
    } else if (type === "sizes") {
      setFilters((prev) => ({
        ...prev,
        sizes: prev.sizes.includes(value)
          ? prev.sizes.filter((size) => size !== value)
          : [...prev.sizes, value],
      }));
    } else if (type === "priceRange") {
      setFilters((prev) => ({ ...prev, priceRange: prev.priceRange === value ? null : value }));
    } else if (type === "collections") {
      setFilters((prev) => ({
        ...prev,
        collections: prev.collections.includes(value)
          ? prev.collections.filter((col) => col !== value)
          : [...prev.collections, value],
      }));
    }
  };

  if (productsLoading || collectionsLoading) return <div className="text-center text-lg">Loading...</div>;
  if (productsError || collectionsError) return <div className="text-center text-red-500">Error loading data.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section
        className="relative w-full h-[500px] flex items-center justify-center bg-gray-200 mt-14 overflow-hidden"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
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
          <h1 className="text-6xl font-bold">Discover Luxurious Aesthetics</h1>
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

        <Sidebar
          type={sidebarType}
          onClose={handleSidebarClose}
          products={filteredProducts}
          collections={filteredCollections}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Add featured indicator to the grid */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <AnimatePresence>
            {activeTab === "products" ? (
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