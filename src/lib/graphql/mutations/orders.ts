import { gql } from "@apollo/client";

export const MARK_ORDER_AS_PAID = gql`
  mutation MarkOrderAsPaid($orderId: ID!) {
    markOrderAsPaid(orderId: $orderId) {
      id
    }
  }
`;

export const MARK_ORDER_AS_COMPLETED = gql`
  mutation MarkOrderAsCompleted($orderId: ID!) {
    markOrderAsCompleted(orderId: $orderId) { 
      id
      status
    }
  }
`;

export const MARK_ORDER_AS_REFUNDED = gql`
  mutation MarkOrderAsRefunded($orderId: ID!) { 
    markOrderAsRefunded(orderId: $orderId) { 
      id
      status
    }
  }
`;

export const MARK_ORDER_AS_CANCELLED = gql`
  mutation MarkOrderAsCancelled($orderId: ID!) { 
    markOrderAsCancelled(orderId: $orderId) { 
      id
      status
    }
  }
`;