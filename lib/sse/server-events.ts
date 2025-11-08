// /lib/sse/server-events.ts

// Remove 'use server' - this is a regular server-side module, not a server action file

interface Client {
  id: string;
  userId: string;
  send: (data: string) => void;
}

class ServerEventManager {
  private clients: Map<string, Client> = new Map();

  addClient(clientId: string, userId: string, sendFunction: (data: string) => void) {
    this.clients.set(clientId, {
      id: clientId,
      userId,
      send: sendFunction
    });
    console.log(`✅ Client connected: ${clientId} for user: ${userId}`);
  }

  removeClient(clientId: string) {
    this.clients.delete(clientId);
    console.log(`❌ Client disconnected: ${clientId}`);
  }

  sendToUser(userId: string, event: string, data: any) {
    let sentCount = 0;
    this.clients.forEach(client => {
      if (client.userId === userId) {
        client.send(`data: ${JSON.stringify({ event, data })}\n\n`);
        sentCount++;
      }
    });
    console.log(`📤 Sent ${event} to ${sentCount} clients for user ${userId}`);
    return sentCount;
  }

  sendToAll(event: string, data: any) {
    let sentCount = 0;
    this.clients.forEach(client => {
      client.send(`data: ${JSON.stringify({ event, data })}\n\n`);
      sentCount++;
    });
    console.log(`📤 Sent ${event} to all ${sentCount} clients`);
    return sentCount;
  }

  // Specific event helpers
notifyRoleUpdate(userId: string, requestId: string, status: string, newRole?: string) {
  const message = {
    requestId,
    status,
    newRole,
    timestamp: new Date().toISOString(),
    // Add logout instruction for approved requests
    ...(status === 'approved' && {
      requiresLogout: true,
      message: 'Your role has been upgraded! Please log in again to access your new permissions.'
    })
  };
  
  return this.sendToUser(userId, 'role_request_updated', message);
}

  notifyRequestDeleted(userId: string, requestId: string) {
    return this.sendToUser(userId, 'role_request_deleted', {
      requestId,
      timestamp: new Date().toISOString()
    });
  }

  notifyNewRequest(adminUserId: string, requestData: any) {
    return this.sendToUser(adminUserId, 'new_role_request', {
      request: requestData,
      timestamp: new Date().toISOString()
    });
  }
}

// Singleton instance
export const serverEvents = new ServerEventManager();