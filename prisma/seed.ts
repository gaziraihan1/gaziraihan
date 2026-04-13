import "dotenv/config";
import { prisma } from "@/lib/prisma";



async function main() {
  console.log("🌱 Seeding database...");

  // -----------------------------
  // 1. TAGS
  // -----------------------------
  await prisma.tag.createMany({
    data: [
      { name: "TypeScript", slug: "typescript", color: "#3178c6" },
      { name: "Next.js", slug: "nextjs", color: "#0002343" },
      { name: "React", slug: "react", color: "#61dafb" },
      { name: "Backend", slug: "backend", color: "#22c55e" },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // 2. SKILLS
  // -----------------------------
  await prisma.skill.createMany({
    data: [
      { name: "React", category: "Frontend", proficiency: 95, order: 1 },
      { name: "Next.js", category: "Frontend", proficiency: 90, order: 2 },
      { name: "Node.js", category: "Backend", proficiency: 85, order: 3 },
      { name: "PostgreSQL", category: "Database", proficiency: 80, order: 4 },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  await prisma.blogPost.upsert({
    where: { slug: "getting-started-nextjs" },
    update: {},
    create: {
      title: "Getting Started with Next.js",
      slug: "getting-started-nextjs",
      excerpt: "Learn how to build apps with Next.js",
      content: "This is a full guide on Next.js...",
      published: true,
      publishedAt: new Date(),
      thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",

      tags: {
        connect: [
          { slug: "nextjs" },
          { slug: "typescript" },
        ],
      },
    },
  });

  // -----------------------------
  // 5. EXPERIENCE
  // -----------------------------
  await prisma.experience.createMany({
    data: [
      {
        company: "Tech Company",
        role: "Frontend Developer",
        location: "Remote",
        startDate: new Date("2022-01-01"),
        isCurrent: true,
        description: "Worked on modern web apps",
        highlights: ["Built dashboards", "Improved performance"],
        technologies: ["React", "Next.js"],
        order: 1,
      },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // 6. EDUCATION
  // -----------------------------
  await prisma.education.createMany({
    data: [
      {
        degree: "BSc in Computer Science",
        school: "University",
        location: "Bangladesh",
        startDate: new Date("2020-01-01"),
        endDate: new Date("2024-01-01"),
        order: 1,
      },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // 7. CERTIFICATIONS
  // -----------------------------
  await prisma.certification.createMany({
    data: [
      {
        name: "Full Stack Web Development",
        issuer: "Coursera",
        issueDate: new Date(),
        order: 1,
      },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // 8. CONTACT MESSAGES
  // -----------------------------
  await prisma.contactMessage.createMany({
    data: [
      {
        name: "John Doe",
        email: "john@example.com",
        subject: "Project Inquiry",
        message: "Let's work together",
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        subject: "Job Offer",
        message: "We have an opportunity",
        status: "READ",
      },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // 9. SUBSCRIBERS
  // -----------------------------
  await prisma.subscriber.createMany({
    data: [
      { email: "subscriber1@example.com" },
      { email: "subscriber2@example.com" },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // 10. SITE CONFIG
  // -----------------------------
  await prisma.siteConfig.createMany({
    data: [
      { key: "site_title", value: "Raihan Portfolio" },
      { key: "hero_title", value: "Full Stack Developer" },
    ],
    skipDuplicates: true,
  });

  // prisma/seed.ts (or run via Prisma Studio)

await prisma.siteConfig.createMany({
   data: [
    {
      key: 'uses_hardware',
      value: JSON.stringify([
        {
          name: 'Personal Computer | PC',
          category: 'Computer',
          description: 'AMD Ryzen 5600G, 16GB RAM, 256GB SSD - my daily driver for development',
          image: '/images/macbook-pro.jpg',
          price: '$300',
          url: 'https://www.apple.com/macbook-pro/',
          isFavorite: true,
        },
        {
          name: 'Cinexa B22i',
          category: 'Display',
          description: '22" 1K display for crisp text and accurate colors',
          image: '/images/lg-ultrafine.jpg',
          price: '$85',
          url: 'https://www.lg.com/',
        },
        {
          name: 'iMice AN-300',
          category: 'Keyboard',
          description: 'Wired non Mechanical Keyboard',
          image: '/images/keychron-q1.jpg',
          price: '$199',
          url: 'https://www.keychron.com/',
          isFavorite: true,
        },
        {
          name: 'iMice AN-300',
          category: 'Mouse',
          description: 'Wired gaming mouse',
          image: '/images/mx-master-3s.jpg',
          price: '$99',
          url: 'https://www.logitech.com/',
        },
      ]),
      type: 'json',
    },
    {
      key: 'uses_software',
      value: JSON.stringify([
        {
          name: 'VS Code',
          category: 'IDE',
          description: 'Primary code editor with extensive extension ecosystem',
          url: 'https://code.visualstudio.com/',
          isFavorite: true,
        },
        {
          name: 'Chrome Browser',
          category: 'Browser',
          description: 'Innovative browser with spaces and vertical tabs',
          url: 'https://arc.net/',
          isFavorite: true,
        },
        {
          name: 'Powershell',
          category: 'Terminal',
          description: 'Modern terminal with AI assistance and workflows',
          url: 'https://www.warp.dev/',
        },
        {
          name: 'Figma',
          category: 'Design',
          description: 'Collaborative design tool for UI/UX work',
          url: 'https://www.figma.com/',
          isPaid: true,
        },
        {
          name: 'Focura',
          category: 'Productivity',
          description: 'All-in-one workspace for notes, docs, and project management',
          url: 'https://focura-client.vercel.app/',
          isPaid: true,
        },
      ]),
      type: 'json',
    },
    {
      key: 'uses_workflow',
      value: JSON.stringify([
        {
          title: 'Git & GitHub',
          description: 'Version control with feature branches, PR reviews, and CI/CD',
          icon: 'git',
        },
        {
          title: 'TypeScript First',
          description: 'Strict TypeScript for type safety and better DX',
          icon: 'process',
        },
        {
          title: 'Component-Driven',
          description: 'Build UIs with reusable, tested components',
          icon: 'process',
        },
        {
          title: 'Automated Testing',
          description: 'Vitest for unit tests, Playwright for E2E',
          icon: 'automation',
        },
        {
          title: 'Performance Budgets',
          description: 'Lighthouse CI to catch regressions early',
          icon: 'zap',
        },
      ]),
      type: 'json',
    },
    {
      key: 'uses_learning',
      value: JSON.stringify([
        {
          name: 'Frontend Masters',
          description: 'In-depth courses on modern web development',
          url: 'https://frontendmasters.com/',
        },
        {
          name: 'React Documentation',
          description: 'Official React docs with excellent examples',
          url: 'https://react.dev/',
        },
        {
          name: 'Web.dev',
          description: 'Google\'s guides for modern web best practices',
          url: 'https://web.dev/',
        },
        {
          name: 'CSS-Tricks',
          description: 'Practical CSS techniques and tutorials',
          url: 'https://css-tricks.com/',
        },
        {
          name: 'Smashing Magazine',
          description: 'Articles on design, UX, and front-end development',
          url: 'https://www.smashingmagazine.com/',
        },
      ]),
      type: 'json',
    },
  ],
});


  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });