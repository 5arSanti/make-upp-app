import { useState, useEffect, useMemo } from "react";
import {
  IonContent,
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
  IonButton,
  IonIcon,
  IonSearchbar,
  IonSelect,
  IonSelectOption, IonSpinner,
  IonRefresher,
  IonRefresherContent,
  IonBadge,
  useIonToast,
  useIonLoading
} from "@ionic/react";
import {
  searchOutline,
  heartOutline,
  heart,
  cartOutline,
  starOutline,
  refreshOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from "ionicons/icons";

import { ProductController, CategoryController } from "../../services";
import { Product } from "../../services/products/types";
import { Category } from "../../services/categories/types";
import { readCachedTRM, usdToCop, formatCOP } from "../../utils/trm";
import "./Home.css";

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [trmValue, setTrmValue] = useState<number | null>(null);

  const productController = new ProductController();
  const categoryController = new CategoryController();

  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productController.getAvailableProducts(),
        categoryController.getAllCategories(),
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
      const cached = readCachedTRM();
      setTrmValue(cached?.valor ?? null);
    } catch (error) {
      console.error("Error loading data:", error);
      await showToast({
        message: "Error al cargar los productos",
        duration: 3000,
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Memoized filtered products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      const categoryId = parseInt(selectedCategory);
      filtered = filtered.filter(
        (product) => product.category_id === categoryId
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [products, selectedCategory, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Category statistics
  const categoryStats = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      productCount: products.filter(
        (product) => product.category_id === category.id
      ).length,
    }));
  }, [categories, products]);

  const handleRefresh = async (event: CustomEvent) => {
    try {
      await loadData();
      await showToast({
        message: "Productos actualizados",
        duration: 1500,
        color: "success",
      });
    } catch (error) {
      console.error("Error refreshing:", error);
      await showToast({
        message: "Error al actualizar productos",
        duration: 3000,
        color: "danger",
      });
    } finally {
      event.detail.complete();
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

  const addToCart = async (product: Product) => {
    try {
      await showLoading({ message: "Agregando al carrito..." });

      // TODO: Implement add to cart functionality
      await showToast({
        message: `${product.name} agregado al carrito`,
        duration: 2000,
        color: "success",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      await showToast({
        message: "Error al agregar al carrito",
        duration: 3000,
        color: "danger",
      });
    } finally {
      await hideLoading();
    }
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId) return "Sin categoría";
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || "Sin categoría";
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of products section
    const productsSection = document.querySelector(".products-section");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination-section">
        <div className="pagination-container">
          <div className="pagination-info">
            Mostrando {startIndex + 1}-
            {Math.min(endIndex, filteredProducts.length)} de{" "}
            {filteredProducts.length} productos
          </div>
          <div className="pagination-buttons">
            <IonButton
              className="pagination-button"
              fill="clear"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <IonIcon icon={chevronBackOutline} />
            </IonButton>

            {pages.map((page) => (
              <IonButton
                key={page}
                className={`pagination-button ${
                  currentPage === page ? "active" : ""
                }`}
                fill="clear"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </IonButton>
            ))}

            <IonButton
              className="pagination-button"
              fill="clear"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <IonIcon icon={chevronForwardOutline} />
            </IonButton>
          </div>
        </div>
      </div>
    );
  };

  return (
    <IonPage>
      <IonContent fullscreen className="home-page">
        {/* Decorative elements */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            pullingText="Arrastra para actualizar"
            refreshingSpinner="crescent"
          />
        </IonRefresher>

        <div className="home-container">
          {/* Hero Section */}
          <div className="hero-section">
            <div className="hero-content">
              <h1 className="hero-title">Bienvenido a Make‑upp</h1>
              <p className="hero-subtitle">
                Tu experiencia de belleza luxury comienza aquí
              </p>
              <div className="hero-divider"></div>
              <p className="hero-description">
                Descubre productos premium cuidadosamente seleccionados para
                realzar tu belleza natural.
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="search-filter-section">
            <IonSearchbar
              value={searchTerm}
              onIonChange={(e) => setSearchTerm(e.detail.value!)}
              placeholder="Buscar productos..."
              className="home-searchbar"
            />

          <div className="category-filters">
            <IonSelect
              interface="popover"
              value={selectedCategory}
              onIonChange={(e) => setSelectedCategory(e.detail.value!.toString())}
              placeholder="Selecciona una categoría"
              className="category-select"
            >
              <IonSelectOption value="all">Todos ({products.length})</IonSelectOption>
              {categoryStats.map((category) => (
                <IonSelectOption key={category.id} value={category.id.toString()}>
                  {category.name} ({category.productCount})
                </IonSelectOption>
              ))}
            </IonSelect>
          </div>
          </div>

          {/* Products Section */}
          <div className="products-section">
            <div className="section-header">
              <h2 className="section-title">
                <IonIcon icon={starOutline} />
                Productos Destacados
              </h2>
              <IonBadge color="primary" className="product-count">
                {filteredProducts.length} productos
              </IonBadge>
            </div>

            {isLoading ? (
              <div className="loading-container">
                <IonSpinner name="crescent" />
                <p>Cargando productos...</p>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="empty-state">
                <IonIcon icon={searchOutline} />
                <h3>No se encontraron productos</h3>
                <p>Intenta ajustar los filtros o términos de búsqueda</p>
                <IonButton
                  fill="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                >
                  <IonIcon icon={refreshOutline} slot="start" />
                  Limpiar filtros
                </IonButton>
              </div>
            ) : (
              <>
                <IonGrid className="products-grid">
                  <IonRow>
                    {currentProducts.map((product) => (
                      <IonCol
                        key={product.id}
                        sizeXs="12"
                        sizeSm="6"
                        sizeMd="4"
                        sizeLg="3"
                      >
                        <IonCard className="product-card">
                          <div className="product-image-container">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="product-image"
                              />
                            ) : (
                              <div className="product-image-placeholder">
                                <IonIcon icon={starOutline} />
                              </div>
                            )}

                            <div className="product-overlay">
                              <IonButton
                                fill="clear"
                                className="favorite-button"
                                onClick={() => toggleFavorite(product.id!)}
                              >
                                <IonIcon
                                  icon={
                                    favorites.has(product.id!)
                                      ? heart
                                      : heartOutline
                                  }
                                  color={
                                    favorites.has(product.id!)
                                      ? "danger"
                                      : "light"
                                  }
                                />
                              </IonButton>

                              {!product.available && (
                                <IonChip
                                  color="danger"
                                  className="unavailable-chip"
                                >
                                  Agotado
                                </IonChip>
                              )}
                            </div>
                          </div>

                          <IonCardHeader>
                            <IonCardTitle className="product-title">
                              {product.name}
                            </IonCardTitle>
                            <IonCardSubtitle className="product-category">
                              {getCategoryName(product.category_id)}
                            </IonCardSubtitle>
                          </IonCardHeader>

                          <IonCardContent>
                            {product.description && (
                              <p className="product-description">
                                {product.description.length > 100
                                  ? `${product.description.substring(
                                      0,
                                      100
                                    )}...`
                                  : product.description}
                              </p>
                            )}

                            <div className="product-footer">
                              <div className="product-price">
                                <span className="price-currency">$</span>
                                <span className="price-amount">
                                  {product.price.toFixed(2)}
                                </span>
                              </div>
                              <div className="product-price" title="Precio en COP">
                                <span className="price-currency">COP</span>
                                <span className="price-amount">
                                  {formatCOP(usdToCop(product.price, trmValue ? { unidad: "COP", valor: trmValue, vigenciadesde: "", vigenciahasta: "" } : null))}
                                </span>
                              </div>

                              <IonButton
                                fill="solid"
                                size="small"
                                onClick={() => addToCart(product)}
                                disabled={!product.available}
                                className="add-to-cart-button"
                              >
                                <IonIcon icon={cartOutline} slot="start" />
                                {product.available ? "Agregar" : "Agotado"}
                              </IonButton>
                            </div>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    ))}
                  </IonRow>
                </IonGrid>
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
