import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      displayId
      prices
      name
      description
      images
      videos
      additionalInfo
      colors
      materials
      sizes
      discountRate
      category {
        id
        name
        __typename
      }
      isFeatured
      type{
        name
      }
      collections {
        id
        name
      }
    }
  }`;

export const GET_PRODUCTS_COUNT = gql`
query GetProductsCount($category: String!) {
  productsCount(filter: { category: $category })
}
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
  product(id: $id) {
    id
    displayId
    name
    description
    prices
    images
    discountRate
    additionalInfo
    videos
    stock
    sizes
    colors
    materials
    category {
      id
      name
      __typename
    }
    type {
      name
    }
    isFeatured
  }
}`;
