import { gql } from "@apollo/client";

export const MARK_ORDER_AS_PAID = gql`
  mutation MarkOrderAsPaid($orderId: ID!) {
    markOrderAsPaid(orderId: $orderId) {
      id
      status
    }
  }
`;


export const MARK_ORDER_AS_COMPLETED = gql`
  mutation MarkOrderAsCompleted($orderId: ID!) {
    markOrderAsComplete(orderId: $orderId) {
      id
      status
    }
  }
`;

export const MARK_ORDER_AS_REFUNDED = gql`
  mutation MarkOrderAsRefunded($orderId: ID!) {
    markOrderAsComplete(orderId: $orderId) {
      id
      status
    }
  }
`;

export const MARK_ORDER_AS_CANCELLED = gql`
  mutation MarkOrderAsCancelled($orderId: ID!) {
    markOrderAsComplete(orderId: $orderId) {
      id
      status
    }
  }
`;
