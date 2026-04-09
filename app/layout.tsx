import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/SessionProvider";
import { PageLoadTracker } from "@/components/performance/PageLoadTracker";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: "--font-mono",
});

export const meta: Metadata = {
  title: {
    default: "Mohammad Raihan Gazi | Full-stack web Developer",
    template: "%s | Mohammad Raihan Gazi",
  },
  description: "Full-stack Developer & UI/UX Developer specializing in React, Next.js, and scalable web applications.",
  keywords: ["Software Engineer","Web Developer","Full stack", "React", "Next.js", "UI/UX", "Full Stack"],
  authors: [{ name: "Mohammad Raihan Gazi", url: "https://yourportfolio.com" }],
  creator: "Mohammad Raihan Gazi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourportfolio.com",
    siteName: "Your Name Portfolio",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Mohammad Raihan Gazi Portfolio",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammad Raihan Gazi | Full Stack Web Developer",
    description: "Building scalable web experiences & intuitive interfaces.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#0a0a0a] text-white`}>
        <AuthProvider >
          {children}
          <PageLoadTracker />
        </AuthProvider>
      </body>
    </html>
  );
}

