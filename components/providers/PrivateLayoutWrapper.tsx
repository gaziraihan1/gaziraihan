"use client"
import { usePathname } from 'next/navigation'
import React from 'react'
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';

export default function PrivateLayoutWrapper({children}: {children: React.ReactNode}) {
    const pathname = usePathname();
    const hideRoutes = ['/admin'];
    const hideLayout = hideRoutes.some(route => pathname.startsWith(route));
  return (
    <div>
        {
            !hideLayout && <Header />
        }
        <main>
            {children}
        </main>
        {
            !hideLayout && <Footer />
        }
    </div>
  )
}
