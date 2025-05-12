// GET_USER_STATS
import { gql } from '@apollo/client'

export const GET_USER_STATS = gql`
  query GetUserStats($agentId: String!) {
    getUserStats(agentId: $agentId) {
      id
      agentId
      email
      fullName
      stage
      points
      badge
      createdAt
      updatedAt
      clues {
        id
        date
        question
      }
      coupons {
        id
        code
        discount
        expiry
      }
      badgeUpgrades {
        id
        badgeType
        createdAt
      }
    }
  }
`

// GET_CLUE_OF_THE_DAY
export const GET_CLUE_OF_THE_DAY = gql`
  query GetClueOfTheDay {
    getClueOfTheDay {
      id
      date
      question
    }
  }
`

// SUBMIT_CLUE_ANSWER
export const SUBMIT_CLUE_ANSWER = gql`
  mutation SubmitClueAnswer($input: SubmitClueInput!) {
    submitClueAnswer(input: $input) {
      correct
      points
      coupon {
        id
        code
        discount
        expiry
      }
    }
  }
`

export const VALIDATE_USER_CREDENTIALS = gql`
  query ValidateUserCredentials($agentId: String!, $email: String!) {
    validateUserCredentials(agentId: $agentId, email: $email)
  }
`;

export const VALIDATE_USER_BY_EMAIL = gql`
  query ValidateUserByEmail($email: String!) {
    validateUserByEmail(email: $email)
  }
`;


export const VALIDATE_QR_CODE = gql`
  mutation ValidateQRCode($input: ValidateQRCodeInput!) {
    validateQRCode(input: $input)
  }
`

export const CHECK_QR_CODE_BY_CODE = gql `
  query CheckQRCodeByCode($code: String!) {
    checkQRCodeByCode(code: $code) {
      isValid
      reason
    }
  }
`


export const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      agentId
      fullName
      email
    }
  }
`
// New SEND_AGENT_EMAIL mutation
export const SEND_AGENT_EMAIL = gql`
  mutation SendAgentEmail($input: SendAgentEmailInput!) {
    sendAgentEmail(input: $input) {
      agentId
    }
  }
`;

export const CREATE_QR_CODE = gql`
  mutation CreateQRCode($count: Int!) {
    createQRCodes(count: $count) {
      id
      code
    }
  }
`;

export const CREATE_CLUE = gql `
  mutation CreateClue($input: CreateClueInput!){
    createClue (input: $input) {
        id
        date
        question
      }
    }
`;

// ATTEMPT_BADGE_UPGRADE
export const ATTEMPT_BADGE_UPGRADE = gql`
  mutation AttemptBadgeUpgrade($input: BadgeUpgradeInput!) {
    attemptBadgeUpgrade(input: $input) {
      success
      newBadge
      attempt {
        id
        badgeFrom
        badgeTo
        chance
        success
        createdAt
      }
    }
  }
`;