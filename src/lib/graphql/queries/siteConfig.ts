import { gql } from "graphql-tag";

export const GET_SITE_CONFIG = gql`
  query GetSiteConfig {
    siteConfig {
      id
      maintenanceMode
      liveMode
      heroVideo
      monthlyTarget
    }
  }
`;
