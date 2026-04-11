export const siteConfig = {
  name: "Mohammad Raihan Gazi",
  title: "Full Stack Web Developer & UI/UX Developer",
  description: "Building scalable web experiences & intuitive interfaces with React, Next.js, and modern technologies.",
  url: "https://gaziraihan.vercel.app",
  ogImage: "https://yourportfolio.com/og-image.png",
  links: {
    github: "https://github.com/gaziraihan1",
    twitter: "https://twitter.com/gazyraihan3",
    linkedin: "https://linkedin.com/in/mohammad-raihan-gazi",
    email: "mailto:gazyraihan3@gmail.com",
  },
  keywords: [
    "Software Engineer",
    "React Developer",
    "Next.js",
    "UI/UX Designer",
    "Full Stack Developer",
    "TypeScript",
    "Node.js",
  ],
  navItems: [
    { title: "Work", href: "/projects" },
    { title: "About", href: "/about" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;