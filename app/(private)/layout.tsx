import React from 'react';
import PrivateLayout from '@/components/layout/PrivateLayout';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <PrivateLayout>{children}</PrivateLayout>
);

export default Layout;