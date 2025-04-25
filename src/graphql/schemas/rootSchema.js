import { gql } from 'graphql-tag';

const rootSchema = gql`
  type Query {siteConfig: SiteConfig!}
  type Mutation
`;

export default rootSchema;