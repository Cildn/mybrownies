import { gql } from "graphql-tag";

export const mediaSchema = gql`
  scalar Upload
  scalar DateTime

  type Media {
    id: ID!
    name: String!
    url: String!
    type: String!
    size: Int!
    folder: String!
    uploadedAt: DateTime!
    mimeType: String!
    dimensions: String
    duration: Int
    tags: [String!]
  }

  extend type Query {
    mediaFiles(folder: String, searchTerm: String): [Media!]!
    mediaFile(id: ID!): Media
  }

  extend type Mutation {
    uploadMedia(file: Upload!, folder: String!, name: String): Media!
    updateMedia(id: ID!, name: String, folder: String): Media!
    deleteMedia(id: ID!): Boolean!
  }
`;