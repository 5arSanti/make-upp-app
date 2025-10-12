import { Session } from "@supabase/supabase-js";

// Supabase's Session type has token_type as "bearer", but onAuthStateChange
// sometimes returns a generic string. This type is for compatibility.
export interface AuthSession extends Omit<Session, 'token_type'> {
  token_type: string;
}

// Enum for user roles
export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  SELLER = 'seller'
}

// Role information interface
export interface Role {
  id: number;
  name: string;
  description?: string;
}

// Extended profile with role information
export interface ProfileWithRole {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  role_id?: number;
  role?: Role;
  updated_at?: string;
}