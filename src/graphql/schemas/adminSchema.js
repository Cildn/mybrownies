import { gql } from "graphql-tag";

export const adminSchema = gql`
  type SiteConfig {
    id: ID!
    maintenanceMode: Boolean!
    liveMode: Boolean!
    heroVideo: String!
    monthlyTarget: Float!
    serviceFee: Float!
  }

  type MonthlyTargetResponse {
  monthlyTarget: Float
  actualRevenue: Float
  todayRevenue: Float
  dailyProgress: Float
  todaySales: Int
  numberOfSales: Int
}

  extend type Query {
    siteConfig: SiteConfig!
    monthlyTarget: MonthlyTargetResponse!
  }
  type Admin {
    id: ID!
    email: String!
    role: String!
  }

  type AuthPayload {
  shortLivedToken: String!
  longLivedToken: String
  admin: Admin!
}

  type MessageResponse {
    message: String!
  }

  extend type Mutation {
    requestAdminOTP(email: String! password: String!): MessageResponse!
    updateSiteConfig(
      maintenanceMode: Boolean!
      liveMode: Boolean!
      heroVideo: String
      monthlyTarget: Float
      serviceFee: Float
    ): SiteConfig!
    verifyAdmin(email: String!, otp: String!, rememberMe: Boolean!): AuthPayload!
  }
`;