"use client";
import React from 'react';
import Image from 'next/image'; // Import the Image component

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
            <Image
                src={result.image}
                alt={result.name}
                className="search-card-image"
                width={300} // Add width
                height={200} // Add height
            />
            <div className="search-card-content">
                <h3 className="search-card-title">{result.name}</h3>
            </div>
        </div>
    );
};

export default SearchCard;