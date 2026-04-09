import { prisma } from "@/lib/prisma";
import "dotenv/config";

async function main() {
  await prisma.$connect();
  console.log("Connected successfully");
}

main();