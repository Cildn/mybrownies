// components/Tabs.js
import { useState } from 'react';

const Tabs = ({ onTabChange, onFiltersOpen, productCount, collectionCount }) => {
  const [activeTab, setActiveTab] = useState('products');

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex space-x-4">
        <button
          onClick={() => {
            setActiveTab('products');
            onTabChange('products');
          }}
          className={`px-4 py-2 rounded ${activeTab === 'products' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Products
        </button>
        <button
          onClick={() => {
            setActiveTab('collections');
            onTabChange('collections');
          }}
          className={`px-4 py-2 rounded ${activeTab === 'collections' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Collections
        </button>
      </div>
      <div className="flex items-center space-x-4">
        {activeTab === 'products'
          ? `${productCount} Products`
          : `${collectionCount} Collections`}
      </div>
      <button
        onClick={onFiltersOpen}
        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Filters
      </button>
    </div>
  );
};

export default Tabs;