import { gql } from "graphql-tag";

export const UPDATE_SITE_CONFIG = gql`
  mutation UpdateSiteConfig(
    $maintenanceMode: Boolean!
    $liveMode: Boolean!
    $heroVideo: String
    $monthlyTarget: Float
    $serviceFee: Float
  ) {
    updateSiteConfig(
      maintenanceMode: $maintenanceMode
      liveMode: $liveMode
      heroVideo: $heroVideo
      monthlyTarget: $monthlyTarget
      serviceFee: $serviceFee
    ) {
      id
      maintenanceMode
      liveMode
      heroVideo
      monthlyTarget
      serviceFee
    }
  }
`;
