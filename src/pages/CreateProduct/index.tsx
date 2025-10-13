import { useState, useEffect } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonGrid,
  IonRow,
  IonCol,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonSpinner,
  useIonToast,
  useIonLoading,
  useIonRouter,
} from "@ionic/react";
import {
  addOutline,
  imageOutline,
  saveOutline,
  arrowBackOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";

import { ProductController, CategoryController, CreateProductDto } from "../../services";
import { useUserPermissions } from "../../contexts/useUser";
import "./CreateProduct.css";

interface Category {
  id: number;
  name: string;
  description?: string;
}

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

export function CreateProductPage() {
  const [formData, setFormData] = useState<CreateProductDto>({
    name: "",
    description: "",
    price: 0,
    available: true,
    category_id: undefined,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const permissions = useUserPermissions();
  const productController = new ProductController();
  const categoryController = new CategoryController();

  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const router = useIonRouter();

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryController.getAllCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error loading categories:", error);
      await showToast({
        message: "Error al cargar las categorías",
        duration: 3000,
        color: "danger",
      });
    }
  };

  const handleInputChange = (field: keyof CreateProductDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        showToast({
          message: "Por favor selecciona un archivo de imagen válido",
          duration: 3000,
          color: "danger",
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast({
          message: "La imagen no puede ser mayor a 5MB",
          duration: 3000,
          color: "danger",
        });
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.name.trim()) {
        await showToast({
          message: "El nombre del producto es requerido",
          duration: 3000,
          color: "danger",
        });
        return;
      }

      if (formData.price <= 0) {
        await showToast({
          message: "El precio debe ser mayor a 0",
          duration: 3000,
          color: "danger",
        });
        return;
      }

      setIsSubmitting(true);
      await showLoading({ message: "Creando producto..." });

      // Create product with image
      const newProduct = await productController.createProductWithImage(
        formData,
        selectedImage || undefined
      );

      await hideLoading();
      await showToast({
        message: "Producto creado exitosamente",
        duration: 3000,
        color: "success",
        icon: checkmarkCircleOutline,
      });

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: 0,
        available: true,
        category_id: undefined,
      });
      setSelectedImage(null);
      setImagePreview("");

      // Navigate back or to products list
      router.back();

    } catch (error) {
      await hideLoading();
      console.error("Error creating product:", error);
      await showToast({
        message: getErrorMessage(error),
        duration: 3000,
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  // Check if user has permission to create products
  if (!permissions.isSeller && !permissions.isAdmin) {
    return (
      <IonPage>
        <IonContent fullscreen className="create-product-page">
          <div className="access-denied">
            <IonIcon icon={addOutline} />
            <h2>Acceso Denegado</h2>
            <p>No tienes permisos para crear productos.</p>
            <IonButton onClick={handleGoBack}>
              <IonIcon icon={arrowBackOutline} slot="start" />
              Volver
            </IonButton>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="create-product-page">
        {/* Decorative elements */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>

        <div className="create-product-container">
          {/* Header */}
          <div className="create-product-header">
            <div className="header-content">
              <IonIcon icon={addOutline} className="header-icon" />
              <h1 className="header-title">Crear Producto</h1>
              <p className="header-subtitle">
                Agrega un nuevo producto a tu catálogo
              </p>
            </div>
          </div>

          <IonGrid className="form-grid">
            <IonRow>
              <IonCol sizeXs="12" sizeMd="8" sizeLg="6">
                <IonCard className="form-card">
                  <IonCardHeader>
                    <IonCardTitle>Información del Producto</IonCardTitle>
                    <IonCardSubtitle>
                      Completa los datos básicos del producto
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="form-content">
                      {/* Product Name */}
                      <IonItem className="form-item">
                        <IonLabel position="stacked">Nombre del Producto *</IonLabel>
                        <IonInput
                          value={formData.name}
                          onIonInput={(e) => handleInputChange("name", e.detail.value!)}
                          placeholder="Ej: Base de Maquillaje Luxury"
                          required
                        />
                      </IonItem>

                      {/* Product Description */}
                      <IonItem className="form-item">
                        <IonLabel position="stacked">Descripción</IonLabel>
                        <IonTextarea
                          value={formData.description}
                          onIonInput={(e) => handleInputChange("description", e.detail.value!)}
                          placeholder="Describe las características del producto..."
                          rows={3}
                        />
                      </IonItem>

                      {/* Price */}
                      <IonItem className="form-item">
                        <IonLabel position="stacked">Precio (USD) *</IonLabel>
                        <IonInput
                          type="number"
                          value={formData.price}
                          onIonInput={(e) => handleInputChange("price", parseFloat(e.detail.value!) || 0)}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </IonItem>

                      {/* Category */}
                      <IonItem className="form-item">
                        <IonLabel position="stacked">Categoría</IonLabel>
                        <IonSelect
                          value={formData.category_id}
                          onSelectionChange={(e) => handleInputChange("category_id", e.detail.value)}
                          placeholder="Selecciona una categoría"
                        >
                          {categories.map((category) => (
                            <IonSelectOption key={category.id} value={category.id}>
                              {category.name}
                            </IonSelectOption>
                          ))}
                        </IonSelect>
                      </IonItem>

                      {/* Available Toggle */}
                      <IonItem className="form-item">
                        <IonLabel>Disponible para venta</IonLabel>
                        <IonToggle
                          checked={formData.available}
                          onIonChange={(e) => handleInputChange("available", e.detail.checked)}
                          slot="end"
                        />
                      </IonItem>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              <IonCol sizeXs="12" sizeMd="4" sizeLg="6">
                <IonCard className="image-card">
                  <IonCardHeader>
                    <IonCardTitle>Imagen del Producto</IonCardTitle>
                    <IonCardSubtitle>
                      Sube una imagen atractiva para tu producto
                    </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="image-upload-section">
                      {/* Image Preview */}
                      {imagePreview ? (
                        <div className="image-preview">
                          <img src={imagePreview} alt="Preview" />
                          <IonButton
                            fill="clear"
                            color="danger"
                            size="small"
                            onClick={() => {
                              setSelectedImage(null);
                              setImagePreview("");
                            }}
                          >
                            Eliminar
                          </IonButton>
                        </div>
                      ) : (
                        <div className="image-placeholder">
                          <IonIcon icon={imageOutline} />
                          <p>No hay imagen seleccionada</p>
                        </div>
                      )}

                      {/* File Input */}
                      <div className="file-input-container">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          id="image-upload"
                          style={{ display: "none" }}
                        />
                        <IonButton
                          fill="outline"
                          onClick={() => document.getElementById("image-upload")?.click()}
                        >
                          <IonIcon icon={imageOutline} slot="start" />
                          {selectedImage ? "Cambiar Imagen" : "Seleccionar Imagen"}
                        </IonButton>
                      </div>

                      <p className="upload-hint">
                        Formatos soportados: JPG, PNG, GIF. Máximo 5MB.
                      </p>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

          {/* Action Buttons */}
          <div className="action-buttons">
            <IonButton
              fill="outline"
              onClick={handleGoBack}
              disabled={isSubmitting}
            >
              <IonIcon icon={arrowBackOutline} slot="start" />
              Cancelar
            </IonButton>
            <IonButton
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.name.trim() || formData.price <= 0}
            >
              {isSubmitting ? (
                <IonSpinner name="crescent" />
              ) : (
                <IonIcon icon={saveOutline} slot="start" />
              )}
              {isSubmitting ? "Creando..." : "Crear Producto"}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
