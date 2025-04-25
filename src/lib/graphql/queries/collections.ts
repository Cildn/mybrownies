import { gql } from "@apollo/client";

export const GET_COLLECTIONS = gql`
    query GetCollections {
    collections {
      id
      displayId
      name
      description
      additionalInfo
      discountRate
      images
      videos
      category {
        name
      }
      products {
        name
        prices
        images
        id
      }
      price
      status
      productVariants
    }
  }`;


export const GET_RELATED_PRODUCTS = gql`
query GetRelatedProducts($collectionId: ID!) {
  relatedProducts(collectionId: $collectionId) {
    id
    name
    price
    images
  }
}`;


export const GET_COLLECTION_BY_ID = gql`
  query GetCollectionById($id: ID!) {
  collection(id: $id) {
    id
    displayId
    name
    description
    additionalInfo
    discountRate
    images
    videos
    category {
      name
    }
    products {
      id
      images
      name
      prices
    }
    price
    status
    productVariants
  }
}`;

export const GET_COLLECTIONS_COUNT = gql`
  query GetCollectionsCount($category: String!) {
    collectionsCount(filter: { category: $category })
  }
`;

