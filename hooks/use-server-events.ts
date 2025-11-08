// /hooks/use-server-events.ts

'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ServerEvent {
  event: string;
  data: any;
}

export function useServerEvents() {
  const eventSourceRef = useRef<EventSource | null>(null);
  const router = useRouter();
  const [lastEvent, setLastEvent] = useState<ServerEvent | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    // Don't run on server
    if (typeof window === 'undefined') return;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      const eventSource = new EventSource('/api/sse');
      
      eventSource.onopen = () => {
        console.log('✅ SSE connection established');
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const serverEvent: ServerEvent = JSON.parse(event.data);
          console.log('📨 Received SSE event:', serverEvent);
          
          // Update last event for components to react to
          setLastEvent(serverEvent);
          
          switch (serverEvent.event) {
            case 'role_request_updated':
              console.log('🔄 Role request updated:', serverEvent.data);
              // Force refresh to get updated session and data
              router.refresh();
              break;
              
            case 'role_request_deleted':
              console.log('🗑️ Role request deleted:', serverEvent.data);
              router.refresh();
              break;
              
            case 'new_role_request':
              console.log('📥 New role request:', serverEvent.data);
              router.refresh();
              break;
              
            case 'heartbeat':
              // Keep connection alive
              break;
              
            default:
              console.log('📨 Unknown event:', serverEvent);
          }
        } catch (error) {
          console.error('❌ Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('❌ SSE error:', error);
        setIsConnected(false);
        // Attempt reconnect after delay
        setTimeout(() => {
          console.log('🔄 Attempting SSE reconnection...');
          connect();
        }, 5000);
      };

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error('❌ Failed to create EventSource:', error);
      setIsConnected(false);
    }
  }, [router]);

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    // Only connect on client side
    if (typeof window !== 'undefined') {
      connect();
    }
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { 
    connect, 
    disconnect, 
    lastEvent,
    isConnected
  };
}