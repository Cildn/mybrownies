import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_QUERY } from '@/lib/graphql/queries/search';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface SearchResult {
  id: string;
  name: string;
  image: string;
  category?: {
    name: string;
  };
  __typename?: string;
}

const SearchCard: React.FC<{ result: SearchResult }> = ({ result }) => {
  console.log('Search Result:', result);

  const categoryName = result.category?.name || 'all';

  const href = result.__typename === 'Product'
    ? `/category/${categoryName}/products/${result.id}`
    : `/category/${categoryName}/collections/${result.id}`;


  return (
    <Link href={href} passHref>
      <div className="group cursor-pointer transition-all duration-300 hover:opacity-90">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={result.image || '/placeholder-product.jpg'}
            alt={result.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        </div>
        <div className="mt-4 text-center">
          <h3 className="text-lg font-light">{result.name}</h3>
          <div className="mx-auto mt-2 w-16 h-px bg-black transition-all duration-300 group-hover:w-24" />
        </div>
      </div>
    </Link>
  );
};

export default function SearchSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [getSearchResults, { data, loading, error }] = useLazyQuery(SEARCH_QUERY, {
    fetchPolicy: 'network-only',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (value.length > 2) {
      getSearchResults({ 
        variables: { query: value },
        onError: (err) => console.error("Search error:", err)
      });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-32">
      <div className="animate-pulse text-gray-500">Searching...</div>
    </div>
  );

  if (error) return (
    <div className="text-red-500 p-4 border-l-4 border-red-500 bg-red-50">
      Error: {error.message}
    </div>
  );

  const results = data?.search || { products: [], collections: [] };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search our collection..."
          className="w-full pl-10 pr-4 py-3 border-b border-gray-200 focus:border-black focus:outline-none text-lg"
          value={searchQuery}
          onChange={handleInputChange}
          autoFocus
        />
      </div>

      {/* Search Results */}
      {data && (
        <div className="grid grid-cols-2 gap-8">
          {results.products.map((product: SearchResult) => (
            <SearchCard 
              key={`product-${product.id}`} 
              result={{ ...product, __typename: 'Product' }} 
            />
          ))}
          
          {results.collections.map((collection: SearchResult) => (
            <SearchCard 
              key={`collection-${collection.id}`} 
              result={{ ...collection, __typename: 'Collection' }} 
            />
          ))}
        </div>
      )}

      {/* Empty States */}
      {!data && searchQuery.length < 3 && (
        <div className="text-center py-10 text-gray-500">
          <p>Type at least 3 characters to search</p>
        </div>
      )}

      {data && results.products.length === 0 && results.collections.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <p>No results found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}