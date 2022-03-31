import React from 'react';
import { render } from 'react-dom';
import App from './App';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const httpLink = new HttpLink({
  uri: "http://159.65.232.191:8000/graphql/",

});

const wsLink = new GraphQLWsLink(createClient({
  uri: "ws://159.65.232.191:8000/graphql/",
  
}));

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);


const client = new ApolloClient({
  uri: splitLink,
  cache: new InMemoryCache()
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
