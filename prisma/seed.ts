import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // 创建默认设置
    await prisma.settings.createMany({
      data: [
        {
          key: 'stripeEnabled',
          value: 'false',
          description: 'Whether Stripe payment is enabled'
        },
        {
          key: 'subscriptionEnabled',
          value: 'false',
          description: 'Whether subscription feature is enabled'
        }
      ],
      skipDuplicates: true
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