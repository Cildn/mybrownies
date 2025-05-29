"use client";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_CATEGORIES } from "@/lib/graphql/queries/categories";

export default function MenuSidebar() {
  const { data, loading, error } = useQuery(GET_CATEGORIES);

  if (loading) return (
    <div className="space-y-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="h-8 bg-gray-100 animate-pulse rounded"></div>
      ))}
    </div>
  );

  if (error) return (
    <div className="text-red-500 p-4 border-l-4 border-red-500 bg-red-50">
      Error loading categories
    </div>
  );

  const categories = data?.categories || [];

  return (
    <nav className="space-y-1">
      <Link 
        href="/" 
        className="flex items-center justify-between py-3 px-2 text-lg font-light hover:bg-gray-50 rounded-md transition-colors"
      >
        Home
      </Link>

      {categories.map((category: { id: string; name: string }) => (
        <Link
          key={category.id}
          href={`/category/${category.name}`}
          className="flex items-center justify-between py-3 px-2 text-lg font-light hover:bg-gray-50 rounded-md transition-colors"
        >
          {category.name}
        </Link>
      ))}

      <Link 
        href="/about/history" 
        className="flex items-center justify-between py-3 px-2 text-lg font-light hover:bg-gray-50 rounded-md transition-colors"
      >
        About Us
      </Link>
    </nav>
  );
}