import { useState, useEffect } from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  useIonToast,
  useIonLoading,
} from "@ionic/react";
import {
  closeOutline,
  checkmarkCircleOutline,
  cardOutline,
  logoPaypal,
} from "ionicons/icons";

import { CartWithItems } from "../../services";
import { readCachedTRM, usdToCop, formatCOP } from "../../utils/trm";
import "./PayPalCheckout.css";

interface PayPalCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartWithItems | null;
  onPaymentSuccess: () => void;
}

export function PayPalCheckout({
  isOpen,
  onClose,
  cart,
  onPaymentSuccess,
}: PayPalCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [trmValue, setTrmValue] = useState<number | null>(null);
  const [showToast] = useIonToast();
  const [showLoading, hideLoading] = useIonLoading();

  useEffect(() => {
    if (isOpen) {
      const cached = readCachedTRM();
      setTrmValue(cached?.valor ?? null);
    }
  }, [isOpen]);

  const calculateTotals = () => {
    if (!cart || !cart.items) return { totalPrice: 0, totalPriceCOP: 0 };

    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const totalPriceCOP = usdToCop(
      totalPrice,
      trmValue
        ? {
            unidad: "COP",
            valor: trmValue,
            vigenciadesde: "",
            vigenciahasta: "",
          }
        : null
    );

    return { totalPrice, totalPriceCOP };
  };

  const totals = calculateTotals();

  const handlePayPalPayment = async () => {
    if (!cart || !cart.items.length) {
      await showToast({
        message: "No hay productos en el carrito",
        duration: 3000,
        color: "danger",
      });
      return;
    }

    setIsProcessing(true);
    await showLoading({ message: "Procesando pago con PayPal..." });

    try {
      // Simulate PayPal payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate successful payment
      await showToast({
        message: "¡Pago procesado exitosamente!",
        duration: 2000,
        color: "success",
      });

      // Call success callback to create order and invoice
      onPaymentSuccess();
      onClose();
    } catch (error) {
      console.error("Error processing payment:", error);
      await showToast({
        message: "Error al procesar el pago",
        duration: 3000,
        color: "danger",
      });
    } finally {
      setIsProcessing(false);
      await hideLoading();
    }
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose} className="paypal-modal">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pago con PayPal</IonTitle>
          <IonButton
            fill="clear"
            slot="end"
            onClick={onClose}
            disabled={isProcessing}
          >
            <IonIcon icon={closeOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="paypal-content">
        <div className="paypal-container">
          {/* PayPal Header */}
          <div className="paypal-header">
            <IonIcon icon={logoPaypal} className="paypal-logo" />
            <h2>Pago Seguro con PayPal</h2>
            <p>Tu información está protegida</p>
          </div>

          {/* Order Summary */}
          <IonCard className="order-summary-card">
            <IonCardHeader>
              <IonCardTitle>Resumen del Pedido</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {cart?.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.product.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <div className="item-price">
                    ${(item.product.price * item.quantity).toFixed(2)} USD
                  </div>
                </div>
              ))}

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${totals.totalPrice.toFixed(2)} USD</span>
                </div>
                <div className="total-row">
                  <span>Total en COP:</span>
                  <span className="cop-total">
                    {formatCOP(totals.totalPriceCOP)}
                  </span>
                </div>
                <div className="total-divider"></div>
                <div className="total-row final-total">
                  <span>Total a Pagar:</span>
                  <span className="final-amount">
                    {formatCOP(totals.totalPriceCOP)}
                  </span>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Payment Information */}
          <IonCard className="payment-info-card">
            <IonCardContent>
              <div className="payment-info">
                <IonIcon icon={cardOutline} className="payment-icon" />
                <div className="payment-details">
                  <h3>Información de Pago</h3>
                  <p>
                    Este es un pago simulado. No se realizará ninguna
                    transacción real.
                  </p>
                  <IonChip color="success" className="demo-chip">
                    <IonIcon icon={checkmarkCircleOutline} />
                    <span>Modo Demostración</span>
                  </IonChip>
                </div>
              </div>
            </IonCardContent>
          </IonCard>

          {/* Payment Button */}
          <div className="payment-actions">
            <IonButton
              expand="block"
              fill="solid"
              className="paypal-button"
              onClick={handlePayPalPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <IonSpinner name="crescent" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <IonIcon icon={logoPaypal} slot="start" />
                  <span>Pagar con PayPal</span>
                </>
              )}
            </IonButton>

            <IonButton
              expand="block"
              fill="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="cancel-button"
            >
              Cancelar
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonModal>
  );
}
