
// /lib/db/index.ts:

// /lib/db/index.ts

import { neon } from '@neondatabase/serverless';

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create and export the sql instance
export const sql = neon(process.env.DATABASE_URL);

// Optional: Add connection test helper
export async function testConnection() {
  try {
    const result = await sql`SELECT 1 as test_value, NOW() as current_time`;
    return { success: true, data: result };
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return { success: false, error };
  }
}