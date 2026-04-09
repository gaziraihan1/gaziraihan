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
      { name: "Next.js", slug: "nextjs", color: "#000000" },
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
  // 3. PROJECT
  // -----------------------------
  const project = await prisma.project.upsert({
    where: { slug: "ecommerce-dashboard" },
    update: {},
    create: {
      title: "E-Commerce Dashboard",
      slug: "ecommerce-dashboard",
      summary: "Analytics dashboard for online stores",
      description: "Full dashboard built with Next.js, Prisma, PostgreSQL",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
      images: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
      ],
      demoUrl: "https://demo.example.com",
      repoUrl: "https://github.com/yourusername/project",
      featured: true,
      status: "LIVE",
      order: 1,

      tags: {
        connect: [
          { slug: "typescript" },
          { slug: "nextjs" },
        ],
      },

      metrics: {
        create: [
          { label: "Performance", value: "+60%" },
          { label: "Users", value: "10k+" },
        ],
      },
    },
  });

  // -----------------------------
  // 4. BLOG POST
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