'use client';

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Cookies from 'js-cookie';
import type { ReactNode } from 'react';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/graphql`
    : 'http://localhost:8000/graphql'
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'network-only'
    }
  }
});

const ApolloProviderWrapper = ({ children }: { children: ReactNode }) => (
  <ApolloProvider client={client}>{children}</ApolloProvider>
);

export default ApolloProviderWrapper;