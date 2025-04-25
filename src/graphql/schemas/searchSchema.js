import { gql } from "graphql-tag";

export const searchSchema = gql`
    type SearchResults {
    products: [Product!]!
    collections: [Collection!]!
  }

  type Product {
    id: ID!
    name: String!
    description: String
    price: Float!
    image: String
    category: Category
  }

  type Category {
    id: ID!
    name: String!
  }

  type Collection {
    id: ID!
    name: String!
    description: String
  }

  extend type Query {
    search(query: String!, categoryId: ID, excludeProductId: ID): SearchResults!
  }
`;