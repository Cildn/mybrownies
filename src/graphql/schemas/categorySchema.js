import { gql } from "graphql-tag";

export const categorySchema = gql`
  type Category {
    id: ID!
    displayId: String
    name: String!
    image: String!
    video: String
    products: [Product!]!
    collections: [Collection!]!
  }

  extend type Query {
    categories: [Category!]!
    categoryDetails(categoryId: ID!): Category
    category(name: String!): Category
  }

  extend type Mutation {
    createCategory(name: String!, image: String!, video: String): Category!
    updateCategory(id: ID!, name: String, image: String, video: String): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;