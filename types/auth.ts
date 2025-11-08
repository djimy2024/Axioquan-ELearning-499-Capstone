
// /types/auth.ts

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  role?: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name: string;
  image?: string;
  roles: string[];
  primaryRole: string;
}

export interface AuthSession {
  user: AuthUser;
  expires: Date;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: AuthUser;
  errors?: string[];
}