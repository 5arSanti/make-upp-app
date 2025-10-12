import { useContext } from "react";
import { useRolePermissions } from "../utils/roleGuards";
import { UserContext } from "./UserContext";

// Hook to access user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Hook específico para obtener solo los permisos del usuario
export function useUserPermissions() {
  const { userRole, isLoading, refreshUserData } = useUser();
  const permissions = useRolePermissions(userRole);

  return {
    ...permissions,
    userRole,
    isLoading,
    refreshUserData,
  };
}

// Re-export UserProvider from UserContext
export { UserProvider } from "./UserContext";
