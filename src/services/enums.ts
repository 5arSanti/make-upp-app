// Enum for user roles
export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  SELLER = "seller",
}

// Enum for product categories (app de venta en general)
export enum ProductCategory {
  HOGAR = "Hogar",
  ELECTRODOMESTICOS = "Electrodomésticos",
  ROPA_Y_ACCESORIOS = "Ropa y Accesorios",
  AUTOMOTRIZ = "Automotriz",
  JUGUETES_Y_BEBES = "Juguetes y Bebés",
  DEPORTES_Y_FITNESS = "Deportes y Fitness",
  SALUD_Y_BELLEZA = "Salud y Belleza",
}

// Role information interface
export interface Role {
  id: number;
  name: string;
  description?: string;
}

// Category information interface
export interface Category {
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
