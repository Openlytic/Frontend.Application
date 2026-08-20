"use client";

import React from "react";
import { ConfigProvider } from "antd";
import { antdTheme } from "@/lib/theme";

interface AntdThemeProviderProps {
  children: React.ReactNode;
}

const AntdThemeProvider = ({ children }: AntdThemeProviderProps) => (
  <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>
);

export default AntdThemeProvider;
