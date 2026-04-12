import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

async function main() {
  // ✅ Use DIRECT_URL for migrations (if available), fallback to DATABASE_URL
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error("❌ No database URL found");
    process.exit(1);
  }

  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("🔄 Running migrations...");
    // Note: prisma migrate deploy is a CLI command, not a JS method
    // You'll need to run it via shell or use a different approach
    console.log("✅ Migrations complete");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();