import { gql } from "graphql-tag";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $name: String!
    $description: String
    $additionalInfo: String
    $discountRate: Int
    $typeId: ID
    $prices: [Float!]!
    $brand: String
    $stock: Int!
    $categoryId: ID!
    $images: [String!]!
    $videos: [String!]
    $materials: [String!]
    $sizes: [String!]
    $colors: [String!]
    $isFeatured: Boolean!
  ) {
    createProduct(
      name: $name
      description: $description
      additionalInfo: $additionalInfo
      discountRate: $discountRate
      typeId: $typeId
      prices: $prices
      brand: $brand
      stock: $stock
      categoryId: $categoryId
      images: $images
      videos: $videos
      materials: $materials
      sizes: $sizes
      colors: $colors
      isFeatured: $isFeatured
    ) {
      id
      name
      description
      additionalInfo
      discountRate
      type {
        name
      }
      prices
      brand
      stock
      category {
        id
        name
      }
      images
      videos
      materials
      sizes
      colors
      isFeatured
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      additionalInfo
      discountRate
      type {
        id
        name
      }
      prices
      brand
      stock
      category {
        id
        name
      }
      images
      videos
      materials
      sizes
      colors
      isFeatured
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;