import { gql } from "@apollo/client";

export const MARK_INVOICE_AS_PAID = gql`
  mutation MarkInvoiceAsPaid($orderId: ID!) {
    markOrderAsPaid(orderId: $orderId) {
      id
      status
    }
  }
`;