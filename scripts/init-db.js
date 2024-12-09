const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')
const { execSync } = require('child_process')

const prisma = new PrismaClient()

async function checkDatabaseStatus() {
  try {
    // 尝试查询用户表，如果成功说明数据库已经初始化
    const userCount = await prisma.user.count()
    return { exists: true, isEmpty: userCount === 0 }
  } catch (error) {
    if (error.code === 'P2021') {  // 表不存在的错误码
      return { exists: false, isEmpty: true }
    }
    // 其他错误
    throw error
  }
}

async function checkAdminExists() {
  try {
    const admin = await prisma.user.findFirst({
      where: {
        email: 'admin@example.com',
        role: 'admin'
      }
    })
    return !!admin
  } catch (error) {
    if (error.code === 'P2021') {  // 表不存在的错误码
      return false
    }
    throw error
  }
}

async function runMigrations(reset = false) {
  try {
    console.log('Running database migrations...')
    
    if (reset) {
      // 只在需要时重置数据库
      console.log('Resetting database...')
      execSync('npx prisma migrate reset --force --skip-seed', { stdio: 'inherit' })
    } else {
      // 否则只运行待处理的迁移
      console.log('Applying pending migrations...')
      execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    }
    
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
    // 检查管理员是否已存在
    const adminExists = await checkAdminExists()
    if (adminExists) {
      console.log('Admin user already exists, skipping creation')
      return true
    }

    console.log('Creating admin account...')
    const hashedPassword = await hash('admin123', 10)
    
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
    
    // 检查数据库状态
    const { exists, isEmpty } = await checkDatabaseStatus()
    console.log('Database status:', { exists, isEmpty })
    
    // 只在数据库不存在或为空时运行完整迁移
    const migrationSuccess = await runMigrations(!exists || isEmpty)
    if (!migrationSuccess) {
      console.error('Migration failed. Please check the migration files and database state.')
      process.exit(1)
    }
    
    // 检查并创建管理员账户（如果需要）
    console.log('Checking admin user...')
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