import { gql } from "graphql-tag";

export const collectionSchema = gql`
  type Collection {
    id: ID!
    name: String!
    displayId: String
    description: String
    additionalInfo: String
    discountRate: Int
    category: Category
    products: [Product!]!
    images: [String!]
    videos: [String!]
    price: Float!
    status: String!
    productVariants: [String!]!
    orderItems: [OrderItem!]!
    cartItems: [CartItem!]!
  }

  input UpdateCollectionInput {
    name: String
    description: String
    additionalInfo: String
    discountRate: Int
    categoryId: ID
    productIds: [ID!]
    images: [String!]
    videos: [String!]
    price: Float
    status: String
    productVariants: [String!]
  }

  extend type Query {
    collectionsCount: Int! # Added collection count query
    collections: [Collection!]!
    collection(id: ID!): Collection
  }

  extend type Mutation {
    createCollection(
      name: String!
      description: String
      additionalInfo: String
      discountRate: Int
      categoryId: ID
      productIds: [ID!]
      images: [String!]
      videos: [String!]
      price: Float!
      status: String
      productVariants: [String!]
    ): Collection!

    updateCollection(
      id: ID!
      input: UpdateCollectionInput!
    ): Collection!

    deleteCollection(id: ID!): Collection!
  }
`;