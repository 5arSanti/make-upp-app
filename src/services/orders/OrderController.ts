import { OrderService } from "./OrderService";
import {
  Order,
  OrderWithItems,
  CreateOrderDto,
  UpdateOrderStatusDto,
} from "./types";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async getAllOrders(): Promise<OrderWithItems[]> {
    return await this.orderService.getAllOrders();
  }

  async getOrderById(id: string): Promise<OrderWithItems | null> {
    return await this.orderService.getOrderById(id);
  }

  async getOrdersByProfileId(profileId: string): Promise<OrderWithItems[]> {
    return await this.orderService.getOrdersByProfileId(profileId);
  }

  async createOrder(data: CreateOrderDto): Promise<OrderWithItems> {
    return await this.orderService.createOrder(data);
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusDto): Promise<Order> {
    return await this.orderService.updateOrderStatus(id, data);
  }

  async getOrderStatistics(): Promise<{
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalRevenue: number;
  }> {
    return await this.orderService.getOrderStatistics();
  }

  async processOrder(orderId: string): Promise<Order> {
    return await this.orderService.processOrder(orderId);
  }

  async shipOrder(orderId: string): Promise<Order> {
    return await this.orderService.shipOrder(orderId);
  }

  async completeOrder(orderId: string): Promise<Order> {
    return await this.orderService.completeOrder(orderId);
  }

  async cancelOrder(orderId: string): Promise<Order> {
    return await this.orderService.cancelOrder(orderId);
  }
}
