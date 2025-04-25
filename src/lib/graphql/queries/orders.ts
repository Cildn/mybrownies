import { gql } from "@apollo/client";

export const GET_ORDERS = gql`
query GetOrders {
  orders {
    displayId
    id
    total
    status
    createdAt
    orderItems {
      id
      quantity
      price
      product {
        id
        name
        images
      }
      collection {
        id
        name
        images
      }
    }
  }
}
`;

export const GET_RECENT_ORDERS = gql`
  query GetRecentOrders($hoursAgo: Int!) {
    recentOrders(hoursAgo: $hoursAgo) {
      id
      displayId
      total
      status
      createdAt
      orderItems {
        id
        quantity
        price
        product {
          id
          name
          images
        }
        collection {
          id
          name
          images
        }
      }
    }
  }
`;

export const EXPORT_ORDERS_CSV = gql`
  mutation ExportOrdersCSV {
    exportOrdersCSV {
      message
      csvUrl
    }
  }
`;