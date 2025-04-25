import { gql } from "@apollo/client";

// Mutation for requesting OTP
export const REQUEST_ADMIN_OTP = gql`
  mutation RequestAdminOTP($email: String!, $password: String!) {
    requestAdminOTP(email: $email, password: $password) {
      message
    }
  }
`;

// Mutation for verifying OTP
export const VERIFY_ADMIN = gql`
  mutation VerifyAdmin($email: String!, $otp: String!, $rememberMe: Boolean!) {
    verifyAdmin(email: $email, otp: $otp, rememberMe: $rememberMe) {
      shortLivedToken
      longLivedToken
      admin {
        id
        email
        role
      }
    }
}
`;