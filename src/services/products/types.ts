export interface Product {
  id?: number;
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  available: boolean;
  category_id?: number;
  created_at?: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  image_url?: string;
  price: number;
  available?: boolean;
  category_id?: number;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  image_url?: string;
  price?: number;
  available?: boolean;
  category_id?: number;
}
