
// /src/app/layout.tsx

// /src/app/layout.tsx

import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}