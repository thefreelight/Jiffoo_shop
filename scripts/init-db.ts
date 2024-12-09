import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // 确保数据库表已创建
    await prisma.$executeRaw`SELECT 1`;
    console.log('Database connection successful');

    // 检查是否已存在管理员用户
    const adminExists = await prisma.user.findFirst({
      where: {
        role: 'ADMIN'
      }
    });

    if (!adminExists) {
      // 创建默认管理员账户
      const hashedPassword = await hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
      await prisma.user.create({
        data: {
          email: process.env.ADMIN_EMAIL || 'admin@jiffoo.com',
          name: 'Admin',
          hashedPassword,
          role: 'ADMIN',
          emailVerified: new Date()
        }
      });
      console.log('Default admin user created');
    }

    // 检查并创建默认设置
    const stripeEnabledSetting = await prisma.settings.findFirst({
      where: { key: 'stripeEnabled' }
    });

    if (!stripeEnabledSetting) {
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
        ]
      });
      console.log('Default settings created');
    }

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 