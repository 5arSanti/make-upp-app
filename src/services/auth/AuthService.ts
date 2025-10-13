import { supabase } from "../../config/supabase-client";
import {
  AuthSession,
  AuthUser,
  SignInWithOtpDto,
  SignInWithPasswordDto,
  SignUpDto,
} from "./types";

export class AuthService {
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

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
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

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

  async signInWithPassword(data: SignInWithPasswordDto): Promise<AuthSession> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(`Error signing in with password: ${error.message}`);
      }

      if (!authData.session) {
        throw new Error("No session returned after sign in");
      }

      return authData.session as AuthSession;
    } catch (error) {
      console.error("Error signing in with password:", error);
      throw error;
    }
  }

  async signUp(data: SignUpDto): Promise<AuthSession> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: data.full_name
            ? {
                full_name: data.full_name,
              }
            : undefined,
        },
      });

      if (error) {
        throw new Error(`Error signing up: ${error.message}`);
      }

      if (!authData.session) {
        throw new Error("No session returned after sign up");
      }

      return authData.session as AuthSession;
    } catch (error) {
      console.error("Error signing up:", error);
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

  onAuthStateChange(
    callback: (event: string, session: AuthSession | null) => void
  ) {
    return supabase.auth.onAuthStateChange(callback);
  }
}
