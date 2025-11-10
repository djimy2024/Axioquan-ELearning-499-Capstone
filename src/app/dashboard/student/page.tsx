
// /src/app/dashboard/student/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';

export default async function StudentDashboard() {
  const session = await withSessionRefresh();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session.name}! Continue your learning journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">My Courses</h3>
          <p className="text-sm text-gray-600 mb-4">
            Access your enrolled courses and learning materials
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            View Courses
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">Progress</h3>
          <p className="text-sm text-gray-600 mb-4">
            Track your learning progress and achievements
          </p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
            View Progress
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">Assignments</h3>
          <p className="text-sm text-gray-600 mb-4">
            View and submit your assignments
          </p>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
            View Assignments
          </button>
        </div>
      </div>
    </div>
  );
}