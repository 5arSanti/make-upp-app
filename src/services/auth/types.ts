// Auth Types
export interface AuthUser {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SignInWithOtpDto {
  email: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
  token_type: string;
  user: AuthUser;
}
