import { supabase } from "../../config/supabase-client";
import { CreateInvoiceDto, Invoice, InvoiceWithOrder } from "../orders/types";
import { InvoiceRepository } from "./InvoiceRepository";

export class InvoiceService {
  private invoiceRepository: InvoiceRepository;

  constructor() {
    this.invoiceRepository = new InvoiceRepository();
  }

  async getAllInvoices(): Promise<InvoiceWithOrder[]> {
    return await this.invoiceRepository.findAllWithOrders();
  }

  async getInvoiceById(id: number): Promise<InvoiceWithOrder | null> {
    return await this.invoiceRepository.findByIdWithOrder(id);
  }

  async getInvoiceByOrderId(orderId: string): Promise<Invoice | null> {
    return await this.invoiceRepository.findByOrderId(orderId);
  }

  async getInvoicesByProfileId(profileId: string): Promise<InvoiceWithOrder[]> {
    return await this.invoiceRepository.findByProfileId(profileId);
  }

  async createInvoice(data: CreateInvoiceDto): Promise<Invoice> {
    return await this.invoiceRepository.create(data);
  }

  async getInvoiceStatistics(): Promise<{
    totalInvoices: number;
    totalRevenue: number;
    averageInvoiceValue: number;
  }> {
    return await this.invoiceRepository.getInvoiceStatistics();
  }

  async generateInvoiceForOrder(
    orderId: string,
    pdfUrl?: string
  ): Promise<Invoice> {
    const { data: order, error } = await supabase
      .from("orders")
      .select("total")
      .eq("id", orderId)
      .single();

    if (error) {
      throw new Error(`Order not found: ${error.message}`);
    }

    return await this.createInvoice({
      order_id: orderId,
      total: order.total,
      pdf_url: pdfUrl,
    });
  }
}
