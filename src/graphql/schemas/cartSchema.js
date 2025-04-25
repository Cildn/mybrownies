import { gql } from "graphql-tag";

export const cartSchema = gql`
  type CartItem {
    id: ID!
    sessionId: String!
    product: Product
    collection: Collection
    quantity: Int!
    selectedColorIndex: Int!
    selectedSizeIndex: Int!
  }

  extend type Query {
    cartItems(sessionId: String!): [CartItem!]!
  }

  extend type Mutation {
    addToCart(sessionId: String!, productId: ID, collectionId: ID, quantity: Int!, selectedColorIndex: Int!
      selectedSizeIndex: Int!): Boolean!
    removeFromCart(sessionId: String!, itemId: ID!): Boolean!
    clearCart(sessionId: String!): Boolean!
  }
`;
