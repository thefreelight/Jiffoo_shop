import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // 创建默认设置
    await prisma.settings.create({
      data: {
        stripeEnabled: false,
        subscriptionEnabled: false
      }
    });

    // 创建默认管理员
    const hashedPassword = await hash('admin123', 12);
    await prisma.user.create({
      data: {
        email: 'admin@jiffoo.com',
        name: 'Admin',
        hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date()
      }
    });

    console.log('Seed data created successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 