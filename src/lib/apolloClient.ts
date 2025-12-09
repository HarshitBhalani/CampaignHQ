// src/lib/apolloClient.ts
'use client';

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import fetch from 'cross-fetch';

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '/api/graphql',
  fetch
});

const authLink = setContext((_, { headers }) => {
  // client side par localStorage se token read karo
  if (typeof window === 'undefined') {
    return { headers };
  }

  const token = window.localStorage.getItem('campaignhq_token');

  return {
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
