import { supabase } from "../../config/supabase-client";
import { AuthSession, AuthUser, SignInWithOtpDto } from "./types";

export class AuthService {
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        throw new Error(`Error getting current user: ${error.message}`);
      }

      return user;
    } catch (error) {
      console.error("Error getting current user:", error);
      throw error;
    }
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw new Error(`Error getting current session: ${error.message}`);
      }

      return session;
    } catch (error) {
      console.error("Error getting current session:", error);
      throw error;
    }
  }

  async signInWithOtp(data: SignInWithOtpDto): Promise<void> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
      });

      if (error) {
        throw new Error(`Error signing in with OTP: ${error.message}`);
      }
    } catch (error) {
      console.error("Error signing in with OTP:", error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(`Error signing out: ${error.message}`);
      }
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
