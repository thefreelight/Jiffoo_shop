const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')
const { execSync } = require('child_process')

const prisma = new PrismaClient()

async function runMigrations() {
  try {
    console.log('Running database migrations...')
    
    // First deploy any pending migrations
    console.log('Applying pending migrations...')
    execSync('npx prisma migrate deploy', { stdio: 'inherit' })
    
    // Generate Prisma Client
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
    // Check if admin exists
    const admin = await prisma.user.findFirst({
      where: {
        email: 'admin@example.com',
        role: 'admin'
      }
    })

    if (admin) {
      console.log('Admin user already exists, skipping creation')
      return true
    }

    console.log('Creating admin account...')
    const hashedPassword = await hash('admin123', 10)
    
    const newAdmin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: '管理员',
        hashedPassword,
        role: 'admin',
        hasAccess: true,
      },
    })
    
    console.log('Admin user created successfully:', {
      id: newAdmin.id,
      email: newAdmin.email,
      name: newAdmin.name,
      role: newAdmin.role,
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
    
    // Run migrations first
    const migrationSuccess = await runMigrations()
    if (!migrationSuccess) {
      console.error('Migration failed. Please check the migration files and database state.')
      process.exit(1)
    }
    
    // Create admin user if needed
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