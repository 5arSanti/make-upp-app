// Profile Types
export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  website?: string;
  updated_at?: string;
}

export interface CreateProfileDto {
  username: string;
  full_name: string;
  avatar_url?: string;
  website?: string;
}

export interface UpdateProfileDto {
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
}
