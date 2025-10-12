import {
  createContext, useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo
} from "react";
import { ProfileController, AuthController } from "../services";
import { Profile } from "../services/profile/types";
import { User } from "@supabase/supabase-js";

interface UserContextType {
  user: User | null;
  profile: Profile | null;
  userRole: string | undefined;
  isLoading: boolean;
  error: string | null;
  refreshUserData: () => Promise<void>;
  clearUserData: () => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const profileController = useMemo(() => new ProfileController(), []);
  const authController = useMemo(() => new AuthController(), []);

  const refreshUserData = useCallback(async () => {
    console.log("🔄 Starting refreshUserData...");
    try {
      setIsLoading(true);
      setError(null);

      console.log("👤 Getting current user...");
      const currentUser = await authController.getCurrentUser();
      if (!currentUser) {
        console.log("❌ No current user found");
        setUser(null);
        setProfile(null);
        setUserRole(undefined);
        setIsLoading(false);
        return;
      }

      console.log("✅ Current user found:", currentUser.id);
      setUser(currentUser);

      // Get profile data with role information
      console.log("📋 Getting profile data...");
      const profileData = await profileController.getProfileByUserId(
        currentUser.id
      );
      console.log("📋 Profile data:", profileData);
      setProfile(profileData);

      // Extract role name
      if (
        profileData?.role &&
        typeof profileData.role === "object" &&
        "name" in profileData.role
      ) {
        console.log("🎭 Role found:", profileData.role.name);
        setUserRole(profileData.role.name);
      } else {
        console.log("🎭 No role found");
        setUserRole(undefined);
      }
    } catch (err) {
      console.error("❌ Error refreshing user data:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      console.log("✅ Setting isLoading to false");
      setIsLoading(false);
    }
  }, [authController, profileController]);

  const clearUserData = () => {
    setUser(null);
    setProfile(null);
    setUserRole(undefined);
    setError(null);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log("🚀 UserProvider useEffect triggered");
    // Initial load
    refreshUserData();

    // Listen to auth state changes
    console.log("👂 Setting up auth state listener...");
    const { data: { subscription } } = authController.onAuthStateChange(
      async (event, session) => {
        console.log("🔔 Auth state changed:", event, !!session);
        if (event === "SIGNED_OUT" || !session) {
          console.log("🚪 User signed out, clearing data");
          clearUserData();
        } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          console.log("🔑 User signed in or token refreshed, refreshing data");
          await refreshUserData();
        }
      }
    );

    return () => {
      console.log("🧹 Cleaning up auth subscription");
      // Cleanup subscription if needed
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [refreshUserData, authController]);

  const value: UserContextType = {
    user,
    profile,
    userRole,
    isLoading,
    error,
    refreshUserData,
    clearUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Export the context type for external use
export type { UserContextType };
