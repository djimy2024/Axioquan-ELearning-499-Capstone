
// /lib/db/test-connection.ts:

import { sql } from './index';

export async function testConnection() {
  try {
    console.log('🔌 [SERVER] Testing database connection...');
    console.log('🔌 [SERVER] DATABASE_URL exists:', !!process.env.DATABASE_URL);
    
    // Test with a simple query
    const result = await sql`SELECT 1 as test_value, NOW() as current_time`;
    
    console.log('✅ [SERVER] Database connected successfully!');
    console.log('✅ [SERVER] Test result:', result[0]);
    
    return true;
  } catch (error: any) {
    console.error('❌ [SERVER] Database connection failed!');
    console.error('❌ [SERVER] Error details:', error.message);
    console.error('❌ [SERVER] Full error:', error);
    return false;
  }
}