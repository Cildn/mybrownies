import { gql } from "graphql-tag";

export const CREATE_PRODUCT_TYPE = gql`
  mutation CreateProductType($name: String!, $percentageRate: Float!) {
    createProductType(name: $name, percentageRate: $percentageRate) {
      id
      name
      percentageRate
    }
  }
`;

export const UPDATE_PRODUCT_TYPE = gql`
  mutation UpdateProductType($id: ID!, $name: String, $percentageRate: Float) {
    updateProductType(id: $id, name: $name, percentageRate: $percentageRate) {
      id
      name
      percentageRate
    }
  }
`;

export const DELETE_PRODUCT_TYPE = gql`
  mutation DeleteProductType($id: ID!) {
    deleteProductType(id: $id)
  }
`;