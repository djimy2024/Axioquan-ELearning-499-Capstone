
// /src/app/dashboard/layout.tsx

import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { LogoutButton } from '@/components/auth/logout-button';
import { RealTimeProvider } from '@/components/providers/realtime-provider';
import { RoleRefreshHandler } from '@/components/auth/role-refresh-handler';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  // Use primaryRole for role-based navigation
  const userRole = session.primaryRole;
  const userRoles = session.roles;

  return (
    <RealTimeProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white shadow-sm min-h-screen border-r">
            <div className="p-6 border-b">
              <h1 className="text-xl font-bold text-gray-900">AxioQuan</h1>
              <p className="text-sm text-gray-600">Dashboard</p>
              <p className="text-xs text-gray-500 mt-1">
                Welcome, {session.name}
              </p>
              <p className="text-xs text-gray-400 capitalize">
                Role: {userRole}
              </p>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Live Updates Active
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {/* Main Navigation */}
              <a 
                href="/dashboard" 
                className="block py-2 px-4 text-blue-600 bg-blue-50 rounded-lg transition-colors"
              >
                Overview
              </a>
              <a 
                href="/dashboard/profile" 
                className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Profile
              </a>
              <a 
                href="/dashboard/courses" 
                className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Courses
              </a>

              {/* Admin Panel Link - Only for Admin Users */}
              {userRoles.includes('admin') && (
                <a 
                  href="/dashboard/admin" 
                  className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Admin Panel
                </a>
              )}

              {/* Role Upgrade Link - Only for Students */}
              {userRole === 'student' && (
                <a 
                  href="/dashboard/request-upgrade" 
                  className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Request Upgrade
                </a>
              )}

              {/* Instructor-specific links */}
              {userRole === 'instructor' && (
                <>
                  <a 
                    href="/dashboard/instructor/courses" 
                    className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    My Courses
                  </a>
                  <a 
                    href="/dashboard/instructor/create" 
                    className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Create Course
                  </a>
                </>
              )}

              {/* Teaching Assistant-specific links */}
              {userRole === 'teaching_assistant' && (
                <a 
                  href="/dashboard/assistant" 
                  className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Assistant Dashboard
                </a>
              )}

              {/* Logout Button */}
              <LogoutButton />
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8">
            <RoleRefreshHandler />
            {children}
          </main>
        </div>
      </div>
    </RealTimeProvider>
  );
}