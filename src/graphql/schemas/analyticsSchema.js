import { gql } from "graphql-tag";

export const analyticsSchema = gql`

  type ProductSales {
    product: Product! # The product associated with the sales data
    totalSold: Int! # Total number of units sold
    totalRevenue: Float! # Total revenue generated from the product
  }

  type CollectionSales {
    collection: Collection! # The collection associated with the sales data
    totalSold: Int! # Total number of units sold
    totalRevenue: Float! # Total revenue generated from the collection
  }

  
  type TotalOrdersForTwoPeriods {
  currentOrders: Int!
  previousOrders: Int!
}

  type OrderStatusDistribution {
    pending: Int!
    completed: Int!
    cancelled: Int!
    refunded: Int!
  }

  type RevenueBreakdown {
    totalRevenue: Float! # Total revenue for the period
    periodLabels: [String!]! # Labels for the x-axis (e.g., months, weeks)
    revenueData: [Float!]! # Revenue data for each label
  }

  type ProductSales {
  product: Product! # The product associated with the sales data
  totalSold: Int! # Total number of units sold
  }

  type CollectionSales {
  collection: Collection! # The collection associated with the sales data
  totalSold: Int! # Total number of units sold
  }

  extend type Query {

    totalRevenue: Float!

    ordersByPeriod(period: String!): [Order!]!

    revenueByPeriod(period: String!): RevenueBreakdown!

    productSalesBreakdown: [ProductSales!]!

    collectionSalesBreakdown: [CollectionSales!]!

    monthlyTarget: MonthlyTargetResponse!

    orderStatusDistribution(period: String!): OrderStatusDistribution!

    totalCompletedOrders: Int!

    totalOrdersForTwoPeriods(period: String!): TotalOrdersForTwoPeriods!

    bestSellingProducts(period: String!): [ProductSales!]!

    bestSellingCollections(period: String!): [CollectionSales!]!
  }

`;