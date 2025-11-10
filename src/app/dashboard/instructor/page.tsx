
// /src/app/dashboard/instructor/page.tsx

import { withSessionRefresh } from '@/lib/auth/utils';

export default async function InstructorDashboard() {
  const session = await withSessionRefresh();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {session.name}! Manage your courses and students here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Course Management */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">My Courses</h3>
          <p className="text-sm text-gray-600 mb-4">
            Manage your teaching materials and course content
          </p>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Manage Courses
          </button>
        </div>

        {/* Student Management */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">Students</h3>
          <p className="text-sm text-gray-600 mb-4">
            View and manage your students
          </p>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
            View Students
          </button>
        </div>

        {/* Analytics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-sm text-gray-600 mb-4">
            Course performance and engagement metrics
          </p>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
            View Analytics
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
            Create New Course
          </button>
          <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
            Grade Assignments
          </button>
          <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
            Schedule Live Session
          </button>
          <button className="bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors">
            Upload Materials
          </button>
        </div>
      </div>
    </div>
  );
}