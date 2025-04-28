"use client";
import React, { useState, useMemo } from "react";

interface ProductType {
  id: string;
  name: string;
  category: { name: string };
  colors: string[];
  sizes: string[];
  prices: number[];
}

interface FiltersType {
  colors: string[];
  sizes: string[];
  priceRange: string | null;
  sortBy?: string;
}

interface FilterSidebarProps {
  products: ProductType[];
  filters: FiltersType;
  onFilterChange: (type: keyof FiltersType, value: string) => void;
  onDone: () => void;
  onClearAll: () => void;
}

export default function FilterSidebar({
  products,
  filters,
  onFilterChange,
  onDone,
  onClearAll,
}: FilterSidebarProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const toggle = (s: string) => setActiveSection((x) => (x === s ? null : s));

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => c && set.add(c)));
    return Array.from(set);
  }, [products]);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.sizes.forEach((z) => z && set.add(z)));
    return Array.from(set);
  }, [products]);

  const Checkbox = ({ section, value, label }: { 
    section: keyof FiltersType; 
    value: string; 
    label: string 
  }) => (
    <div className="flex items-center mb-2">
      <input
        type="checkbox"
        className="mr-2"
        checked={
          section === "priceRange" 
            ? filters.priceRange === value 
            : Array.isArray(filters[section]) 
                ? filters[section].includes(value) 
                : false
        }
        onChange={() => onFilterChange(section, value)}
      />
      <label>{label}</label>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* COLORS */}
      <div className="mb-6">
        <button onClick={() => toggle("colors")} className="w-full flex justify-between py-2 font-semibold">
          <span>COLOR</span>
          <span>{activeSection === "colors" ? "−" : "+"}</span>
        </button>
        {activeSection === "colors" && (
          <div className="mt-3 pl-2">
            {availableColors.map((c) => (
              <Checkbox
                key={`colors-${c}`}
                section="colors"
                value={c}
                label={c}
              />
            ))}
          </div>
        )}
      </div>

      {/* SIZES */}
      <div className="mb-6">
        <button onClick={() => toggle("sizes")} className="w-full flex justify-between py-2 font-semibold">
          <span>SIZES</span>
          <span>{activeSection === "sizes" ? "−" : "+"}</span>
        </button>
        {activeSection === "sizes" && (
          <div className="mt-3 pl-2">
            {availableSizes.map((z) => (
              <Checkbox
                key={`sizes-${z}`}
                section="sizes"
                value={z}
                label={z}
              />
            ))}
          </div>
        )}
      </div>

      {/* PRICE RANGE */}
      <div className="mb-6">
        <button onClick={() => toggle("priceRange")} className="w-full flex justify-between py-2 font-semibold">
          <span>PRICE RANGE</span>
          <span>{activeSection === "priceRange" ? "−" : "+"}</span>
        </button>
        {activeSection === "priceRange" && (
          <div className="mt-3 pl-2">
            {["0-10000", "10000-50000", "50000-100000", "100000+"].map((r) => (
              <Checkbox
                key={`priceRange-${r}`}
                section="priceRange"
                value={r}
                label={r}
              />
            ))}
          </div>
        )}
      </div>

      {/* SORT BY */}
      <div className="mb-6">
        <button onClick={() => toggle("sortBy")} className="w-full flex justify-between py-2 font-semibold">
          <span>SORT BY</span>
          <span>{activeSection === "sortBy" ? "−" : "+"}</span>
        </button>
        {activeSection === "sortBy" && (
          <div className="mt-3 pl-2">
            {["Name A-Z", "Name Z-A", "Price Low-High", "Price High-Low"].map((o) => (
              <div key={`sortBy-${o}`} className="flex items-center mb-2">
                <input
                  type="radio"
                  name="sortBy"
                  className="mr-2"
                  checked={filters.sortBy === o}
                  onChange={() => onFilterChange("sortBy", o)}
                />
                <label>{o}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={onDone} className="w-full bg-amber-900 text-white py-3 rounded mb-2">
        DONE
      </button>
      <button onClick={onClearAll} className="w-full text-center text-gray-500 underline">
        CLEAR ALL
      </button>
    </div>
  );
}