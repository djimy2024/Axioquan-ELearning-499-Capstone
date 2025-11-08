
// /lib/auth/actions.ts

'use server';

import { sql } from '@lib/db';
import { hashPassword, validatePasswordStrength, verifyPassword } from './password';
import { SignUpFormData, LoginFormData, AuthUser } from '@/types/auth';
import { User } from '@/types/database';
import { createSession, destroySession, refreshSession } from './session';
import { redirect } from 'next/navigation';

/**
 * Handles secure user signup with optional role parameter
 */
export async function signUpUser(formData: SignUpFormData): Promise<{
  success: boolean;
  message: string;
  user?: User;
  errors?: string[];
}> {
  try {
    // 1️⃣ Validate password strength
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.isValid) {
      return {
        success: false,
        message: 'Password validation failed',
        errors: passwordValidation.errors,
      };
    }

    // 2️⃣ Confirm password match
    if (formData.password !== formData.confirmPassword) {
      return {
        success: false,
        message: 'Passwords do not match',
        errors: ['Passwords do not match'],
      };
    }

    // 3️⃣ Check for existing user
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${formData.email} OR username = ${formData.username}
    `;

    if (existingUser.length > 0) {
      return {
        success: false,
        message: 'User already exists',
        errors: ['Email or username already registered'],
      };
    }

    // 4️⃣ Hash password
    const hashedPassword = await hashPassword(formData.password);

    // 5️⃣ Create new user
    const newUserRows = await sql`
      INSERT INTO users (username, email, password, name)
      VALUES (${formData.username}, ${formData.email}, ${hashedPassword}, ${formData.name})
      RETURNING id, username, email, name, created_at, is_active, locale, timezone
    `;

    const newUser = newUserRows[0] as User;
    if (!newUser) throw new Error('User creation failed — no record returned');

    // 6️⃣ Determine role to assign (default: student, or provided role)
    const roleNameToAssign = formData.role || 'student';
    const roleRows = await sql`
      SELECT id FROM roles WHERE name = ${roleNameToAssign} LIMIT 1
    `;
    
    if (roleRows.length === 0) {
      throw new Error(`Role '${roleNameToAssign}' not found in database`);
    }

    const roleId = roleRows[0].id;

    // 7️⃣ Assign the chosen role
    await sql`
      INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
      VALUES (${newUser.id}, ${roleId}, true, NOW())
    `;

    // 8️⃣ Create empty profile
    await sql`
      INSERT INTO user_profiles (
        user_id,
        skills,
        portfolio_urls,
        learning_goals,
        preferred_topics,
        expertise_levels,
        achievements,
        social_links
      )
      VALUES (
        ${newUser.id},
        ARRAY[]::text[],
        ARRAY[]::text[],
        ARRAY[]::text[],
        ARRAY[]::text[],
        '{}'::jsonb,
        '{}'::jsonb,
        '{}'::jsonb
      )
    `;

    // ✅ Return success
    return {
      success: true,
      message: `User registered successfully as ${roleNameToAssign}`,
      user: newUser,
    };
  } catch (error: any) {
    console.error('❌ User registration error:', error);
    return {
      success: false,
      message: 'Registration failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Authenticate user with email and password
 * Returns user data without password if successful
 */
export async function loginUser(credentials: LoginFormData): Promise<{
  success: boolean;
  message: string;
  user?: AuthUser;
  errors?: string[];
}> {
  try {
    // 1️⃣ Get user and roles
    const userWithPassword = await sql`
      SELECT 
        u.*,
        ARRAY_AGG(r.name) AS roles,
        (
          SELECT r.name 
          FROM user_roles ur 
          JOIN roles r ON ur.role_id = r.id 
          WHERE ur.user_id = u.id AND ur.is_primary = true 
          LIMIT 1
        ) AS primary_role
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.email = ${credentials.email} AND u.is_active = true
      GROUP BY u.id
      LIMIT 1
    `;

    const user = userWithPassword[0] as (User & { roles: string[]; primary_role: string });
    if (!user) {
      return {
        success: false,
        message: 'Authentication failed',
        errors: ['Invalid email or password'],
      };
    }

    // 2️⃣ Verify password
    if (!user.password || !(await verifyPassword(credentials.password, user.password))) {
      return {
        success: false,
        message: 'Authentication failed',
        errors: ['Invalid email or password'],
      };
    }

    // 3️⃣ Update last login
    await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`;

    // 4️⃣ Build safe user object
    const { password: _, ...userWithoutPassword } = user;
    const authUser: AuthUser = {
      id: userWithoutPassword.id,
      username: userWithoutPassword.username,
      email: userWithoutPassword.email,
      name: userWithoutPassword.name,
      image: userWithoutPassword.image,
      roles: userWithoutPassword.roles?.filter((r) => r !== null) || [],
      primaryRole: userWithoutPassword.primary_role || 'student',
    };

    return {
      success: true,
      message: 'Login successful',
      user: authUser,
    };
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return {
      success: false,
      message: 'Login failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Login user and create session
 */
export async function loginWithSession(credentials: LoginFormData): Promise<{
  success: boolean;
  message: string;
  user?: AuthUser;
  errors?: string[];
}> {
  try {
    const result = await loginUser(credentials);

    if (result.success && result.user) {
      // ✅ Create session with proper parameters
      await createSession({
        userId: result.user.id,
        email: result.user.email,
        name: result.user.name,
        roles: result.user.roles,
        primaryRole: result.user.primaryRole,
      });

      return result;
    }

    return result;
  } catch (error: any) {
    console.error('❌ Login with session error:', error);
    return {
      success: false,
      message: 'Login failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

/**
 * Logout user and destroy session
 * @deprecated Use logoutAction instead for server actions
 */
export async function logoutUser() {
  await destroySession();
  return { success: true, message: 'Logged out successfully' };
}

/**
 * Verify user's current password (for password change functionality)
 */
export async function verifyCurrentPassword(userId: string, password: string): Promise<boolean> {
  try {
    const user = await sql`
      SELECT password FROM users WHERE id = ${userId} AND is_active = true LIMIT 1
    `;
    if (!user[0]?.password) return false;
    return await verifyPassword(password, user[0].password);
  } catch (error) {
    console.error('❌ Password verification error:', error);
    return false;
  }
}

/**
 * Fetch user by email (active only)
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE email = ${email} AND is_active = true LIMIT 1
    `;
    return users[0] as User || null;
  } catch (error) {
    console.error('❌ Error getting user by email:', error);
    return null;
  }
}

/**
 * Fetch user by ID (active only)
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE id = ${id} AND is_active = true LIMIT 1
    `;
    return users[0] as User || null;
  } catch (error) {
    console.error('❌ Error getting user by ID:', error);
    return null;
  }
}

/**
 * Server action to handle user logout with redirect
 * Use this for client components that need to trigger logout
 */
export async function logoutAction() {
  'use server';
  
  await destroySession();
  redirect('/');
}

/**
 * Refresh user session - can be called from client components
 * Returns success status and message
 */
export async function refreshUserSession(): Promise<{
  success: boolean;
  message: string;
}> {
  'use server';
  
  const refreshed = await refreshSession();
  
  if (refreshed) {
    return {
      success: true,
      message: 'Session refreshed successfully',
    };
  } else {
    return {
      success: false,
      message: 'Failed to refresh session - user not authenticated',
    };
  }
}

/**
 * Check if user is authenticated (for client components)
 * Returns basic auth status without exposing sensitive data
 */
export async function checkAuthStatus(): Promise<{
  isAuthenticated: boolean;
  user?: {
    name: string;
    email: string;
    primaryRole: string;
  };
}> {
  'use server';
  
  const { getSession } = await import('./session');
  const session = await getSession();
  
  if (!session) {
    return { isAuthenticated: false };
  }
  
  return {
    isAuthenticated: true,
    user: {
      name: session.name,
      email: session.email,
      primaryRole: session.primaryRole,
    },
  };
}

/**
 * Update user profile information
 */
export async function updateUserProfile(userId: string, profileData: {
  name?: string;
  bio?: string;
  timezone?: string;
  locale?: string;
}): Promise<{
  success: boolean;
  message: string;
  errors?: string[];
}> {
  try {
    const updatedUser = await sql`
      UPDATE users 
      SET 
        name = COALESCE(${profileData.name}, name),
        bio = COALESCE(${profileData.bio}, bio),
        timezone = COALESCE(${profileData.timezone}, timezone),
        locale = COALESCE(${profileData.locale}, locale),
        updated_at = NOW()
      WHERE id = ${userId} AND is_active = true
      RETURNING id, name, email, bio, timezone, locale
    `;

    if (updatedUser.length === 0) {
      return {
        success: false,
        message: 'User not found or inactive',
        errors: ['User not found'],
      };
    }

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error: any) {
    console.error('❌ Profile update error:', error);
    return {
      success: false,
      message: 'Profile update failed',
      errors: [error.message || 'An unexpected error occurred'],
    };
  }
}

















// /lib/auth/actions.ts

// 'use server';

// import { sql } from '@lib/db';
// import { hashPassword, validatePasswordStrength, verifyPassword } from './password';
// import { SignUpFormData, LoginFormData, AuthUser } from '@/types/auth';
// import { User } from '@/types/database';
// import { createSession, destroySession, refreshSession } from './session';
// import { redirect } from 'next/navigation';

// /**
//  * Handles secure user signup:
//  * - Validates input and password strength
//  * - Checks for duplicate user
//  * - Inserts user, assigns default or provided role, creates empty profile
//  */
// export async function signUpUser(formData: SignUpFormData & { role?: string }): Promise<{
//   success: boolean;
//   message: string;
//   user?: User;
//   errors?: string[];
// }> {
//   try {
//     // 1️⃣ Validate password strength
//     const passwordValidation = validatePasswordStrength(formData.password);
//     if (!passwordValidation.isValid) {
//       return {
//         success: false,
//         message: 'Password validation failed',
//         errors: passwordValidation.errors,
//       };
//     }

//     // 2️⃣ Confirm password match
//     if (formData.password !== formData.confirmPassword) {
//       return {
//         success: false,
//         message: 'Passwords do not match',
//         errors: ['Passwords do not match'],
//       };
//     }

//     // 3️⃣ Check for existing user
//     const existingUser = await sql`
//       SELECT id FROM users WHERE email = ${formData.email} OR username = ${formData.username}
//     `;

//     if (existingUser.length > 0) {
//       return {
//         success: false,
//         message: 'User already exists',
//         errors: ['Email or username already registered'],
//       };
//     }

//     // 4️⃣ Hash password
//     const hashedPassword = await hashPassword(formData.password);

//     // 5️⃣ Create new user
//     const newUserRows = await sql`
//       INSERT INTO users (username, email, password, name)
//       VALUES (${formData.username}, ${formData.email}, ${hashedPassword}, ${formData.name})
//       RETURNING id, username, email, name, created_at, is_active, locale, timezone
//     `;

//     const newUser = newUserRows[0] as User;
//     if (!newUser) throw new Error('User creation failed — no record returned');

//     // 6️⃣ Determine role to assign (default: student)
//     const roleNameToAssign = formData.role || 'student';
//     const roleRows = await sql`
//       SELECT id FROM roles WHERE name = ${roleNameToAssign} LIMIT 1
//     `;
//     if (roleRows.length === 0) {
//       throw new Error(`Role '${roleNameToAssign}' not found in database`);
//     }

//     const roleId = roleRows[0].id;

//     // 7️⃣ Assign the chosen role
//     await sql`
//       INSERT INTO user_roles (user_id, role_id, is_primary, assigned_at)
//       VALUES (${newUser.id}, ${roleId}, true, NOW())
//     `;

//     // 8️⃣ Create empty profile
//     await sql`
//       INSERT INTO user_profiles (
//         user_id,
//         skills,
//         portfolio_urls,
//         learning_goals,
//         preferred_topics,
//         expertise_levels,
//         achievements,
//         social_links
//       )
//       VALUES (
//         ${newUser.id},
//         ARRAY[]::text[],
//         ARRAY[]::text[],
//         ARRAY[]::text[],
//         ARRAY[]::text[],
//         '{}'::jsonb,
//         '{}'::jsonb,
//         '{}'::jsonb
//       )
//     `;

//     // ✅ Return success
//     return {
//       success: true,
//       message: 'User registered successfully',
//       user: newUser,
//     };
//   } catch (error: any) {
//     console.error('❌ User registration error:', error);
//     return {
//       success: false,
//       message: 'Registration failed',
//       errors: [error.message || 'An unexpected error occurred'],
//     };
//   }
// }

// /**
//  * Authenticate user with email and password
//  */
// export async function loginUser(credentials: LoginFormData): Promise<{
//   success: boolean;
//   message: string;
//   user?: AuthUser;
//   errors?: string[];
// }> {
//   try {
//     const userWithPassword = await sql`
//       SELECT 
//         u.*,
//         ARRAY_AGG(r.name) AS roles,
//         (
//           SELECT r.name 
//           FROM user_roles ur 
//           JOIN roles r ON ur.role_id = r.id 
//           WHERE ur.user_id = u.id AND ur.is_primary = true 
//           LIMIT 1
//         ) AS primary_role
//       FROM users u
//       LEFT JOIN user_roles ur ON u.id = ur.user_id
//       LEFT JOIN roles r ON ur.role_id = r.id
//       WHERE u.email = ${credentials.email} AND u.is_active = true
//       GROUP BY u.id
//       LIMIT 1
//     `;

//     const user = userWithPassword[0] as (User & { roles: string[]; primary_role: string });
//     if (!user) {
//       return { success: false, message: 'Authentication failed', errors: ['Invalid email or password'] };
//     }

//     // 2️⃣ Verify password
//     if (!user.password || !(await verifyPassword(credentials.password, user.password))) {
//       return { success: false, message: 'Authentication failed', errors: ['Invalid email or password'] };
//     }

//     // 3️⃣ Update last login
//     await sql`UPDATE users SET last_login = NOW() WHERE id = ${user.id}`;

//     // 4️⃣ Build safe user object
//     const { password: _, ...userWithoutPassword } = user;
//     const authUser: AuthUser = {
//       id: userWithoutPassword.id,
//       username: userWithoutPassword.username,
//       email: userWithoutPassword.email,
//       name: userWithoutPassword.name,
//       image: userWithoutPassword.image,
//       roles: userWithoutPassword.roles?.filter((r) => r !== null) || [],
//       primaryRole: userWithoutPassword.primary_role || 'student',
//     };

//     return { success: true, message: 'Login successful', user: authUser };
//   } catch (error: any) {
//     console.error('❌ Login error:', error);
//     return { success: false, message: 'Login failed', errors: [error.message || 'An unexpected error occurred'] };
//   }
// }

// /**
//  * Login user and create session
//  */
// export async function loginWithSession(credentials: LoginFormData): Promise<{
//   success: boolean;
//   message: string;
//   user?: AuthUser;
//   errors?: string[];
// }> {
//   try {
//     const result = await loginUser(credentials);
//     if (result.success && result.user) {
//       await createSession({
//         userId: result.user.id,
//         email: result.user.email,
//         name: result.user.name,
//         roles: result.user.roles,
//         primaryRole: result.user.primaryRole,
//       });
//       return result;
//     }
//     return result;
//   } catch (error: any) {
//     console.error('❌ Login with session error:', error);
//     return { success: false, message: 'Login failed', errors: [error.message || 'An unexpected error occurred'] };
//   }
// }

// /** Logout user */
// export async function logoutUser() {
//   await destroySession();
//   return { success: true, message: 'Logged out successfully' };
// }

// /** Server logout with redirect */
// export async function logoutAction() {
//   'use server';
//   await destroySession();
//   redirect('/');
// }

// /** Refresh user session */
// export async function refreshUserSession(): Promise<{ success: boolean; message: string }> {
//   'use server';
//   const refreshed = await refreshSession();
//   return refreshed
//     ? { success: true, message: 'Session refreshed successfully' }
//     : { success: false, message: 'Failed to refresh session - user not authenticated' };
// }

// /** Verify current password */
// export async function verifyCurrentPassword(userId: string, password: string): Promise<boolean> {
//   try {
//     const user = await sql`SELECT password FROM users WHERE id = ${userId} AND is_active = true LIMIT 1`;
//     if (!user[0]?.password) return false;
//     return await verifyPassword(password, user[0].password);
//   } catch {
//     return false;
//   }
// }

// /** Fetch user by email */
// export async function getUserByEmail(email: string): Promise<User | null> {
//   try {
//     const users = await sql`SELECT * FROM users WHERE email = ${email} AND is_active = true LIMIT 1`;
//     return users[0] as User || null;
//   } catch {
//     return null;
//   }
// }

// /** Fetch user by ID */
// export async function getUserById(id: string): Promise<User | null> {
//   try {
//     const users = await sql`SELECT * FROM users WHERE id = ${id} AND is_active = true LIMIT 1`;
//     return users[0] as User || null;
//   } catch {
//     return null;
//   }
// }

// /** Check auth status (used in client components) */
// export async function checkAuthStatus(): Promise<{ isAuthenticated: boolean; user?: { name: string; email: string; primaryRole: string } }> {
//   'use server';
//   const { getSession } = await import('./session');
//   const session = await getSession();
//   if (!session) return { isAuthenticated: false };
//   return { isAuthenticated: true, user: { name: session.name, email: session.email, primaryRole: session.primaryRole } };
// }

// /** Update user profile info */
// export async function updateUserProfile(
//   userId: string,
//   profileData: { name?: string; bio?: string; timezone?: string; locale?: string }
// ): Promise<{ success: boolean; message: string; errors?: string[] }> {
//   try {
//     const updatedUser = await sql`
//       UPDATE users 
//       SET 
//         name = COALESCE(${profileData.name}, name),
//         bio = COALESCE(${profileData.bio}, bio),
//         timezone = COALESCE(${profileData.timezone}, timezone),
//         locale = COALESCE(${profileData.locale}, locale),
//         updated_at = NOW()
//       WHERE id = ${userId} AND is_active = true
//       RETURNING id, name, email, bio, timezone, locale
//     `;
//     if (updatedUser.length === 0) {
//       return { success: false, message: 'User not found or inactive', errors: ['User not found'] };
//     }
//     return { success: true, message: 'Profile updated successfully' };
//   } catch (error: any) {
//     return { success: false, message: 'Profile update failed', errors: [error.message || 'Unexpected error'] };
//   }
// }
