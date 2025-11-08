// /app/api/sse/route.ts

import { NextRequest } from 'next/server';
import { serverEvents } from '@/lib/sse/server-events'; // Import from server-events, not actions
import { getSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  const session = await getSession();
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache, no-transform',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });

  const stream = new ReadableStream({
    start(controller) {
      const clientId = `${session.userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const send = (data: string) => {
        controller.enqueue(new TextEncoder().encode(data));
      };

      // Add client to server events
      serverEvents.addClient(clientId, session.userId, send);

      // Send initial connection message
      send(`data: ${JSON.stringify({ event: 'connected', clientId })}\n\n`);

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        serverEvents.removeClient(clientId);
        controller.close();
      });

      // Keep connection alive with heartbeats
      const heartbeat = setInterval(() => {
        send(`data: ${JSON.stringify({ event: 'heartbeat', timestamp: Date.now() })}\n\n`);
      }, 30000);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        serverEvents.removeClient(clientId);
      });
    },
  });

  return new Response(stream, { headers });
}