import { gql } from "@apollo/client";

export const GET_INVOICES = gql`
  query GetInvoices {
    orders {
      id
      status
      total
      createdAt
      displayId
    }
  }
`;

export const EXPORT_INVOICES_CSV = gql`
  mutation ExportInvoicesCSV {
    exportOrdersCSV {
      message
      csvUrl
    }
  }
`;