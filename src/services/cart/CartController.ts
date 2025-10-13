import { BaseControllerImpl } from "../base/BaseController";
import { CartService } from "./CartService";
import {
    Cart,
    CartWithItems,
    CreateCartDto,
    AddToCartDto,
    UpdateCartItemDto,
    CartSummary,
} from "./types";

export class CartController extends BaseControllerImpl<Cart> {
  protected service: CartService;

  constructor() {
    const service = new CartService();
    super(service);
    this.service = service;
  }

  async getActiveCart(profileId: string): Promise<CartWithItems | null> {
    return this.service.getActiveCart(profileId);
  }

  async createCart(data: CreateCartDto): Promise<Cart> {
    return this.service.createCart(data);
  }

  async addToCart(cartId: string, data: AddToCartDto): Promise<void> {
    await this.service.addToCart(cartId, data);
  }

  async updateCartItemQuantity(
    cartItemId: number,
    data: UpdateCartItemDto
  ): Promise<void> {
    await this.service.updateCartItemQuantity(cartItemId, data);
  }

  async removeFromCart(cartItemId: number): Promise<void> {
    await this.service.removeFromCart(cartItemId);
  }

  async clearCart(cartId: string): Promise<void> {
    await this.service.clearCart(cartId);
  }

  async checkoutCart(cartId: string): Promise<void> {
    await this.service.checkoutCart(cartId);
  }

  calculateCartSummary(cart: CartWithItems): CartSummary {
    return this.service.calculateCartSummary(cart);
  }
}
