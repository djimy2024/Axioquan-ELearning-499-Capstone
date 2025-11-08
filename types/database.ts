
// /types/database.ts

// Core User Tables
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  name: string;
  bio?: string;
  image?: string;
  email_verified: Date | null;
  is_active: boolean;
  last_login: Date | null;
  timezone: string;
  locale: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserProfile {
  id: string;
  user_id: string;
  display_name?: string;
  headline?: string;
  location?: string;
  company?: string;
  website?: string;
  twitter_username?: string;
  github_username?: string;
  linkedin_url?: string;
  youtube_channel?: string;
  skills: string[];
  expertise_levels: Record<string, string>;
  achievements: any;
  portfolio_urls: string[];
  social_links: any;
  learning_goals: string[];
  preferred_topics: string[];
  availability_status: string;
  created_at: Date;
  updated_at: Date;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Record<string, boolean>;
  hierarchy_level: number;
  is_system_role: boolean;
  allow_self_assign: boolean;
  created_at: Date;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  assigned_by?: string;
  assigned_at: Date;
  expires_at?: Date;
  is_primary: boolean;
  metadata: any;
}

export interface RoleRequest {
  id: string;
  user_id: string;
  requested_role_id: string;
  request_type: string;
  justification: string;
  qualifications?: string;
  portfolio_links: string[];
  teaching_experience?: string;
  supporting_documents: any;
  status: string;
  priority: string;
  reviewed_by?: string;
  reviewed_at?: Date;
  admin_notes?: string;
  rejection_reason?: string;
  created_at: Date;
  updated_at: Date;
}

// Authentication Tables
export interface Account {
  id: string;
  user_id: string;
  type: string;
  provider: string;
  provider_account_id: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
  session_state?: string;
  provider_data: any;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: string;
  user_id: string;
  session_token: string;
  access_token?: string;
  expires: Date;
  user_agent?: string;
  ip_address?: string;
  device_info: any;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface VerificationToken {
  id: string;
  identifier: string;
  token: string;
  type: string;
  expires: Date;
  used: boolean;
  used_at?: Date;
  created_at: Date;
}

// Add other interfaces for the remaining tables...