import { gql } from 'graphql-tag';

export const SEARCH_QUERY = gql`
  query Search($query: String!, $categoryId: ID, $excludeProductId: ID) {
    search(query: $query, categoryId: $categoryId, excludeProductId: $excludeProductId) {
      products {
        id
        name
        description
        category {
          name
        }
        sizes
        prices
        colors
        image
      }
      collections {
        id
        name
        description
        category {
          name
        }
      }
    }
  }
`;