import { useState, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonNote,
  IonBadge,
  IonSegment,
  IonSegmentButton,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  useIonToast,
  useIonLoading,
} from "@ionic/react";
import {
  receiptOutline,
  analyticsOutline,
  peopleOutline,
  storefrontOutline,
  checkmarkCircleOutline,
  timeOutline,
  alertCircleOutline,
  searchOutline,
  refreshOutline,
} from "ionicons/icons";

import { ProfileController, AuthController, UserRole } from "../../services";
import { useRolePermissions } from "../../utils/roleGuards";
import "./Admin.css";

function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object") {
    const asObj = error as Record<string, unknown>;
    const desc = asObj["error_description"];
    const msg = asObj["message"];
    if (typeof desc === "string") return desc;
    if (typeof msg === "string") return msg;
  }
  return "Ocurrió un error inesperado";
}

export function AdminPage() {
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [selectedSegment, setSelectedSegment] = useState("orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const profileController = new ProfileController();
  const authController = new AuthController();
  const permissions = useRolePermissions(userRole);

  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  useEffect(() => {
    getUserRole();
  }, []);

  const getUserRole = async () => {
    try {
      const user = await authController.getCurrentUser();
      if (!user) throw new Error("No hay usuario autenticado");

      const profileData = await profileController.getProfileByUserId(user.id);
      if (profileData?.role && typeof profileData.role === "object" && "name" in profileData.role) {
        setUserRole(profileData.role.name);
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      await showToast({ message, duration: 5000, color: "danger" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent) => {
    try {
      await getUserRole();
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      event.detail.complete();
    }
  };

  // Mock data for demonstration
  const mockOrders = [
    {
      id: "ORD-001",
      customer: "María García",
      email: "maria@email.com",
      total: 89.99,
      status: "pending",
      date: "2024-01-15",
      items: 3,
    },
    {
      id: "ORD-002",
      customer: "Ana López",
      email: "ana@email.com",
      total: 156.50,
      status: "paid",
      date: "2024-01-14",
      items: 5,
    },
    {
      id: "ORD-003",
      customer: "Carlos Ruiz",
      email: "carlos@email.com",
      total: 45.99,
      status: "shipped",
      date: "2024-01-13",
      items: 2,
    },
    {
      id: "ORD-004",
      customer: "Laura Martínez",
      email: "laura@email.com",
      total: 234.75,
      status: "completed",
      date: "2024-01-12",
      items: 7,
    },
  ];

  const mockInvoices = [
    {
      id: "INV-001",
      orderId: "ORD-002",
      customer: "Ana López",
      total: 156.50,
      issuedAt: "2024-01-14",
      status: "paid",
    },
    {
      id: "INV-002",
      orderId: "ORD-004",
      customer: "Laura Martínez",
      total: 234.75,
      issuedAt: "2024-01-12",
      status: "paid",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return timeOutline;
      case "paid":
        return checkmarkCircleOutline;
      case "shipped":
        return checkmarkCircleOutline;
      case "completed":
        return checkmarkCircleOutline;
      default:
        return alertCircleOutline;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "paid":
        return "success";
      case "shipped":
        return "primary";
      case "completed":
        return "success";
      default:
        return "danger";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "paid":
        return "Pagado";
      case "shipped":
        return "Enviado";
      case "completed":
        return "Completado";
      default:
        return "Desconocido";
    }
  };

  if (isLoading) {
    return (
      <IonPage>
        <IonContent fullscreen className="admin-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando panel de administración...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // Check if user is admin
  if (!permissions.isAdmin) {
    return (
      <IonPage>
        <IonContent fullscreen className="admin-page">
          <div className="access-denied">
            <IonIcon icon={alertCircleOutline} />
            <h2>Acceso Denegado</h2>
            <p>No tienes permisos para acceder a esta sección.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="admin-page">
        {/* Decorative elements */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="admin-container">
          {/* Header */}
          <div className="admin-header">
            <div className="header-content">
              <IonIcon icon={receiptOutline} className="header-icon" />
              <h1 className="header-title">Panel de Administración</h1>
              <p className="header-subtitle">Gestiona pedidos, facturas y analíticas</p>
              
              <IonChip className="admin-chip">
                <IonIcon icon={analyticsOutline} />
                <IonLabel>👑 Administrador</IonLabel>
              </IonChip>
            </div>
          </div>

          {/* Statistics Cards */}
          <IonGrid className="stats-grid">
            <IonRow>
              <IonCol size="6" sizeMd="3">
                <IonCard className="stat-card">
                  <IonCardContent>
                    <div className="stat-content">
                      <IonIcon icon={receiptOutline} className="stat-icon" />
                      <div className="stat-info">
                        <h3>24</h3>
                        <p>Pedidos Totales</p>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              
              <IonCol size="6" sizeMd="3">
                <IonCard className="stat-card">
                  <IonCardContent>
                    <div className="stat-content">
                      <IonIcon icon={checkmarkCircleOutline} className="stat-icon" />
                      <div className="stat-info">
                        <h3>18</h3>
                        <p>Completados</p>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              
              <IonCol size="6" sizeMd="3">
                <IonCard className="stat-card">
                  <IonCardContent>
                    <div className="stat-content">
                      <IonIcon icon={timeOutline} className="stat-icon" />
                      <div className="stat-info">
                        <h3>4</h3>
                        <p>Pendientes</p>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              
              <IonCol size="6" sizeMd="3">
                <IonCard className="stat-card">
                  <IonCardContent>
                    <div className="stat-content">
                      <IonIcon icon={analyticsOutline} className="stat-icon" />
                      <div className="stat-info">
                        <h3>$2,456</h3>
                        <p>Ingresos</p>
                      </div>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Search and Filter */}
          <div className="search-section">
            <IonSearchbar
              value={searchTerm}
              onIonInput={(e) => setSearchTerm(e.detail.value!)}
              placeholder="Buscar pedidos o facturas..."
              className="admin-searchbar"
            />
          </div>

          {/* Segment Control */}
          <div className="segment-section">
            <IonSegment
              value={selectedSegment}
              onIonChange={(e) => setSelectedSegment(e.detail.value as string)}
              className="admin-segment"
            >
              <IonSegmentButton value="orders">
                <IonLabel>Pedidos</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="invoices">
                <IonLabel>Facturas</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>

          {/* Content based on selected segment */}
          {selectedSegment === "orders" && (
            <div className="content-section">
              <h2 className="section-title">Gestión de Pedidos</h2>
              <IonList className="admin-list">
                {mockOrders.map((order) => (
                  <IonCard key={order.id} className="admin-item-card">
                    <IonCardContent>
                      <div className="item-header">
                        <div className="item-info">
                          <h3 className="item-title">{order.id}</h3>
                          <p className="item-subtitle">{order.customer}</p>
                          <p className="item-email">{order.email}</p>
                        </div>
                        <div className="item-status">
                          <IonChip color={getStatusColor(order.status)}>
                            <IonIcon icon={getStatusIcon(order.status)} />
                            <IonLabel>{getStatusText(order.status)}</IonLabel>
                          </IonChip>
                        </div>
                      </div>
                      
                      <div className="item-details">
                        <div className="detail-item">
                          <IonNote>Total</IonNote>
                          <span className="detail-value">${order.total}</span>
                        </div>
                        <div className="detail-item">
                          <IonNote>Items</IonNote>
                          <span className="detail-value">{order.items}</span>
                        </div>
                        <div className="detail-item">
                          <IonNote>Fecha</IonNote>
                          <span className="detail-value">{order.date}</span>
                        </div>
                      </div>
                      
                      <div className="item-actions">
                        <IonButton size="small" fill="outline">
                          Ver Detalles
                        </IonButton>
                        <IonButton size="small" color="primary">
                          Procesar
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonList>
            </div>
          )}

          {selectedSegment === "invoices" && (
            <div className="content-section">
              <h2 className="section-title">Gestión de Facturas</h2>
              <IonList className="admin-list">
                {mockInvoices.map((invoice) => (
                  <IonCard key={invoice.id} className="admin-item-card">
                    <IonCardContent>
                      <div className="item-header">
                        <div className="item-info">
                          <h3 className="item-title">{invoice.id}</h3>
                          <p className="item-subtitle">{invoice.customer}</p>
                          <p className="item-email">Pedido: {invoice.orderId}</p>
                        </div>
                        <div className="item-status">
                          <IonChip color={getStatusColor(invoice.status)}>
                            <IonIcon icon={getStatusIcon(invoice.status)} />
                            <IonLabel>{getStatusText(invoice.status)}</IonLabel>
                          </IonChip>
                        </div>
                      </div>
                      
                      <div className="item-details">
                        <div className="detail-item">
                          <IonNote>Total</IonNote>
                          <span className="detail-value">${invoice.total}</span>
                        </div>
                        <div className="detail-item">
                          <IonNote>Emitida</IonNote>
                          <span className="detail-value">{invoice.issuedAt}</span>
                        </div>
                      </div>
                      
                      <div className="item-actions">
                        <IonButton size="small" fill="outline">
                          Ver PDF
                        </IonButton>
                        <IonButton size="small" color="primary">
                          Reenviar
                        </IonButton>
                      </div>
                    </IonCardContent>
                  </IonCard>
                ))}
              </IonList>
            </div>
          )}

          <IonInfiniteScroll>
            <IonInfiniteScrollContent></IonInfiniteScrollContent>
          </IonInfiniteScroll>
        </div>
      </IonContent>
    </IonPage>
  );
}
