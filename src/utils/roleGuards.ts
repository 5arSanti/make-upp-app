import { UserRole } from "../services/auth/types";

export interface RoleGuard {
  hasRole: (userRole: string | undefined) => boolean;
  hasAnyRole: (userRole: string | undefined, roles: UserRole[]) => boolean;
  isAdmin: (userRole: string | undefined) => boolean;
  isCustomer: (userRole: string | undefined) => boolean;
  isSeller: (userRole: string | undefined) => boolean;
  canAccessAdminPanel: (userRole: string | undefined) => boolean;
  canSellProducts: (userRole: string | undefined) => boolean;
  canPurchaseProducts: (userRole: string | undefined) => boolean;
}

export class RoleGuardService implements RoleGuard {
  hasRole(userRole: string | undefined): boolean {
    return !!userRole && Object.values(UserRole).includes(userRole as UserRole);
  }

  hasAnyRole(userRole: string | undefined, roles: UserRole[]): boolean {
    if (!userRole) return false;
    return roles.includes(userRole as UserRole);
  }

  isAdmin(userRole: string | undefined): boolean {
    return userRole === UserRole.ADMIN;
  }

  isCustomer(userRole: string | undefined): boolean {
    return userRole === UserRole.CUSTOMER;
  }

  isSeller(userRole: string | undefined): boolean {
    return userRole === UserRole.SELLER;
  }

  canAccessAdminPanel(userRole: string | undefined): boolean {
    return this.isAdmin(userRole);
  }

  canSellProducts(userRole: string | undefined): boolean {
    return this.hasAnyRole(userRole, [UserRole.SELLER, UserRole.ADMIN]);
  }

  canPurchaseProducts(userRole: string | undefined): boolean {
    return this.hasAnyRole(userRole, [UserRole.CUSTOMER, UserRole.ADMIN]);
  }

  // Additional role-based permissions
  canManageUsers(userRole: string | undefined): boolean {
    return this.isAdmin(userRole);
  }

  canManageProducts(userRole: string | undefined): boolean {
    return this.hasAnyRole(userRole, [UserRole.SELLER, UserRole.ADMIN]);
  }

  canManageCategories(userRole: string | undefined): boolean {
    return this.isAdmin(userRole);
  }

  canViewAnalytics(userRole: string | undefined): boolean {
    return this.hasAnyRole(userRole, [UserRole.SELLER, UserRole.ADMIN]);
  }

  canManageOrders(userRole: string | undefined): boolean {
    return this.hasAnyRole(userRole, [UserRole.SELLER, UserRole.ADMIN]);
  }
}

// Export singleton instance
export const roleGuard = new RoleGuardService();

// Helper hooks for React components
export const useRolePermissions = (userRole: string | undefined) => {
  return {
    isAdmin: roleGuard.isAdmin(userRole),
    isCustomer: roleGuard.isCustomer(userRole),
    isSeller: roleGuard.isSeller(userRole),
    canAccessAdminPanel: roleGuard.canAccessAdminPanel(userRole),
    canSellProducts: roleGuard.canSellProducts(userRole),
    canPurchaseProducts: roleGuard.canPurchaseProducts(userRole),
    canManageUsers: roleGuard.canManageUsers(userRole),
    canManageProducts: roleGuard.canManageProducts(userRole),
    canManageCategories: roleGuard.canManageCategories(userRole),
    canViewAnalytics: roleGuard.canViewAnalytics(userRole),
    canManageOrders: roleGuard.canManageOrders(userRole),
  };
};
