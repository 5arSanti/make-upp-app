import { OrderRepository } from "./OrderRepository";
import {
  Order,
  OrderWithItems,
  CreateOrderDto,
  UpdateOrderStatusDto,
  OrderStatus,
} from "./types";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async getAllOrders(): Promise<OrderWithItems[]> {
    return await this.orderRepository.findAllWithItems();
  }

  async getOrderById(id: string): Promise<OrderWithItems | null> {
    return await this.orderRepository.findByIdWithItems(id);
  }

  async getOrdersByProfileId(profileId: string): Promise<OrderWithItems[]> {
    return await this.orderRepository.findByProfileId(profileId);
  }

  async createOrder(data: CreateOrderDto): Promise<OrderWithItems> {
    return await this.orderRepository.createWithItems(data);
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusDto): Promise<Order> {
    return await this.orderRepository.updateStatus(id, data);
  }

  async getOrderStatistics(): Promise<{
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    totalRevenue: number;
  }> {
    return await this.orderRepository.getOrderStatistics();
  }

  async processOrder(orderId: string): Promise<Order> {
    return await this.orderRepository.updateStatus(orderId, {
      status: OrderStatus.PAID,
    });
  }

  async shipOrder(orderId: string): Promise<Order> {
    return await this.orderRepository.updateStatus(orderId, {
      status: OrderStatus.SHIPPED,
    });
  }

  async completeOrder(orderId: string): Promise<Order> {
    return await this.orderRepository.updateStatus(orderId, {
      status: OrderStatus.COMPLETED,
    });
  }

  async cancelOrder(orderId: string): Promise<Order> {
    return await this.orderRepository.updateStatus(orderId, {
      status: OrderStatus.CANCELLED,
    });
  }
}
