import { APIURL } from "@env";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

export default client;
