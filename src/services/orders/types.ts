export interface Order {
  id: string;
  profile_id: string;
  total: number;
  status: OrderStatus;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: string;
  product_id: number;
  quantity: number;
  price_at_purchase: number;
}

export interface OrderWithItems extends Order {
  items: OrderItemWithProduct[];
  profile?: {
    id: string;
    username: string;
    full_name?: string;
  };
}

export interface OrderItemWithProduct extends OrderItem {
  product: {
    id: number;
    name: string;
    image_url?: string;
  };
}

export interface Invoice {
  id: number;
  order_id: string;
  issued_at: string;
  total: number;
  pdf_url?: string;
}

export interface InvoiceWithOrder extends Invoice {
  order: OrderWithItems;
}

export enum OrderStatus {
  PENDING = "pending",
  PAID = "paid",
  SHIPPED = "shipped",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export interface CreateOrderDto {
  profile_id: string;
  total: number;
  items: {
    product_id: number;
    quantity: number;
    price_at_purchase: number;
  }[];
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface CreateInvoiceDto {
  order_id: string;
  total: number;
  pdf_url?: string;
}
