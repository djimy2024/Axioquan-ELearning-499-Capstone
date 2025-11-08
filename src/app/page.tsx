
// /src/app/page.tsx



import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  // ✅ REMOVED session check - homepage should always be public
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900">AxioQuan</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* ✅ ALWAYS show public navigation */}
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 text-center flex-grow">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Learn Without Limits
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join AxioQuan — the modern e-learning platform where students thrive, 
          instructors inspire, and knowledge knows no boundaries.
        </p>
        
        <div className="flex justify-center space-x-4">
          {/* ✅ ALWAYS show public call-to-action buttons */}
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-3">
              Start Learning Free
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Sign In
            </Button>
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">🎓</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">For Students</h3>
            <p className="text-gray-600">
              Access courses, track progress, and achieve your learning goals with interactive content.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">👨‍🏫</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">For Instructors</h3>
            <p className="text-gray-600">
              Create engaging courses, manage students, and share your expertise with the world.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Modern Platform</h3>
            <p className="text-gray-600">
              Built with cutting-edge technology for the best learning experience.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ Admin Registration Link (Optional Footer Section) */}
      <footer className="mt-8 mb-8 text-center">
        <Link 
          href="/admin-signup" 
          className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Admin Registration
        </Link>
      </footer>
    </div>
  );
}





// import Link from 'next/link';
// import { Button } from '@/components/ui/button';

// export default function HomePage() {
//   // ✅ REMOVED session check - homepage should always be public
  
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Navigation */}
//       <nav className="border-b bg-white/80 backdrop-blur-sm">
//         <div className="container mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
//               <span className="text-xl font-bold text-gray-900">AxioQuan</span>
//             </div>
            
//             <div className="flex items-center space-x-4">
//               {/* ✅ ALWAYS show public navigation */}
//               <Link href="/login">
//                 <Button variant="outline">Sign In</Button>
//               </Link>
//               <Link href="/signup">
//                 <Button>Get Started</Button>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <main className="container mx-auto px-4 py-16 text-center">
//         <h1 className="text-5xl font-bold text-gray-900 mb-6">
//           Learn Without Limits
//         </h1>
//         <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
//           Join AxioQuan - the modern e-learning platform where students thrive, 
//           instructors inspire, and knowledge knows no boundaries.
//         </p>
        
//         <div className="flex justify-center space-x-4">
//           {/* ✅ ALWAYS show public call-to-action buttons */}
//           <Link href="/signup">
//             <Button size="lg" className="text-lg px-8 py-3">
//               Start Learning Free
//             </Button>
//           </Link>
//           <Link href="/login">
//             <Button variant="outline" size="lg" className="text-lg px-8 py-3">
//               Sign In
//             </Button>
//           </Link>
//         </div>
//       </main>

//       {/* Features Section */}
//       <section className="container mx-auto px-4 py-16">
//         <div className="grid md:grid-cols-3 gap-8">
//           <div className="text-center p-6">
//             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//               <span className="text-blue-600 text-xl">🎓</span>
//             </div>
//             <h3 className="text-xl font-semibold mb-2">For Students</h3>
//             <p className="text-gray-600">
//               Access courses, track progress, and achieve your learning goals with interactive content.
//             </p>
//           </div>
          
//           <div className="text-center p-6">
//             <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//               <span className="text-green-600 text-xl">👨‍🏫</span>
//             </div>
//             <h3 className="text-xl font-semibold mb-2">For Instructors</h3>
//             <p className="text-gray-600">
//               Create engaging courses, manage students, and share your expertise with the world.
//             </p>
//           </div>
          
//           <div className="text-center p-6">
//             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
//               <span className="text-purple-600 text-xl">⚡</span>
//             </div>
//             <h3 className="text-xl font-semibold mb-2">Modern Platform</h3>
//             <p className="text-gray-600">
//               Built with cutting-edge technology for the best learning experience.
//             </p>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }