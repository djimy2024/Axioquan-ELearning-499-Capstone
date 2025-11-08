
// /src/components/auth/logout-button.tsx

// /src/components/auth/logout-button.tsx

'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/lib/auth/actions';

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutAction();
      // The redirect happens in the server action
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback client-side redirect
      router.push('/');
      router.refresh();
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleLogout}
      className="w-full justify-start text-gray-600 hover:bg-gray-50"
    >
      Sign Out
    </Button>
  );
}
