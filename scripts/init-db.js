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
    
    // 先尝试重置数据库，但不运行 seed
    console.log('Resetting database...')
    execSync('npx prisma migrate reset --force --skip-seed', { stdio: 'inherit' })
    
    // 然后运行迁移
    console.log('Applying migrations...')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    
    // 生成 Prisma Client
    console.log('Generating Prisma Client...')
    execSync('npx prisma generate', { stdio: 'inherit' })
    
    return true
  } catch (error) {
    console.error('Migration failed:', error.message)
    if (error.stdout) console.error('Migration stdout:', error.stdout.toString())
    if (error.stderr) console.error('Migration stderr:', error.stderr.toString())
    return false
  }
}

async function createAdminUser() {
  try {
    console.log('Creating admin account...')
    const hashedPassword = await hash('admin123', 10)
    
    // 先检查是否已存在管理员账户
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' }
    })
    
    if (existingAdmin) {
      console.log('Admin user already exists:', {
        id: existingAdmin.id,
        email: existingAdmin.email,
        name: existingAdmin.name,
        role: existingAdmin.role,
      })
      return true
    }
    
    // 创建新的管理员账户
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: '管理员',
        hashedPassword,
        role: 'admin',
        hasAccess: true,
      },
    })
    
    console.log('Admin user created successfully:', {
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
    
    // 运行迁移
    const migrationSuccess = await runMigrations()
    if (!migrationSuccess) {
      console.error('Migration failed. Please check the migration files and database state.')
      process.exit(1)
    }
    
    // 创建管理员账户
    console.log('Attempting to create admin user...')
    const adminCreated = await createAdminUser()
    if (!adminCreated) {
      console.error('Failed to create admin user')
      process.exit(1)
    }
    
    console.log('Database initialization completed successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error during database initialization:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main() 