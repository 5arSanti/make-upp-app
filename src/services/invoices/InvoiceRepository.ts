import { supabase } from "../../config/supabase-client";
import { BaseRepositoryImpl } from "../base/BaseRepository";
import {
  Invoice,
  InvoiceWithOrder,
  CreateInvoiceDto,
  OrderWithItems,
  OrderItemWithProduct,
} from "../orders/types";

// Type for Supabase query result
interface InvoiceQueryResult extends Invoice {
  orders: {
    id: string;
    profile_id: string;
    total: number;
    status: string;
    created_at: string;
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
  };
}

export class InvoiceRepository extends BaseRepositoryImpl<Invoice> {
  constructor() {
    super("invoices");
  }

  async findAllWithOrders(): Promise<InvoiceWithOrder[]> {
    const { data, error } = await supabase
      .from("invoices")
      .select(
        `
        *,
        orders!invoices_order_id_fkey (
          id,
          profile_id,
          total,
          status,
          created_at,
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
        )
      `
      )
      .order("issued_at", { ascending: false });

    if (error) {
      throw new Error(`Error fetching invoices with orders: ${error.message}`);
    }

    return (data as InvoiceQueryResult[]).map((invoice) => ({
      ...invoice,
      order: {
        ...invoice.orders,
        items: invoice.orders.order_items.map(
          (item): OrderItemWithProduct => ({
            id: item.id,
            order_id: item.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.price_at_purchase,
            product: item.products!,
          })
        ),
        profile: invoice.orders.profiles || undefined,
      } as OrderWithItems,
    }));
  }

  async findByIdWithOrder(id: number): Promise<InvoiceWithOrder | null> {
    const { data, error } = await supabase
      .from("invoices")
      .select(
        `
        *,
        orders!invoices_order_id_fkey (
          id,
          profile_id,
          total,
          status,
          created_at,
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
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Error fetching invoice with order: ${error.message}`);
    }

    const invoice = data as InvoiceQueryResult;
    return {
      ...invoice,
      order: {
        ...invoice.orders,
        items: invoice.orders.order_items.map(
          (item): OrderItemWithProduct => ({
            id: item.id,
            order_id: item.order_id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_at_purchase: item.price_at_purchase,
            product: item.products!,
          })
        ),
        profile: invoice.orders.profiles || undefined,
      } as OrderWithItems,
    };
  }

  async findByOrderId(orderId: string): Promise<Invoice | null> {
    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("order_id", orderId)
      .maybeSingle();

    if (error) {
      throw new Error(`Error fetching invoice by order ID: ${error.message}`);
    }

    return data;
  }

  async create(data: CreateInvoiceDto): Promise<Invoice> {
    const { data: invoice, error } = await supabase
      .from("invoices")
      .insert({
        order_id: data.order_id,
        total: data.total,
        pdf_url: data.pdf_url,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating invoice: ${error.message}`);
    }

    return invoice;
  }

  async getInvoiceStatistics(): Promise<{
    totalInvoices: number;
    totalRevenue: number;
    averageInvoiceValue: number;
  }> {
    const { data, error } = await supabase.from("invoices").select("total");

    if (error) {
      throw new Error(`Error fetching invoice statistics: ${error.message}`);
    }

    const totalRevenue = data.reduce((sum, invoice) => sum + invoice.total, 0);
    const averageInvoiceValue =
      data.length > 0 ? totalRevenue / data.length : 0;

    return {
      totalInvoices: data.length,
      totalRevenue,
      averageInvoiceValue,
    };
  }
}
