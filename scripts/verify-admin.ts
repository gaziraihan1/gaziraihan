// Test script: scripts/verify-admin.ts
import { prisma } from '@/lib/prisma';

async function verifyAdmin() {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (admin) {
    console.log('✅ Admin user found:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Role: ${admin.role}`);
  } else {
    console.log('❌ No admin user found. Run seed script first.');
  }
}

verifyAdmin();