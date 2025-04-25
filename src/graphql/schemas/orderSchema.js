import { gql } from "graphql-tag";

export const orderSchema = gql`
  type Order {
    id: ID!
    status: String!
    displayId: String!
    total: Float!
    createdAt: String!
    completedAt: String!
    updatedAt: String!
    orderItems: [OrderItem!]!
  }

  type OrderItem {
    id: ID!
    order: Order!
    product: Product
    collection: Collection
    quantity: Int!
    price: Float!
    productVariants: String!
  }

  type ExportResponse {
    message: String!
    csvUrl: String!
  }

  type MutationResponse {
    id: ID!
    status: String!
    message: String!
    receiptUrl: String
  }

  type ExportResponse {
    message: String!
    csvUrl: String
  }

  extend type Query {
    orders: [Order!]!
    order(id: ID!): Order
    totalRevenue: Float!
    recentOrders(hoursAgo: Int! = 8): [Order!]!
  }

  extend type Mutation {
    checkout(sessionId: String! total: Float!): Order!
    markOrderAsComplete(orderId: ID!): MutationResponse!
    markOrderAsRefunded(orderId: ID!): MutationResponse!
    markOrderAsCancelled(orderId: ID!): MutationResponse!
    markOrderAsPaid(orderId: ID!): MutationResponse!
    refundOrder(orderId: ID!): MutationResponse!
    exportOrdersCSV: ExportResponse!
  }
`;