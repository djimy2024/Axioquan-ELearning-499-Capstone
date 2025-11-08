

// src/app/test-db/page.tsx:

import { testConnection } from '@lib/db/test-connection'; // ✅ Use @lib/ prefix

export default async function TestDBPage() {
  // This will run on the server when the page loads
  const isConnected = await testConnection();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <div className={`p-4 rounded-lg ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {isConnected ? (
          <div>
            <div className="font-semibold">✅ Database connected successfully!</div>
            <div className="text-sm mt-2">Check your terminal for connection details.</div>
          </div>
        ) : (
          <div>
            <div className="font-semibold">❌ Database connection failed!</div>
            <div className="text-sm mt-2">Check your terminal for error details.</div>
          </div>
        )}
      </div>
    </div>
  );
}