
// /src/components/auth/role-refresh-handler.tsx

'use client';

import { useServerEvents } from '@/hooks/use-server-events';
import { useEffect } from 'react';
import { logoutAction } from '@/lib/auth/actions';

export function RoleRefreshHandler() {
  const { lastEvent } = useServerEvents();

  useEffect(() => {
    if (lastEvent?.event === 'role_request_updated' && lastEvent.data.status === 'approved') {
      console.log('🎯 Role upgrade approved, forcing logout...');
      
      // Show a message to the user
      const showLogoutMessage = () => {
        alert(`🎉 Your role has been upgraded to ${lastEvent.data.newRole}!\n\nYou need to log in again to access your new permissions.`);
      };
      
      // Show message and then logout
      showLogoutMessage();
      
      // Force logout after a short delay
      setTimeout(async () => {
        try {
          await logoutAction();
        } catch (error) {
          console.error('Logout error:', error);
          // Fallback: redirect to login
          window.location.href = '/login';
        }
      }, 2000);
    }
  }, [lastEvent]);

  return null;
}