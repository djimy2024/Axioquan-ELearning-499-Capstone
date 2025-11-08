
// /src/components/users/refresh-wrapper.tsx

'use client';

import { useState } from 'react';
import { RoleUpgradeForm } from './role-upgrade-form';
import { RoleRequestsList } from './role-requests-list';

interface RefreshWrapperProps {
  initialAvailableRoles: any[];
  initialUserRequests: any[];
}

export function RefreshWrapper({ initialAvailableRoles, initialUserRequests }: RefreshWrapperProps) {
  const [userRequests, setUserRequests] = useState(initialUserRequests);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRequestSubmitted = async () => {
    console.log('🔄 Refreshing role requests...');
    setIsRefreshing(true);
    
    try {
      // Simulate a delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would fetch the updated requests from an API
      // For now, we'll just reload the page to get fresh data
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing requests:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    window.location.reload();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Request Role Upgrade
        </h1>
        <p className="text-gray-600 mt-2">
          Request additional permissions and capabilities for your account.
        </p>
        {initialAvailableRoles.length === 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800">
              <strong>Note:</strong> No upgrade roles are currently available. 
              This might be a temporary issue. Please try again later.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upgrade Form */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Request New Role
          </h2>
          <RoleUpgradeForm 
            availableRoles={initialAvailableRoles} 
            onRequestSubmitted={handleRequestSubmitted}
          />
        </div>

        {/* Previous Requests */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Your Role Requests ({userRequests.length})
            </h2>
            <button 
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
          <RoleRequestsList requests={userRequests} />
        </div>
      </div>
    </div>
  );
}