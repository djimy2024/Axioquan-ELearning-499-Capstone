
// /lib/sse/actions.ts

'use server';

import { serverEvents } from './server-events';

export async function notifyRoleUpdate(userId: string, requestId: string, status: string, newRole?: string) {
  serverEvents.notifyRoleUpdate(userId, requestId, status, newRole);
  return { success: true };
}

export async function notifyRequestDeleted(userId: string, requestId: string) {
  serverEvents.notifyRequestDeleted(userId, requestId);
  return { success: true };
}

export async function notifyNewRequest(adminUserId: string, requestData: any) {
  serverEvents.notifyNewRequest(adminUserId, requestData);
  return { success: true };
}