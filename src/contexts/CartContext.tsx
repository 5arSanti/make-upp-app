import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartController, CartWithItems } from "../services";
import { useUser } from "./useUser";

interface CartContextType {
  cart: CartWithItems | null;
  cartItemCount: number;
  isLoading: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateCartItemQuantity: (
    cartItemId: number,
    quantity: number
  ) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { profile } = useUser();
  const cartController = new CartController();

  const cartItemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const loadCart = async () => {
    if (!profile) {
      setCart(null);
      return;
    }

    try {
      setIsLoading(true);
      const cartData = await cartController.getActiveCart(profile.id);
      setCart(cartData);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCart = async () => {
    await loadCart();
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!profile) throw new Error("User not authenticated");

    try {
      // Get or create active cart
      let activeCart = await cartController.getActiveCart(profile.id);
      if (!activeCart) {
        const newCart = await cartController.createCart({
          profile_id: profile.id,
        });
        // Convert Cart to CartWithItems by adding empty items array
        activeCart = { ...newCart, items: [] };
      }

      // Add product to cart
      await cartController.addToCart(activeCart.id, {
        product_id: productId,
        quantity,
      });

      // Refresh cart data
      await loadCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      await cartController.removeFromCart(cartItemId);
      await loadCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const updateCartItemQuantity = async (
    cartItemId: number,
    quantity: number
  ) => {
    try {
      await cartController.updateCartItemQuantity(cartItemId, { quantity });
      await loadCart();
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!cart) return;

    try {
      await cartController.clearCart(cart.id);
      await loadCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  useEffect(() => {
    loadCart();
  }, [profile]);

  const value: CartContextType = {
    cart,
    cartItemCount,
    isLoading,
    refreshCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
