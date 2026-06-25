// Quick connection test script
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function test() {
  try {
    await prisma.$connect();
    console.log('✅ Connected to Supabase PostgreSQL!');
    
    const result = await prisma.$queryRaw`SELECT current_database() as db, current_user as usr`;
    console.log('Database info:', result);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await prisma.$disconnect();
    pool.end();
  }
}

test();
