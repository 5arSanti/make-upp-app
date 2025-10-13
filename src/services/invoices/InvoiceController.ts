import { InvoiceService } from "./InvoiceService";
import { Invoice, InvoiceWithOrder, CreateInvoiceDto } from "../orders/types";

export class InvoiceController {
  private invoiceService: InvoiceService;

  constructor() {
    this.invoiceService = new InvoiceService();
  }

  async getAllInvoices(): Promise<InvoiceWithOrder[]> {
    return await this.invoiceService.getAllInvoices();
  }

  async getInvoiceById(id: number): Promise<InvoiceWithOrder | null> {
    return await this.invoiceService.getInvoiceById(id);
  }

  async getInvoiceByOrderId(orderId: string): Promise<Invoice | null> {
    return await this.invoiceService.getInvoiceByOrderId(orderId);
  }

  async getInvoicesByProfileId(profileId: string): Promise<InvoiceWithOrder[]> {
    return await this.invoiceService.getInvoicesByProfileId(profileId);
  }

  async createInvoice(data: CreateInvoiceDto): Promise<Invoice> {
    return await this.invoiceService.createInvoice(data);
  }

  async getInvoiceStatistics(): Promise<{
    totalInvoices: number;
    totalRevenue: number;
    averageInvoiceValue: number;
  }> {
    return await this.invoiceService.getInvoiceStatistics();
  }

  async generateInvoiceForOrder(
    orderId: string,
    pdfUrl?: string
  ): Promise<Invoice> {
    return await this.invoiceService.generateInvoiceForOrder(orderId, pdfUrl);
  }
}
