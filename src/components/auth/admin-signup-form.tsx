
// /src/components/auth/admin-signup-form.tsx


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { signUpUser } from '@/lib/auth/actions';

export function AdminSignUpForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    adminKey: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check admin key
      const adminRegistrationKey = process.env.NEXT_PUBLIC_ADMIN_REGISTRATION_KEY || 'axioquan-admin-2024';
      
      if (formData.adminKey !== adminRegistrationKey) {
        toast.error('Invalid admin key', {
          description: 'Please provide a valid admin registration key.',
        });
        setIsLoading(false);
        return;
      }

      // Create user with admin role
      const signUpResult = await signUpUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.name,
        role: 'admin' // 👈 This ensures admin role assignment
      });

      if (signUpResult.success && signUpResult.user) {
        toast.success('Admin account created successfully!', {
          description: 'Your admin account has been created. Please login.',
        });
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        toast.error('Admin registration failed', {
          description: signUpResult.errors?.[0] || 'Failed to create admin account',
        });
      }
    } catch (error: any) {
      console.error('❌ Admin registration error:', error);
      toast.error('Registration error', {
        description: error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
        <CardDescription>
          Create an administrator account with full platform access.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Full Name *
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium">
              Username *
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Choose a username"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password *
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password *
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="adminKey" className="text-sm font-medium">
              Admin Registration Key *
            </label>
            <Input
              id="adminKey"
              name="adminKey"
              type="password"
              placeholder="Enter admin registration key"
              value={formData.adminKey}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              This key is required for admin account creation.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <a href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
            Need a regular account?
          </a>
        </div>
      </CardContent>
    </Card>
  );
}



















// /src/components/auth/admin-signup-form.tsx

// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import { toast } from 'sonner';
// import { signUpUser } from '@/lib/auth/actions';

// export function AdminSignUpForm() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     name: '',
//     adminKey: '',
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const adminRegistrationKey = process.env.NEXT_PUBLIC_ADMIN_REGISTRATION_KEY || 'axioquan-admin-2024';
//       if (formData.adminKey !== adminRegistrationKey) {
//         toast.error('Invalid admin key', { description: 'Please provide a valid admin registration key.' });
//         setIsLoading(false);
//         return;
//       }

//       // Create user with admin role
//       const signUpResult = await signUpUser({
//         ...formData,
//         role: 'admin', // 👈 ensures it bypasses default student role
//       });

//       if (signUpResult.success && signUpResult.user) {
//         toast.success('Admin account created!', { description: 'Redirecting to login...' });
//         setTimeout(() => router.push('/login'), 1500);
//       } else {
//         toast.error('Registration failed', {
//           description: signUpResult.errors?.[0] || 'Failed to create admin account',
//         });
//       }
//     } catch (error: any) {
//       console.error('❌ Admin registration error:', error);
//       toast.error('Registration error', {
//         description: error.message || 'An unexpected error occurred. Please try again.',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card className="w-full max-w-md">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold">Admin Registration</CardTitle>
//         <CardDescription>Create an administrator account with full access.</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label htmlFor="name" className="text-sm font-medium">Full Name *</label>
//             <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required disabled={isLoading} />
//           </div>

//           <div>
//             <label htmlFor="username" className="text-sm font-medium">Username *</label>
//             <Input id="username" name="username" type="text" value={formData.username} onChange={handleChange} required disabled={isLoading} />
//           </div>

//           <div>
//             <label htmlFor="email" className="text-sm font-medium">Email *</label>
//             <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={isLoading} />
//           </div>

//           <div>
//             <label htmlFor="password" className="text-sm font-medium">Password *</label>
//             <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required disabled={isLoading} />
//           </div>

//           <div>
//             <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password *</label>
//             <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required disabled={isLoading} />
//           </div>

//           <div>
//             <label htmlFor="adminKey" className="text-sm font-medium">Admin Key *</label>
//             <Input id="adminKey" name="adminKey" type="password" value={formData.adminKey} onChange={handleChange} placeholder="Enter admin registration key" required disabled={isLoading} />
//           </div>

//           <Button type="submit" className="w-full" disabled={isLoading}>
//             {isLoading ? 'Creating Admin Account...' : 'Create Admin Account'}
//           </Button>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }
