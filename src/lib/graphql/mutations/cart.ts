
import { gql } from "graphql-tag";

export const ADD_TO_CART = gql`
  mutation AddToCart($sessionId: String!, $productId: ID, $collectionId: ID, $quantity: Int!, $selectedColorIndex: Int!, $selectedSizeIndex: Int!) {
    addToCart(sessionId: $sessionId, productId: $productId, collectionId: $collectionId, quantity: $quantity, selectedColorIndex: $selectedColorIndex, selectedSizeIndex: $selectedSizeIndex)
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($sessionId: String!, $itemId: ID!) {
    removeFromCart(sessionId: $sessionId, itemId: $itemId)
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart($sessionId: String!) {
    clearCart(sessionId: $sessionId)
  }
`;

export const CHECKOUT = gql`
  mutation Checkout($sessionId: String!, $total: Float!) {
    checkout(sessionId: $sessionId, total: $total) {
      id
      displayId
      total
      status
      createdAt
      orderItems {
        id
        product {
          name
        }
        collection {
          name
        }
        quantity
        price
        productVariants
      }
    }
  }
`;