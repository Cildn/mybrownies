// chart.ts
import { gql } from "@apollo/client";

// Query to fetch revenue by period
export const GET_REVENUE_BY_PERIOD = gql`
  query GetRevenueByPeriod($period: String!) {
    revenueByPeriod(period: $period) {
      totalRevenue
      periodLabels
      revenueData
    }
  }
`;

export const GET_MONTHLY_TARGET = gql`
  query GetMonthlyTarget {
    monthlyTarget {
      monthlyTarget
      actualRevenue
      todayRevenue
      dailyProgress
      numberOfSales
      todaySales
    }
  }
`;

export const GET_ORDER_STATUS_DISTRIBUTION = gql`
query GetOrderStatusDistribution($period: String!) {
    orderStatusDistribution(period: $period) {
      pending
      completed
      cancelled
      refunded
    }
  }`
;

export const GET_TOTAL_COMPLETED_ORDERS = gql`
    query GetTotalCompletedOrders {
  totalCompletedOrders
}
`;

export const GET_TOTAL_ORDERS_FOR_TWO_PERIODS = gql`
  query GetTotalOrdersForTwoPeriods($period: String!) {
    totalOrdersForTwoPeriods(period: $period) {
      currentOrders
      previousOrders
    }
  }
`;

export const GET_BEST_SELLING_PRODUCTS = gql`
  query GetBestSellingProducts($period: String!) {
  bestSellingProducts(period: $period) {
    product {
      id
      name
      images
    }
    totalSold
  }
}
`;

export const GET_BEST_SELLING_COLLECTIONS = gql`
  query GetBestSellingCollections($period: String!) {
    bestSellingCollections(period: $period) {
      collection {
        id
        name
      }
      totalSold
    }
  }
`;
