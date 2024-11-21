import { APIURL } from "@env";
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://192.168.1.33:5001/graphql",
  cache: new InMemoryCache(),
});

export default client;
