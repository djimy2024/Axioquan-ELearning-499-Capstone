// /src/components/providers/realtime-provider.tsx

'use client';

import { useServerEvents } from '@/hooks/use-server-events';
import { useEffect } from 'react';

export function RealTimeProvider({ children }: { children: React.ReactNode }) {
  const { connect, disconnect } = useServerEvents();

  useEffect(() => {
    // This will only run on the client side
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return <>{children}</>;
}