import { supabase } from "../../config/supabase-client";
import { BaseRepositoryImpl } from "../base/BaseRepository";
import {
  Order,
  OrderWithItems,
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderStatus,
  OrderItemWithProduct,
} from "./types";

// Type for Supabase query result
interface OrderQueryResult extends Order {
  profiles: {
    id: string;
    username: string;
    full_name?: string;
  } | null;
  order_items: Array<{
    id: number;
    order_id: string;
    product_id: number;
    quantity: number;
    price_at_purchase: number;
    products: {
      id: number;
      name: string;
      image_url?: string;
    } | null;
  }>;
}

export class OrderRepository extends BaseRepositoryImpl<Order> {
  constructor() {
    super("orders");
  }

  async findAllWithItems(): Promise<OrderWithItems[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        profiles!orders_profile_id_fkey (
          id,
          username,
          full_name
        ),
        order_items (
          id,
          order_id,
          product_id,
          quantity,
          price_at_purchase,
          products!order_items_product_id_fkey (
            id,
            name,
            image_url
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching orders with items: ${error.message}`);
    }

    return (data as OrderQueryResult[]).map((order: OrderQueryResult) => ({
      ...order,
      items: order.order_items.map(
        (item): OrderItemWithProduct => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.price_at_purchase,
          product: item.products!,
        })
      ),
      profile: order.profiles || undefined,
    }));
  }

  async findByIdWithItems(id: string): Promise<OrderWithItems | null> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        profiles!orders_profile_id_fkey (
          id,
          username,
          full_name
        ),
        order_items (
          id,
          order_id,
          product_id,
          quantity,
          price_at_purchase,
          products!order_items_product_id_fkey (
            id,
            name,
            image_url
          )
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Error fetching order with items: ${error.message}`);
    }

    const order = data as OrderQueryResult;
    return {
      ...order,
      items: order.order_items.map(
        (item): OrderItemWithProduct => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.price_at_purchase,
          product: item.products!,
        })
      ),
      profile: order.profiles || undefined,
    };
  }

  async findByProfileId(profileId: string): Promise<OrderWithItems[]> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        profiles!orders_profile_id_fkey (
          id,
          username,
          full_name
        ),
        order_items (
          id,
          order_id,
          product_id,
          quantity,
          price_at_purchase,
          products!order_items_product_id_fkey (
            id,
            name,
            image_url
          )
        )
      `
      )
      .eq("profile_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching orders by profile: ${error.message}`);
    }

    return (data as OrderQueryResult[]).map((order: OrderQueryResult) => ({
      ...order,
      items: order.order_items.map(
        (item): OrderItemWithProduct => ({
          id: item.id,
          order_id: item.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price_at_purchase: item.price_at_purchase,
          product: item.products!,
        })
      ),
      profile: order.profiles || undefined,
    }));
  }

  async createWithItems(data: CreateOrderDto): Promise<OrderWithItems> {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        profile_id: data.profile_id,
        total: data.total,
        status: OrderStatus.PENDING,
      })
      .select()
      .single();

    if (orderError) {
      throw new Error(`Error creating order: ${orderError.message}`);
    }

    // Create order items
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      // Rollback order creation
      await supabase.from("orders").delete().eq("id", order.id);
      throw new Error(`Error creating order items: ${itemsError.message}`);
    }

    // Return the complete order with items
    const completeOrder = await this.findByIdWithItems(order.id);
    if (!completeOrder) {
      throw new Error("Order created but could not be retrieved");
    }

    return completeOrder;
  }

  async updateStatus(id: string, data: UpdateOrderStatusDto): Promise<Order> {
    const { data: order, error } = await supabase
      .from("orders")
      .update({ status: data.status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating order status: ${error.message}`);
    }

    return order;
  }

  async getOrderStatistics(): Promise<{
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalRevenue: number;
  }> {
    const { data, error } = await supabase
      .from("orders")
      .select("status, total");

    if (error) {
      throw new Error(`Error fetching order statistics: ${error.message}`);
    }

    const stats = {
      totalOrders: data.length,
      completedOrders: data.filter(
        (order) => order.status === OrderStatus.COMPLETED
      ).length,
      pendingOrders: data.filter(
        (order) => order.status === OrderStatus.PENDING
      ).length,
      totalRevenue: data.reduce((sum, order) => sum + order.total, 0),
    };

    return stats;
  }
}
