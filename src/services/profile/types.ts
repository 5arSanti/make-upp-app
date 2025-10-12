// Profile Types
export interface Role {
  name: string;
  description?: string;
}

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  website?: string;
  role_id?: number;
  role?: Role;
  updated_at?: string;
}

export interface CreateProfileDto {
  username: string;
  full_name: string;
  avatar_url?: string;
  website?: string;
  role_id?: number;
}

export interface UpdateProfileDto {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  role_id?: number;
}
