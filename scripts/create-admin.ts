import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import * as readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

async function main() {
  try {
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');
    const name = await question('Enter admin name: ');

    const hashedPassword = await hash(password, 12);

    const admin = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date()
      }
    });

    console.log('Admin user created successfully:', admin.email);
  } catch (error) {
    console.error('Failed to create admin user:', error);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main(); 