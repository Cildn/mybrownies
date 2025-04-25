import React from 'react';

interface SearchResult {
    id: string;
    name: string;
    description?: string; // Optional, as it's not shown in the card
    image: string;
  }

interface SearchCardProps {
  result: SearchResult;
}

const SearchCard: React.FC<SearchCardProps> = ({ result }) => {
  return (
    <div className="search-card">
      <img
        src={result.image}
        alt={result.name}
        className="search-card-image"
      />
      <div className="search-card-content">
        <h3 className="search-card-title">{result.name}</h3>
      </div>
    </div>
  );
};

export default SearchCard;