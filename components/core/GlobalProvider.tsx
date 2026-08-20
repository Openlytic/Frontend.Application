"use client";

import React from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import ApolloProviderWrapper from "@/components/core/ApolloProviderWrapper";

interface GlobalProviderProps {
  children: React.ReactNode;
}

const GlobalProvider = ({ children }: GlobalProviderProps) => (
  <Provider store={store}>
    <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
  </Provider>
);

export default GlobalProvider;
