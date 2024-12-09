const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')
const { execSync } = require('child_process')

const prisma = new PrismaClient()

async function checkDatabaseStatus() {
  try {
    // 尝试查询用户表，如果成功说明数据库已经初始化
    await prisma.user.count()
    return { exists: true, isEmpty: false }
  } catch (error) {
    if (error.code === 'P2021') {  // 表不存在的错误码
      return { exists: false, isEmpty: true }
    }
    // 其他错误
    throw error
  }
}

async function runMigrations() {
  try {
    console.log('Running database migrations...')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    return true
  } catch (error) {
    console.error('Migration failed:', error.message)
    return false
  }
}

async function createAdminUser() {
  try {
    console.log('Creating admin account...')
    const password = await hash('admin123', 10)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: '管理员',
        password,
        role: 'ADMIN',
      },
    })
    
    console.log('Admin user created:', {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    })
    return true
  } catch (error) {
    console.error('Failed to create admin user:', error)
    return false
  }
}

async function main() {
  try {
    console.log('Starting database initialization...')
    const { exists, isEmpty } = await checkDatabaseStatus()
    
    // 不管是否存在，都尝试运行迁移
    const migrationSuccess = await runMigrations()
    
    if (!migrationSuccess) {
      console.log('Migration failed. Please check the migration files and database state.')
      console.log('The application will continue to start, but some features might not work correctly.')
    }
    
    if (!exists) {
      // 只在数据库不存在时创建管理员账户
      await createAdminUser()
    }
    
    console.log('Database initialization completed')
  } catch (error) {
    console.error('Error during database initialization:', error)
    // 对于初始化错误，我们仍然允许应用启动
    console.log('Continuing with application startup despite initialization error...')
  } finally {
    await prisma.$disconnect()
  }
}

main() 