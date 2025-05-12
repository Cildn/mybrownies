import { gql } from "graphql-tag";

export const campaignSchema = gql`

  # Enums
enum BadgeType {
  BROWN
  BLUE
  GREEN
  YELLOW
  RED
  NEON
}

input BadgeUpgradeInput {
  agentId: String!
  couponCode: String!
}

type BadgeUpgradePayload {
  success: Boolean!
  message: String!
  newBadge: BadgeType
  attempt: MintAttempt
}

# Types
type CampaignUser {
  id: ID!
  agentId: String!
  email: String!
  fullName: String
  stage: Int
  points: Int
  badge: BadgeType
  createdAt: String
  updatedAt: String
  clues: [Clue!]
  coupons: [Coupon!]
  badgeUpgrades: [BadgeUpgrade!]
}

type Clue {
  id: ID!
  date: String!
  question: String!
}

type Coupon {
  id: ID!
  code: String!
  discount: Float!
  expiry: String!
  usageCount: Int!
  maxUses: Int!
  createdAt: DateTime!
  user: CampaignUser
}

type BadgeUpgrade {
  id: ID!
  badgeType: BadgeType!
  createdAt: String!
}

type QRCode {
  id: ID!
  code: String!
  used: Boolean!
  usedBy: String
  usedAt: String
  createdAt: String!
}

type MintAttempt {
  id: ID!
  agentId: String!
  badgeFrom: BadgeType!
  badgeTo: BadgeType!
  chance: Float!
  success: Boolean!
  createdAt: DateTime!
  user: CampaignUser!
}

# Input types
input CreateUserInput {
  email: String!
  fullName: String!
}

input SubmitClueInput {
  agentId: String!
  email: String!
  answer: String!
}

input MintBadgeInput {
  agentId: String!
  badgeType: BadgeType!
}

input ValidateQRCodeInput {
  code: String!
  agentId: String!
}

type ClueAnswerResult {
  correct: Boolean!
  coupon: Coupon
  points: Int!
}

input SendAgentEmailInput {
   agentId: String!
   fullName: String!
   email: String!
 }

 type SendAgentEmailPayload {
   agentId: String!
 }
 
 type QRValidationResult {
  isValid: Boolean!
  reason: String
 }


# Queries
type Query {
  getClueOfTheDay: Clue
  getUserStats(agentId: String!): CampaignUser
  getUserCoupons(agentId: String!): [Coupon!]!
  getUserBadgeUpgrades(agentId: String!): [BadgeUpgrade!]!
  checkQRCodeByCode(code: String!): QRValidationResult!
  validateUserCredentials(agentId: String!, email: String!): Boolean!
  validateUserByEmail(email: String!): Boolean!
}

# Mutations
type Mutation {
  createUser(input: CreateUserInput!): CampaignUser!
  submitClueAnswer(input: SubmitClueInput!): ClueAnswerResult!
  sendAgentEmail(input: SendAgentEmailInput!): SendAgentEmailPayload!
  mintBadge(input: MintBadgeInput!): BadgeUpgrade!
  validateQRCode(input: ValidateQRCodeInput!): Boolean!
  attemptBadgeUpgrade(input: BadgeUpgradeInput!): BadgeUpgradePayload!
}
`;