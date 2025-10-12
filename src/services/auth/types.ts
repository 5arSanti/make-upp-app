import { Session, User } from "@supabase/supabase-js";

// Supabase's Session type has token_type as "bearer", but onAuthStateChange
// sometimes returns a generic string. This type is for compatibility.
export interface AuthSession extends Omit<Session, "token_type"> {
  token_type: string;
}

// Re-export Supabase User type
export type AuthUser = User;

// DTO for OTP sign-in
export interface SignInWithOtpDto {
  email: string;
}
