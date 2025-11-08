
// /lib/db/queries/cleanup.ts

import { sql } from '../index';

/**
 * Clean up users with both student and upgraded roles
 */
export async function cleanupDualRoles(): Promise<{
  success: boolean;
  message: string;
  fixedUsers: any[];
  errors?: string[];
}> {
  try {
    console.log('🧹 Cleaning up users with dual roles...');

    // Find users with both student and upgraded roles
    const usersWithDualRoles = await sql`
      SELECT 
        u.id as user_id,
        u.username,
        u.email,
        u.name,
        STRING_AGG(r.name, ', ') as current_roles,
        COUNT(ur.id) as role_count
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE r.name IN ('instructor', 'teaching_assistant')
      AND u.id IN (
        SELECT u2.id
        FROM users u2
        JOIN user_roles ur2 ON u2.id = ur2.user_id
        JOIN roles r2 ON ur2.role_id = r2.id
        WHERE r2.name = 'student'
      )
      GROUP BY u.id, u.username, u.email, u.name
      HAVING COUNT(ur.id) >= 2
    `;

    console.log(`📊 Found ${usersWithDualRoles.length} users with dual roles`);

    const fixedUsers = [];
    const errors = [];

    // Get student role ID
    const studentRole = await sql`
      SELECT id FROM roles WHERE name = 'student' LIMIT 1
    `;
    const studentRoleId = studentRole[0]?.id;

    for (const user of usersWithDualRoles) {
      try {
        console.log(`🔄 Fixing user: ${user.username} (${user.user_id})`);
        
        // Remove student role
        if (studentRoleId) {
          await sql`
            DELETE FROM user_roles 
            WHERE user_id = ${user.user_id} AND role_id = ${studentRoleId}
          `;
        }

        // Set upgraded role as primary
        await sql`
          UPDATE user_roles 
          SET is_primary = true 
          WHERE user_id = ${user.user_id} 
          AND role_id IN (
            SELECT id FROM roles 
            WHERE name IN ('instructor', 'teaching_assistant')
          )
        `;

        // Verify fix
        const finalRoles = await sql`
          SELECT r.name, ur.is_primary
          FROM user_roles ur
          JOIN roles r ON ur.role_id = r.id
          WHERE ur.user_id = ${user.user_id}
          ORDER BY ur.is_primary DESC
        `;

        fixedUsers.push({
          userId: user.user_id,
          username: user.username,
          before: user.current_roles,
          after: finalRoles.map((r: any) => r.name).join(', '),
          primaryRole: finalRoles.find((r: any) => r.is_primary)?.name
        });

        console.log(`✅ Fixed ${user.username}: ${user.current_roles} → ${finalRoles.map((r: any) => r.name).join(', ')}`);
      } catch (error: any) {
        errors.push(`Failed to fix user ${user.username}: ${error.message}`);
        console.error(`❌ Error fixing user ${user.username}:`, error);
      }
    }

    return {
      success: true,
      message: `Cleaned up ${fixedUsers.length} users with dual roles`,
      fixedUsers,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error: any) {
    console.error('❌ Cleanup error:', error);
    return {
      success: false,
      message: 'Failed to cleanup dual roles',
      errors: [error.message || 'An unexpected error occurred'],
      fixedUsers: []
    };
  }
}

/**
 * Fix specific user with dual roles
 */
export async function fixUserDualRoles(userId: string): Promise<{
  success: boolean;
  message: string;
  before?: string;
  after?: string;
  errors?: string[];
}> {
  try {
    console.log(`🔄 Fixing dual roles for user: ${userId}`);

    // Get current roles
    const currentRoles = await sql`
      SELECT r.name, ur.is_primary
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = ${userId}
      ORDER BY ur.is_primary DESC
    `;

    const before = currentRoles.map((r: any) => r.name).join(', ');

    // Get student role ID
    const studentRole = await sql`
      SELECT id FROM roles WHERE name = 'student' LIMIT 1
    `;
    const studentRoleId = studentRole[0]?.id;

    // Remove student role
    if (studentRoleId) {
      await sql`
        DELETE FROM user_roles 
        WHERE user_id = ${userId} AND role_id = ${studentRoleId}
      `;
    }

    // Set upgraded role as primary
    await sql`
      UPDATE user_roles 
      SET is_primary = true 
      WHERE user_id = ${userId} 
      AND role_id IN (
        SELECT id FROM roles 
        WHERE name IN ('instructor', 'teaching_assistant')
      )
    `;

    // Get final roles
    const finalRoles = await sql`
      SELECT r.name, ur.is_primary
      FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = ${userId}
      ORDER BY ur.is_primary DESC
    `;

    const after = finalRoles.map((r: any) => r.name).join(', ');
    const primaryRole = finalRoles.find((r: any) => r.is_primary)?.name;

    console.log(`✅ Fixed user ${userId}: ${before} → ${after}`);

    return {
      success: true,
      message: `Fixed user roles: ${before} → ${after}`,
      before,
      after
    };
  } catch (error: any) {
    console.error('❌ Fix user dual roles error:', error);
    return {
      success: false,
      message: 'Failed to fix user dual roles',
      errors: [error.message || 'An unexpected error occurred']
    };
  }
}