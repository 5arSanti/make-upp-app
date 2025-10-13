import { CartWithItems } from "../cart/types";

export interface PayPalPaymentDetails {
  paymentUrl: string;
  orderId: string;
}

export class PayPalService {
  // PayPal Sandbox credentials for demo purposes
  // Using PayPal's official test merchant account
  private readonly PAYPAL_BUSINESS_EMAIL = "santiari05@hotmail.com";
  private readonly PAYPAL_SANDBOX_URL =
    "https://www.sandbox.paypal.com/cgi-bin/webscr";

  // For production, you would use:
  // private readonly PAYPAL_URL = "https://www.paypal.com/cgi-bin/webscr";

  /**
   * Creates a PayPal hosted payment link with the cart total
   * This will redirect to PayPal's interface showing the real amount
   */
  createPayPalPaymentLink(
    cart: CartWithItems,
    totalAmount: number,
    currency: string = "USD",
    returnUrl?: string,
    cancelUrl?: string
  ): PayPalPaymentDetails {
    // Generate a unique order ID
    const orderId = `ORDER_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Calculate total from cart items
    const calculatedTotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Use the provided total or calculated total
    const finalTotal = totalAmount || calculatedTotal;

    // Create PayPal payment parameters using a simpler approach
    const paypalParams = new URLSearchParams({
      cmd: "_xclick",
      business: this.PAYPAL_BUSINESS_EMAIL,
      item_name: `Pedido ${orderId}`,
      amount: finalTotal.toFixed(2),
      currency_code: currency,
      no_shipping: "1",
      no_note: "1",
      custom: orderId,
      return:
        returnUrl ||
        `${window.location.origin}/cart?payment=success&order=${orderId}`,
      cancel_return:
        cancelUrl ||
        `${window.location.origin}/cart?payment=cancelled&order=${orderId}`,
      charset: "utf-8",
    });

    const paymentUrl = `${this.PAYPAL_SANDBOX_URL}?${paypalParams.toString()}`;

    return {
      paymentUrl,
      orderId,
    };
  }

  /**
   * Creates a simulated PayPal payment link for demo purposes
   * This shows a PayPal-like interface without requiring real PayPal credentials
   */
  createSimulatedPayPalLink(
    cart: CartWithItems,
    totalAmount: number,
    currency: string = "USD"
  ): PayPalPaymentDetails {
    const orderId = `DEMO_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const calculatedTotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const finalTotal = totalAmount || calculatedTotal;

    // Create a simulated PayPal URL that shows the interface
    const simulatedUrl = `${window.location.origin}/paypal-demo?amount=${finalTotal}&currency=${currency}&order=${orderId}`;

    return {
      paymentUrl: simulatedUrl,
      orderId,
    };
  }

  /**
   * Creates a simple PayPal payment link with just the total amount
   * This is a simpler approach for quick payments
   */
  createSimplePayPalLink(
    amount: number,
    description: string,
    currency: string = "USD",
    returnUrl?: string,
    cancelUrl?: string
  ): PayPalPaymentDetails {
    const orderId = `SIMPLE_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const paypalParams = new URLSearchParams({
      cmd: "_xclick",
      business: this.PAYPAL_BUSINESS_EMAIL,
      item_name: description,
      item_number: orderId,
      amount: amount.toFixed(2),
      currency_code: currency,
      no_shipping: "1",
      no_note: "1",
      custom: orderId,
      return:
        returnUrl ||
        `${window.location.origin}/cart?payment=success&order=${orderId}`,
      cancel_return:
        cancelUrl ||
        `${window.location.origin}/cart?payment=cancelled&order=${orderId}`,
      charset: "utf-8",
    });

    const paymentUrl = `${this.PAYPAL_SANDBOX_URL}?${paypalParams.toString()}`;

    return {
      paymentUrl,
      orderId,
    };
  }

  /**
   * Validates if the current URL contains PayPal return parameters
   */
  static isPayPalReturn(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has("payment") && urlParams.has("order");
  }

  /**
   * Gets PayPal return parameters from URL
   */
  static getPayPalReturnParams(): { payment: string; order: string } | null {
    const urlParams = new URLSearchParams(window.location.search);
    const payment = urlParams.get("payment");
    const order = urlParams.get("order");

    if (payment && order) {
      return { payment, order };
    }

    return null;
  }

  /**
   * Cleans up PayPal return parameters from URL
   */
  static cleanupPayPalReturn(): void {
    const url = new URL(window.location.href);
    url.searchParams.delete("payment");
    url.searchParams.delete("order");
    window.history.replaceState({}, "", url.toString());
  }
}
