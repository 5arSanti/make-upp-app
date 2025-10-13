import { useState, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonBadge,
  useIonToast,
  useIonLoading,
} from "@ionic/react";
import {
  cartOutline,
  trashOutline,
  addOutline,
  removeOutline,
  refreshOutline,
  checkmarkCircleOutline,
  heartOutline,
  heart,
} from "ionicons/icons";

import { useCart } from "../../contexts/CartContext";
import { readCachedTRM, usdToCop, formatCOP } from "../../utils/trm";
import "./Cart.css";

export function CartPage() {
  const [trmValue, setTrmValue] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  const {
    cart,
    isLoading,
    refreshCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
  } = useCart();
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  useEffect(() => {
    const cached = readCachedTRM();
    setTrmValue(cached?.valor ?? null);
  }, []);

  const handleRefresh = async (event: CustomEvent) => {
    try {
      await refreshCart();
      await showToast({
        message: "Carrito actualizado",
        duration: 1500,
        color: "success",
      });
    } catch (error) {
      console.error("Error refreshing cart:", error);
      await showToast({
        message: "Error al actualizar el carrito",
        duration: 3000,
        color: "danger",
      });
    } finally {
      event.detail.complete();
    }
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await showLoading({ message: "Actualizando cantidad..." });
      await updateCartItemQuantity(cartItemId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
      await showToast({
        message: "Error al actualizar la cantidad",
        duration: 3000,
        color: "danger",
      });
    } finally {
      await hideLoading();
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      await showLoading({ message: "Eliminando producto..." });
      await removeFromCart(cartItemId);
      await showToast({
        message: "Producto eliminado del carrito",
        duration: 2000,
        color: "success",
      });
    } catch (error) {
      console.error("Error removing item:", error);
      await showToast({
        message: "Error al eliminar el producto",
        duration: 3000,
        color: "danger",
      });
    } finally {
      await hideLoading();
    }
  };

  const clearCartItems = async () => {
    try {
      await showLoading({ message: "Limpiando carrito..." });
      await clearCart();
      await showToast({
        message: "Carrito limpiado",
        duration: 2000,
        color: "success",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      await showToast({
        message: "Error al limpiar el carrito",
        duration: 3000,
        color: "danger",
      });
    } finally {
      await hideLoading();
    }
  };

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const calculateTotal = () => {
    if (!cart || !cart.items)
      return { totalItems: 0, totalPrice: 0, totalPriceCOP: 0 };

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
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

    return { totalItems, totalPrice, totalPriceCOP };
  };

  const totals = calculateTotal();

  if (isLoading) {
    return (
      <IonPage>
        <IonContent fullscreen className="cart-page">
          <div className="loading-container">
            <IonSpinner name="crescent" />
            <p>Cargando carrito...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="cart-page">
        {/* Decorative elements */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingText="Arrastra para actualizar"
            refreshingSpinner="crescent"
          />
        </IonRefresher>

        <div className="cart-container">
          {/* Header */}
          <div className="cart-header">
            <h1 className="cart-title">
              <IonIcon icon={cartOutline} />
              Mi Carrito
            </h1>
            <IonBadge color="primary" className="cart-count">
              {totals.totalItems} productos
            </IonBadge>
          </div>

          {!cart || !cart.items || cart.items.length === 0 ? (
            <div className="empty-cart">
              <IonIcon icon={cartOutline} />
              <h3>Tu carrito está vacío</h3>
              <p>Agrega algunos productos para comenzar tu compra</p>
              <IonButton
                fill="outline"
                routerLink="/home"
                className="continue-shopping-button"
              >
                <IonIcon icon={refreshOutline} slot="start" />
                Continuar Comprando
              </IonButton>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="cart-items">
                {cart.items.map((item) => (
                  <IonCard key={item.id} className="cart-item-card">
                    <IonCardContent>
                      <IonGrid>
                        <IonRow className="ion-align-items-center">
                          {/* Product Image */}
                          <IonCol size="3" sizeSm="2">
                            <div className="cart-item-image">
                              {item.product.image_url ? (
                                <img
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  className="product-image"
                                />
                              ) : (
                                <div className="product-image-placeholder">
                                  <IonIcon icon={cartOutline} />
                                </div>
                              )}
                            </div>
                          </IonCol>

                          {/* Product Info */}
                          <IonCol size="6" sizeSm="7">
                            <div className="cart-item-info">
                              <h3 className="product-name">
                                {item.product.name}
                              </h3>
                              <p className="product-price">
                                USD ${item.product.price.toFixed(2)}
                              </p>
                              <p className="product-price-cop">
                                COP{" "}
                                {formatCOP(
                                  usdToCop(
                                    item.product.price,
                                    trmValue
                                      ? {
                                          unidad: "COP",
                                          valor: trmValue,
                                          vigenciadesde: "",
                                          vigenciahasta: "",
                                        }
                                      : null
                                  )
                                )}
                              </p>
                            </div>
                          </IonCol>

                          {/* Quantity Controls */}
                          <IonCol size="3" sizeSm="3">
                            <div className="quantity-controls">
                              <div className="quantity-selector">
                                <IonButton
                                  fill="outline"
                                  size="small"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  disabled={item.quantity <= 1}
                                >
                                  <IonIcon icon={removeOutline} />
                                </IonButton>

                                <span className="quantity-display">
                                  {item.quantity}
                                </span>

                                <IonButton
                                  fill="outline"
                                  size="small"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  disabled={item.quantity >= 99}
                                >
                                  <IonIcon icon={addOutline} />
                                </IonButton>
                              </div>

                              <div className="item-actions">
                                <IonButton
                                  fill="clear"
                                  size="small"
                                  onClick={() =>
                                    toggleFavorite(item.product.id)
                                  }
                                  className="favorite-button"
                                >
                                  <IonIcon
                                    icon={
                                      favorites.has(item.product.id)
                                        ? heart
                                        : heartOutline
                                    }
                                    color={
                                      favorites.has(item.product.id)
                                        ? "danger"
                                        : "medium"
                                    }
                                  />
                                </IonButton>

                                <IonButton
                                  fill="clear"
                                  size="small"
                                  onClick={() => removeItem(item.id)}
                                  className="remove-button"
                                >
                                  <IonIcon icon={trashOutline} color="danger" />
                                </IonButton>
                              </div>
                            </div>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCardContent>
                  </IonCard>
                ))}
              </div>

              {/* Cart Summary */}
              <IonCard className="cart-summary-card">
                <IonCardHeader>
                  <IonCardTitle>Resumen del Pedido</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <div className="summary-row">
                    <span>Total de productos:</span>
                    <span>{totals.totalItems}</span>
                  </div>
                  <div className="summary-row">
                    <span>Subtotal (USD):</span>
                    <span>${totals.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Subtotal (COP):</span>
                    <span>{formatCOP(totals.totalPriceCOP)}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-row total-row">
                    <span>Total:</span>
                    <span>${totals.totalPrice.toFixed(2)} USD</span>
                  </div>

                  <div className="cart-actions">
                    <IonButton
                      fill="outline"
                      onClick={clearCartItems}
                      className="clear-cart-button"
                    >
                      <IonIcon icon={trashOutline} slot="start" />
                      Limpiar Carrito
                    </IonButton>

                    <IonButton
                      expand="block"
                      fill="solid"
                      className="checkout-button"
                    >
                      <IonIcon icon={checkmarkCircleOutline} slot="start" />
                      Proceder al Pago
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
}
