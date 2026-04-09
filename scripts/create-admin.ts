// scripts/create-admin.ts
import "dotenv/config";
import bcrypt from 'bcryptjs';
import * as readline from 'readline';
import { prisma } from "@/lib/prisma";


// ✅ Helper function to ask questions properly
function question(rl: readline.Interface, query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      resolve(answer);
    });
  });
}

async function createAdmin() {
  console.log('🔐 Create Admin User\n');

  // ✅ Create readline interface ONCE at the start
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    // ✅ Ask all questions BEFORE closing readline
    const email = await question(rl, 'Email: ');
    const password = await question(rl, 'Password: ');
    const name = await question(rl, 'Name: ');

    // ✅ Validate input
    if (!email || !password || !name) {
      console.error('❌ All fields are required.');
      return;
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create admin user
    await prisma.user.create({
       data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN',
      },
    });

    console.log('\n✅ Admin user created successfully!');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Name: ${name}`);
    console.log(`\n🔐 You can now login at: http://localhost:3000/admin/login`);

  } catch (error: any) {
    console.error('❌ Error creating admin:', error.message || error);
    
    // Handle duplicate email error
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      console.log('\n💡 Hint: This email already exists. Try a different email or login instead.');
    }
  } finally {
    // ✅ Close readline interface AFTER all questions are done
    rl.close();
    await prisma.$disconnect();
  }
}

// ✅ Run the function
createAdmin().catch(console.error);