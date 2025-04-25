import { gql } from "graphql-tag";

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      image
      video
    }
  }
`;

export const GET_CATEGORY_BY_NAME = gql`
  query GetCategoryByName($name: String!) {
    category(name: $name) {
      id
      name
      image
      video
    }
  }
`;