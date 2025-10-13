import { supabase } from "../../config/supabase-client";
import { BaseRepositoryImpl } from "../base/BaseRepository";
import { Cart, CartItem, CartWithItems } from "./types";

export class CartRepository extends BaseRepositoryImpl<Cart> {
  constructor() {
    super("carts");
  }

  async getActiveCartByProfileId(
    profileId: string
  ): Promise<CartWithItems | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select(
        `
        *,
        items:cart_items(
          *,
          product:products(*)
        )
      `
      )
      .eq("profile_id", profileId)
      .eq("active", true)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new Error(`Error getting active cart: ${error.message}`);
    }

    return data as CartWithItems | null;
  }

  async createCart(profileId: string): Promise<Cart> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert({
        profile_id: profileId,
        active: true,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error creating cart: ${error.message}`);
    }

    return data;
  }

  async addItemToCart(
    cartId: string,
    productId: number,
    quantity: number
  ): Promise<CartItem> {
    // Check if item already exists in cart
    const { data: existingItem, error: checkError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw new Error(
        `Error checking existing cart item: ${checkError.message}`
      );
    }

    if (existingItem) {
      // Update existing item quantity
      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (error) {
        throw new Error(`Error updating cart item: ${error.message}`);
      }

      return data;
    } else {
      // Create new cart item
      const { data, error } = await supabase
        .from("cart_items")
        .insert({
          cart_id: cartId,
          product_id: productId,
          quantity,
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Error adding item to cart: ${error.message}`);
      }

      return data;
    }
  }

  async updateCartItemQuantity(
    cartItemId: number,
    quantity: number
  ): Promise<CartItem> {
    const { data, error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", cartItemId)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating cart item quantity: ${error.message}`);
    }

    return data;
  }

  async removeItemFromCart(cartItemId: number): Promise<void> {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (error) {
      throw new Error(`Error removing item from cart: ${error.message}`);
    }
  }

  async clearCart(cartId: string): Promise<void> {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cartId);

    if (error) {
      throw new Error(`Error clearing cart: ${error.message}`);
    }
  }

  async deactivateCart(cartId: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update({ active: false })
      .eq("id", cartId);

    if (error) {
      throw new Error(`Error deactivating cart: ${error.message}`);
    }
  }
}
