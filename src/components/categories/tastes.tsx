"use client"
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/product/ProductCard";
import CollectionCard from "../product/CollectionCard";
import Tabs from "./Tabs";
import Sidebar from "../layout/Sidebar";
import { useQuery } from "@apollo/client";
import { GET_PRODUCTS } from "@/lib/graphql/queries/products";
import { GET_COLLECTIONS } from "@/lib/graphql/queries/collections";
import { GET_CATEGORY_BY_NAME } from "@/lib/graphql/queries/categories";
import { Product, Collection } from "@/types";

interface FiltersType {
  colors: string[];
  sizes: string[];
  priceRange: string | null;
  sortBy?: string;
}

export default function TastesPage() {
  const [sidebarType, setSidebarType] = useState<"filter" | null>(null);
  const [activeTab, setActiveTab] = useState<"products" | "collections">("products");
  const [filters, setFilters] = useState<FiltersType>({
    colors: [],
    sizes: [],
    priceRange: null,
    sortBy: undefined,
  });
  const [videoMuted, setVideoMuted] = useState(true);

  // GraphQL queries
  const { data: catData } = useQuery(GET_CATEGORY_BY_NAME, {
    variables: { name: "Tastes" },
  });
  const { loading: lp, error: ep, data: pd } = useQuery(GET_PRODUCTS);
  const { loading: lc, error: ec, data: cd } = useQuery(GET_COLLECTIONS);

  const categoryVideo = catData?.category?.video || "/placeholder-video.mp4";

  // Memoize allProducts and allCollections
  const allProducts = useMemo(() => pd?.products || [], [pd]);
  const allCollections = useMemo(() => cd?.collections || [], [cd]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((p: Product) => {
        if (p.category?.name !== "Tastes") return false; // Ensure category matches
        if (filters.colors.length && !filters.colors.includes(p.colors[0])) return false;
        if (filters.sizes.length && !p.sizes.some((s: string) => filters.sizes.includes(s))) return false;
        if (filters.priceRange) {
          const price = p.prices[0];
          switch (filters.priceRange) {
            case "0-10000":
              if (price > 10000) return false;
              break;
            case "10000-50000":
              if (price <= 10000 || price > 50000) return false;
              break;
            case "50000-100000":
              if (price <= 50000 || price > 100000) return false;
              break;
            case "100000+":
              if (price <= 100000) return false;
              break;
          }
        }
        return true;
      })
      .sort((a: Product, b: Product) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [allProducts, filters]);

  // Filter collections (unaffected by product filters)
  const filteredCollections = useMemo(() => {
    return allCollections.filter((c: Collection) => {
      if (c.category?.name !== "Tastes") return false; // Ensure category matches
      return true;
    });
  }, [allCollections]);

  const handleFilterChange = (type: keyof FiltersType, value: string) => {
    setFilters((prev) => {
      if (type === "priceRange") {
        return { ...prev, priceRange: prev.priceRange === value ? null : value };
      }
      if (type === "sortBy") {
        return { ...prev, sortBy: prev.sortBy === value ? undefined : value };
      }
      const arr = prev[type];
      return {
        ...prev,
        [type]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  if (lp || lc) return <div className="text-center text-lg py-20">Loading...</div>;
  if (ep || ec) return <div className="text-center text-red-500 py-20">Error loading data.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <section
        className="relative w-full h-[500px] flex items-center justify-center bg-gray-200 mt-14 overflow-hidden"
        onMouseEnter={() => setVideoMuted(false)}
        onMouseLeave={() => setVideoMuted(true)}
      >
        <video
          autoPlay
          loop
          muted={videoMuted}
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={categoryVideo} type="video/mp4" />
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

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs
          onTabChange={setActiveTab}
          onFiltersOpen={() => setSidebarType("filter")}
          productCount={filteredProducts.length}
          collectionCount={filteredCollections.length}
        />

        <Sidebar
          type={sidebarType}
          onClose={() => setSidebarType(null)}
          products={allProducts} // Pass all products for filter options
          filters={filters}
          onFilterChange={handleFilterChange}
          onDone={() => setSidebarType(null)}
          onClearAll={() =>
            setFilters({ colors: [], sizes: [], priceRange: null, sortBy: undefined })
          }
        />

        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <AnimatePresence>
            {activeTab === "products" ? (
              filteredProducts.map((p: Product) => ( // Explicitly type 'p' as Product
                <div key={p.id} className="relative">
                  {p.isFeatured && (
                    <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs z-10">
                      Featured
                    </div>
                  )}
                  <ProductCard product={p} />
                </div>
              ))
            ) : (
              filteredCollections.map((c: Collection) => ( // Explicitly type 'c' as Collection
                <CollectionCard key={c.id} collection={c} />
              ))
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </div>
  );
}