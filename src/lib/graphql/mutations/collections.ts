import { gql } from "graphql-tag";

// Create a new collection
export const CREATE_COLLECTION = gql`
  mutation CreateCollection(
    $name: String!
    $description: String
    $additionalInfo: String
    $discountRate: Int
    $categoryId: ID!
    $productIds: [ID!]!
    $images: [String!]!
    $videos: [String!]
    $price: Float!
    $status: String!
    $productVariants: [String!]!
  ) {
    createCollection(
      name: $name
      description: $description
      additionalInfo: $additionalInfo
      discountRate: $discountRate
      categoryId: $categoryId
      productIds: $productIds
      images: $images
      videos: $videos
      price: $price
      status: $status
      productVariants: $productVariants
    ) {
      id
      name
      description
      additionalInfo
      discountRate
      category {
        name
      }
      products {
        id
        name
        images
        prices
      }
      images
      videos
      price
      status
      productVariants
    }
  }
`;

// Update an existing collection
export const UPDATE_COLLECTION = gql`
  mutation UpdateCollection($id: ID!, $input: UpdateCollectionInput!) {
    updateCollection(id: $id, input: $input) {
        id
      name
      description
      additionalInfo
      category {
        name
      }
      products{
        id
        name
        images
        prices
      }
      images
      videos
      price
      discountRate
      status
      productVariants
    }
  }
`;

// Delete a collection
export const DELETE_COLLECTION = gql`
  mutation DeleteCOllection($id: ID!) {
    deleteCollection(id: $id) {
      id
    }
  }
`;