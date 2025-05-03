// types/index.ts

export interface ProductType {
  id: string;
  name: string;
  percentageRate: number;
  products: Product[]; // Added to match the existing data structure
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  prices: number[]; // Added to match the existing data structure
  category: { name: string }; // Added
  colors: string[]; // Added
  sizes: string[]; // Added
  isFeatured: boolean; // Added
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  products: Product[]; // Added to match the existing data structure
  additionalInfo: string;
  category: { name: string }; // Added
}

export interface Category {
  id: string;
  name: string;
  image: string;
  video: string;
}

export interface OrderItemType {
  id: string;
  product?: Product;
  collection?: Collection;
  // Add other properties based on your GraphQL schema
}

export interface OrderType {
  id: string;
  displayId: string;
  total: number;
  status: 'Pending' | 'Paid' | 'Completed' | 'Cancelled' | 'Refunded';
  createdAt: string;
  orderItems: OrderItemType[];
  // Add other properties based on your GraphQL schema
}

export interface FileStats {
  images: {
    files: number;
    usage: number;
    size: string;
    color: string;
  };
  videos: {
    files: number;
    usage: number;
    size: string;
    color: string;
  };
  audio: {
    files: number;
    usage: number;
    size: string;
    color: string;
  };
  docs: {
    files: number;
    usage: number;
    size: string;
    color: string;
  };
  uploads: {
    files: number;
    usage: number;
    size: string;
    color: string;
  };
  downloads: {
    files: number;
    usage: number;
    size: string;
    color: string;
  };
}