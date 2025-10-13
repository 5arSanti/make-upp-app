export interface Cart {
  id: string;
  profile_id: string;
  created_at: string;
  active: boolean;
}

export interface CartItem {
  id: number;
  cart_id: string;
  product_id: number;
  quantity: number;
}

export interface CartWithItems extends Cart {
  items: CartItemWithProduct[];
}

export interface CartItemWithProduct extends CartItem {
  product: {
    id: number;
    name: string;
    description?: string;
    image_url?: string;
    price: number;
    available: boolean;
    category_id?: number;
  };
}

export interface CreateCartDto {
  profile_id: string;
}

export interface AddToCartDto {
  product_id: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartSummary {
  totalItems: number;
  totalPrice: number;
  totalPriceCOP: number;
}
