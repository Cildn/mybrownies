import { gql } from '@apollo/client';

export const GET_CART_ITEMS = gql`
  query GetCartItems($sessionId: String!) {
    cartItems(sessionId: $sessionId) {
      id
      product {
        id
        name
        images
        prices
        sizes
      }
      quantity
      selectedColorIndex
      selectedSizeIndex
    }
  }
`;

