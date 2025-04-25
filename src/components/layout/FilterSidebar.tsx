// components/FilterSidebar.js
import React, { useState } from 'react';

const FilterSidebar = () => {
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <button
          onClick={() => toggleSection('color')}
          className="w-full flex justify-between items-center py-2"
        >
          <span>COLOR</span>
          <span>{activeSection === 'color' ? '-' : '+'}</span>
        </button>
        {activeSection === 'color' && (
          <div className="mt-4">
            <div className="flex items-center mb-2">
              <input type="checkbox" id="black" className="mr-2" />
              <label htmlFor="black">Black (14)</label>
            </div>
            <div className="flex items-center mb-2">
              <input type="checkbox" id="beige" className="mr-2" />
              <label htmlFor="beige">Beige (10)</label>
            </div>
            <div className="flex items-center mb-2">
              <input type="checkbox" id="silvery" className="mr-2" />
              <label htmlFor="silvery">Silvery (6)</label>
            </div>
            <div className="flex items-center mb-2">
              <input type="checkbox" id="white" className="mr-2" />
              <label htmlFor="white">White (6)</label>
            </div>
            <div className="flex items-center mb-2">
              <input type="checkbox" id="blue" className="mr-2" />
              <label htmlFor="blue">Blue (5)</label>
            </div>
            <div className="flex items-center mb-2">
              <input type="checkbox" id="brown" className="mr-2" />
              <label htmlFor="brown">Brown (3)</label>
            </div>
            <div className="flex items-center mb-2">
              <input type="checkbox" id="grey" className="mr-2" />
              <label htmlFor="grey">Grey (3)</label>
            </div>
            <div className="flex items-center mb-2">
              <input type="checkbox" id="red" className="mr-2" />
              <label htmlFor="red">Red (3)</label>
            </div>
            <div className="flex items-center mb-2">
              <input type="checkbox" id="green" className="mr-2" />
              <label htmlFor="green">Green (1)</label>
            </div>
            <div className="flex items-center mb-2">
              <input type="checkbox" id="pink" className="mr-2" />
              <label htmlFor="pink">Pink (1)</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="purple" className="mr-2" />
              <label htmlFor="purple">Purple (1)</label>
            </div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex justify-between items-center py-2"
        >
          <span>CATEGORY</span>
          <span>{activeSection === 'category' ? '-' : '+'}</span>
        </button>
        {activeSection === 'category' && (
          <div className="mt-4">
            {/* Add category filters here */}
          </div>
        )}
      </div>

      <div className="mb-8">
        <button
          onClick={() => toggleSection('bagSize')}
          className="w-full flex justify-between items-center py-2"
        >
          <span>BAG SIZE</span>
          <span>{activeSection === 'bagSize' ? '-' : '+'}</span>
        </button>
        {activeSection === 'bagSize' && (
          <div className="mt-4">
            {/* Add bag size filters here */}
          </div>
        )}
      </div>

      <div className="mb-8">
        <button
          onClick={() => toggleSection('style')}
          className="w-full flex justify-between items-center py-2"
        >
          <span>STYLE</span>
          <span>{activeSection === 'style' ? '-' : '+'}</span>
        </button>
        {activeSection === 'style' && (
          <div className="mt-4">
            {/* Add style filters here */}
          </div>
        )}
      </div>

      <div className="mb-8">
        <button
          onClick={() => toggleSection('sortBy')}
          className="w-full flex justify-between items-center py-2"
        >
          <span>SORT BY</span>
          <span>{activeSection === 'sortBy' ? '-' : '+'}</span>
        </button>
        {activeSection === 'sortBy' && (
          <div className="mt-4">
            {/* Add sort by options here */}
          </div>
        )}
      </div>

      <button className="w-full border p-3 mt-8">DONE</button>
      <button className="w-full text-center text-gray-500 mt-4">CLEAR ALL</button>
    </div>
  );
};

export default FilterSidebar;