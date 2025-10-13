import {
  OrderController,
  InvoiceController,
  CreateOrderDto,
} from "../../services";
import { CartWithItems } from "../../services/cart/types";

export class CheckoutService {
  private orderController: OrderController;
  private invoiceController: InvoiceController;

  constructor() {
    this.orderController = new OrderController();
    this.invoiceController = new InvoiceController();
  }

  async processCheckout(
    cart: CartWithItems,
    profileId: string
  ): Promise<{ orderId: string; invoiceId: number }> {
    try {
      // Calculate total from cart items
      const total = cart.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // Create order DTO
      const orderDto: CreateOrderDto = {
        profile_id: profileId,
        total,
        items: cart.items.map((item) => ({
          product_id: item.product.id!,
          quantity: item.quantity,
          price_at_purchase: item.product.price,
        })),
      };

      // Create the order
      const order = await this.orderController.createOrder(orderDto);

      // Mark order as paid (simulate successful payment)
      await this.orderController.processOrder(order.id);

      // Generate invoice for the order
      const invoice = await this.invoiceController.generateInvoiceForOrder(
        order.id
      );

      return {
        orderId: order.id,
        invoiceId: invoice.id,
      };
    } catch (error) {
      console.error("Error processing checkout:", error);
      throw new Error("Error al procesar el pedido");
    }
  }
}
