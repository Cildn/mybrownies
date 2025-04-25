import { gql } from "graphql-tag";

export const GET_PRODUCT_TYPES = gql`
  query GetProductTypes {
    productTypes {
      id
      name
      percentageRate
    }
  }
`;