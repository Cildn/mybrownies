import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL,
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('admin_token');
  console.log("Frontend Token:", token); // Log token for debugging
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }));
  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: ApolloLink.from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

export default client;