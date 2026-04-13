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

  await prisma.hardware.createMany({
    data: [
      {
        name: 'Personal Computer | PC',
        category: 'Computer',
        description: 'AMD Ryzen 5600G, 16GB RAM, 256GB SSD - my daily driver for development',
        imageUrl: '/images/macbook-pro.jpg',
        purchaseUrl: 'https://www.apple.com/macbook-pro/',
        price: '$300',
        isFavorite: true,
        order: 1,
      },
      {
        name: 'Cinexa B22i',
        category: 'Display',
        description: '22" 1K display for crisp text and accurate colors',
        imageUrl: '/images/lg-ultrafine.jpg',
        purchaseUrl: 'https://www.lg.com/',
        price: '$85',
        isFavorite: false,
        order: 2,
      },
      {
        name: 'iMice AN-300',
        category: 'Keyboard',
        description: 'Wired non Mechanical Keyboard',
        imageUrl: '/images/keychron-q1.jpg',
        purchaseUrl: 'https://www.keychron.com/',
        price: '$199',
        isFavorite: true,
        order: 3,
      },
      {
        name: 'iMice AN-300',
        category: 'Mouse',
        description: 'Wired gaming mouse',
        imageUrl: '/images/mx-master-3s.jpg',
        purchaseUrl: 'https://www.logitech.com/',
        price: '$99',
        isFavorite: false,
        order: 4,
      },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // 11. SOFTWARE (for /uses page)
  // -----------------------------
  await prisma.software.createMany({
    data: [
      {
        name: 'VS Code',
        category: 'IDE',
        description: 'Primary code editor with extensive extension ecosystem',
        websiteUrl: 'https://code.visualstudio.com/',
        isPaid: false,
        isFavorite: true,
        order: 1,
      },
      {
        name: 'Chrome Browser',
        category: 'Browser',
        description: 'Fast and secure web browsing',
        websiteUrl: 'https://chrome.google.com/',
        isPaid: false,
        isFavorite: true,
        order: 2,
      },
      {
        name: 'Powershell',
        category: 'Terminal',
        description: 'Modern terminal with AI assistance and workflows',
        websiteUrl: 'https://learn.microsoft.com/powershell/',
        isPaid: false,
        isFavorite: false,
        order: 3,
      },
      {
        name: 'Figma',
        category: 'Design',
        description: 'Collaborative design tool for UI/UX work',
        websiteUrl: 'https://www.figma.com/',
        isPaid: true,
        isFavorite: false,
        order: 4,
      },
      {
        name: 'Focura',
        category: 'Productivity',
        description: 'All-in-one workspace for notes, docs, and project management',
        websiteUrl: 'https://focura-client.vercel.app/',
        isPaid: true,
        isFavorite: false,
        order: 5,
      },
    ],
    skipDuplicates: true,
  });

  // -----------------------------
  // 12. SITE CONFIG (keep simple config only)
  // -----------------------------
  await prisma.siteConfig.createMany({
    data: [
      { key: 'site_title', value: 'Raihan Portfolio', type: 'string' },
      { key: 'hero_title', value: 'Full Stack Developer', type: 'string' },
      // Keep workflow/learning as JSON if you want
      {
        key: 'uses_workflow',
        value: JSON.stringify([
          { title: 'Git & GitHub', description: 'Version control with feature branches', icon: 'git' },
          { title: 'TypeScript First', description: 'Strict TypeScript for type safety', icon: 'process' },
        ]),
        type: 'json',
      },
      {
        key: 'uses_learning',
        value: JSON.stringify([
          { name: 'Frontend Masters', description: 'In-depth courses', url: 'https://frontendmasters.com/' },
          { name: 'React Documentation', description: 'Official React docs', url: 'https://react.dev/' },
        ]),
        type: 'json',
      },
    ],
    skipDuplicates: true,
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