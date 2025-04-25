"use client";
import React, { useState } from "react";
import { Search, X } from "lucide-react"; // Lucide icons

interface SearchableInputProps {
  placeholder: string;
  searchType: "image" | "product";
  multiple?: boolean;
  onSelect: (selected: any) => void;
}

const SearchableInput: React.FC<SearchableInputProps> = ({
  placeholder,
  searchType,
  multiple = false,
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from database
  const fetchResults = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await web.search(`${searchType} search ${searchQuery}`);
      setResults(response || []);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
    setLoading(false);
  };

  // Handle input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.length > 2) {
      fetchResults(e.target.value);
    } else {
      setResults([]);
    }
  };

  // Handle item selection
  const handleSelect = (item: any) => {
    if (multiple) {
      const updatedItems = [...selectedItems, item];
      setSelectedItems(updatedItems);
      onSelect(updatedItems);
    } else {
      setSelectedItems([item]);
      onSelect(item);
    }
    setQuery(""); // Clear search input
    setResults([]);
  };

  // Handle removing selected item
  const handleRemove = (index: number) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updatedItems);
    onSelect(updatedItems);
  };

  return (
    <div className="relative">
      {/* Input Field */}
      <div className="relative flex items-center">
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder={placeholder}
          value={query}
          onChange={handleSearchChange}
        />
        <Search className="absolute right-3 text-gray-400" size={18} />
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-lg mt-2 shadow-lg">
          {loading ? (
            <li className="p-2 text-gray-500">Loading...</li>
          ) : (
            results.map((item, index) => (
              <li
                key={index}
                className="p-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                onClick={() => handleSelect(item)}
              >
                {/* Show Image if Image Type */}
                {searchType === "image" && (
                  <img src={item.url} alt={item.name} className="w-8 h-8 rounded" />
                )}
                <span>{item.name}</span>
              </li>
            ))
          )}
        </ul>
      )}

      {/* Selected Items Display */}
      {selectedItems.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedItems.map((item, index) => (
            <div key={index} className="flex items-center bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-sm">
              {item.name}
              <X
                className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
                size={14}
                onClick={() => handleRemove(index)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableInput;
