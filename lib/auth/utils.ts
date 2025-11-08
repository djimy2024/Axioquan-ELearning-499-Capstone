
// // lib/auth/utils.ts

'use server';

import { redirect } from 'next/navigation';
import { getSession, shouldRefreshSession, refreshSession } from './session';

export async function requireAuth() {
  'use server';
  
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

/**
 * Utility to automatically refresh session if needed
 * Use this in dashboard pages to keep users logged in while active
 */
export async function withSessionRefresh() {
  'use server';
  
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  // Check if session needs refresh, but don't actually refresh here
  // to avoid cookie modification errors in layouts/pages
  const needsRefresh = await shouldRefreshSession();
  if (needsRefresh) {
    console.log('ℹ️ Session needs refresh, but refreshing will happen in server action');
  }

  return session;
}

/**
 * Server action to refresh session - call this from client components
 */
export async function refreshSessionAction() {
  'use server';
  
  return await refreshSession();
}

/**
 * Check if user has specific role
 */
export async function requireRole(role: string) {
  'use server';
  
  const session = await requireAuth();
  
  if (!session.roles.includes(role)) {
    redirect('/dashboard?error=unauthorized');
  }
  
  return session;
}

/**
 * Check if user has any of the specified roles
 */
export async function requireAnyRole(roles: string[]) {
  'use server';
  
  const session = await requireAuth();
  
  const hasRole = roles.some(role => session.roles.includes(role));
  if (!hasRole) {
    redirect('/dashboard?error=unauthorized');
  }
  
  return session;
}




// // /lib/auth/utils.ts

// 'use server';

// import { redirect } from 'next/navigation';
// import { getSession, shouldRefreshSession, refreshSession } from './session';

// export async function requireAuth() {
//   'use server';
  
//   const session = await getSession();
//   if (!session) {
//     redirect('/login');
//   }
//   return session;
// }

// /**
//  * Utility to automatically refresh session if needed
//  * Use this in dashboard pages to keep users logged in while active
//  */
// export async function withSessionRefresh() {
//   'use server';
  
//   const session = await getSession();
//   if (!session) {
//     redirect('/login');
//   }

//   // Refresh session if it's about to expire (within 15 minutes)
//   if (await shouldRefreshSession()) {
//     await refreshSession();
//     console.log('🔄 Session refreshed for user:', session.email);
//   }

//   return session;
// }

// /**
//  * Check if user has specific role
//  */
// export async function requireRole(role: string) {
//   'use server';
  
//   const session = await requireAuth();
  
//   if (!session.roles.includes(role)) {
//     redirect('/dashboard?error=unauthorized');
//   }
  
//   return session;
// }

// /**
//  * Check if user has any of the specified roles
//  */
// export async function requireAnyRole(roles: string[]) {
//   'use server';
  
//   const session = await requireAuth();
  
//   const hasRole = roles.some(role => session.roles.includes(role));
//   if (!hasRole) {
//     redirect('/dashboard?error=unauthorized');
//   }
  
//   return session;
// }