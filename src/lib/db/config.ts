import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

// Use environment variables directly - no user configuration needed
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.warn('DATABASE_URL environment variable is not set. Database operations will not work.')
}

const sql = databaseUrl ? neon(databaseUrl) : null
export const db = sql ? drizzle(sql) : null
