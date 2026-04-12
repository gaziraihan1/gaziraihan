'use client';

import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import PrivateLayoutWrapper from './PrivateLayoutWrapper';
import ClientOnlyProviders from './ClientOnlyProviders';

export default function AuthProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <ClientOnlyProviders />
      <PrivateLayoutWrapper>
        {children}
      </PrivateLayoutWrapper>
    </SessionProvider>
  );
}