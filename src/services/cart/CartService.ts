import { BaseServiceImpl } from "../base/BaseService";
import { CartRepository } from "./CartRepository";
import {
  Cart,
  CartItem,
  CartWithItems,
  CreateCartDto,
  AddToCartDto,
  UpdateCartItemDto,
  CartSummary,
} from "./types";

export class CartService extends BaseServiceImpl<Cart> {
  private cartRepository: CartRepository;

  constructor() {
    const repository = new CartRepository();
    super(repository);
    this.cartRepository = repository;
  }

  async getActiveCart(profileId: string): Promise<CartWithItems | null> {
    try {
      return await this.cartRepository.getActiveCartByProfileId(profileId);
    } catch (error) {
      console.error("Error getting active cart:", error);
      throw error;
    }
  }

  async createCart(data: CreateCartDto): Promise<Cart> {
    try {
      return await this.cartRepository.createCart(data.profile_id);
    } catch (error) {
      console.error("Error creating cart:", error);
      throw error;
    }
  }

  async addToCart(cartId: string, data: AddToCartDto): Promise<CartItem> {
    try {
      return await this.cartRepository.addItemToCart(
        cartId,
        data.product_id,
        data.quantity
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  async updateCartItemQuantity(
    cartItemId: number,
    data: UpdateCartItemDto
  ): Promise<CartItem> {
    try {
      return await this.cartRepository.updateCartItemQuantity(
        cartItemId,
        data.quantity
      );
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      throw error;
    }
  }

  async removeFromCart(cartItemId: number): Promise<void> {
    try {
      await this.cartRepository.removeItemFromCart(cartItemId);
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  }

  async clearCart(cartId: string): Promise<void> {
    try {
      await this.cartRepository.clearCart(cartId);
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  }

  async checkoutCart(cartId: string): Promise<void> {
    try {
      await this.cartRepository.deactivateCart(cartId);
    } catch (error) {
      console.error("Error checking out cart:", error);
      throw error;
    }
  }

  calculateCartSummary(cart: CartWithItems): CartSummary {
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return {
      totalItems,
      totalPrice,
      totalPriceCOP: 0, // Will be calculated with TRM
    };
  }
}
