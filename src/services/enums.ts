// Enum for user roles
export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  SELLER = "seller",
}

// Enum for product categories
export enum ProductCategory {
  FACIAL_MAKEUP = "Maquillaje Facial",
  EYE_MAKEUP = "Maquillaje de Ojos",
  LIP_MAKEUP = "Maquillaje de Labios",
  SKIN_CARE = "Cuidado de la Piel",
  MAKEUP_TOOLS = "Herramientas de Maquillaje",
  FRAGRANCES = "Fragancias",
  ACCESSORIES = "Accesorios",
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
