'use client';

import { SessionProvider } from 'next-auth/react';
import PrivateLayoutWrapper from './PrivateLayoutWrapper';
import ClientOnlyProviders from './ClientOnlyProviders';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SessionProvider>
    <ClientOnlyProviders />
    <PrivateLayoutWrapper >
      {children}
    </PrivateLayoutWrapper>
  </SessionProvider>;
}