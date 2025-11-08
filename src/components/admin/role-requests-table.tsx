// /src/components/admin/role-requests-table.tsx

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { approveRoleRequest, rejectRoleRequest } from '@/lib/auth/role-actions';
import { toast } from 'sonner';
import { useServerEvents } from '@/hooks/use-server-events';

interface RoleRequest {
  id: string;
  requester_name: string;
  requester_email: string;
  requested_role_name: string;
  justification: string;
  qualifications?: string;
  portfolio_links: string[];
  teaching_experience?: string;
  created_at: string;
  user_id: string;
}

interface RoleRequestsTableProps {
  initialRequests: RoleRequest[];
}

export function RoleRequestsTable({ initialRequests }: RoleRequestsTableProps) {
  const [requests, setRequests] = useState<RoleRequest[]>(initialRequests);
  const [processing, setProcessing] = useState<string | null>(null);
  
  // Use real-time updates
  const { lastEvent, isConnected } = useServerEvents();

  useEffect(() => {
    setRequests(initialRequests);
  }, [initialRequests]);

  // Handle real-time events
  useEffect(() => {
    if (lastEvent) {
      switch (lastEvent.event) {
        case 'new_role_request':
          console.log('📥 Adding new request to admin table:', lastEvent.data);
          // Add new request to the list
          setRequests(prev => [lastEvent.data.request, ...prev]);
          break;
        default:
          // For other events, refresh to get updated data
          break;
      }
    }
  }, [lastEvent]);

  const handleApprove = async (requestId: string) => {
    setProcessing(requestId);
    try {
      const result = await approveRoleRequest(requestId);
      
      if (result.success) {
        toast.success('Role request approved');
        // Remove from list immediately
        setRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        toast.error(result.message || 'Failed to approve request');
      }
    } catch (error) {
      toast.error('An error occurred while approving the request');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setProcessing(requestId);
    try {
      const result = await rejectRoleRequest(requestId, reason);
      
      if (result.success) {
        toast.success('Role request rejected');
        // Remove from list immediately
        setRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        toast.error(result.message || 'Failed to reject request');
      }
    } catch (error) {
      toast.error('An error occurred while rejecting the request');
    } finally {
      setProcessing(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-lg font-medium mb-2">No pending role requests</p>
        <p className="text-sm">All requests have been processed.</p>
        <div className="mt-4 flex items-center justify-center text-sm">
          <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          {isConnected ? 'Live updates active' : 'Reconnecting...'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Pending Role Requests</h2>
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-sm text-gray-600">
              {requests.length} request{requests.length !== 1 ? 's' : ''} pending
            </span>
            <div className="flex items-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              {isConnected ? 'Live' : 'Offline'}
            </div>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-sm text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded"
        >
          Refresh
        </button>
      </div>
      
      {requests.map((request) => (
        <div key={request.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">
                {request.requester_name}
              </h3>
              <p className="text-sm text-gray-600">{request.requester_email}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-1">
                Requesting: {request.requested_role_name}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => handleApprove(request.id)}
                disabled={processing === request.id}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                {processing === request.id ? 'Approving...' : 'Approve'}
              </Button>
              <Button
                onClick={() => handleReject(request.id)}
                disabled={processing === request.id}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                {processing === request.id ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div>
              <strong>Justification:</strong>
              <p className="text-gray-700 mt-1">{request.justification}</p>
            </div>
            
            {request.qualifications && (
              <div>
                <strong>Qualifications:</strong>
                <p className="text-gray-700 mt-1">{request.qualifications}</p>
              </div>
            )}
            
            {request.teaching_experience && (
              <div>
                <strong>Teaching Experience:</strong>
                <p className="text-gray-700 mt-1">{request.teaching_experience}</p>
              </div>
            )}
            
            {request.portfolio_links && request.portfolio_links.length > 0 && (
              <div>
                <strong>Portfolio Links:</strong>
                <div className="mt-1 space-y-1">
                  {request.portfolio_links.map((link, index) => (
                    <a 
                      key={index}
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline break-all"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            <div className="text-xs text-gray-500">
              Submitted: {new Date(request.created_at).toLocaleDateString()} at {new Date(request.created_at).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}