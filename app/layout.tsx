import { Suspense } from 'react';
import NextTopLoader from 'nextjs-toploader';
import '@ant-design/v5-patch-for-react-19';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Poppins } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';
import GlobalProvider from '@/components/core/GlobalProvider';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: 'Openlytic',
  description: 'Email tracking and campaign analytics'
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body className={`${poppins.variable} font-poppins`}>
      <Suspense fallback={null}>
        <NextTopLoader showSpinner={false} />
        <AntdRegistry>
          <GlobalProvider>{children}</GlobalProvider>
        </AntdRegistry>
      </Suspense>
    </body>
  </html>
);

export default RootLayout;