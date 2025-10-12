import { IonContent, IonPage } from "@ionic/react";
import "./Home.css";

export function HomePage() {
  return (
    <IonPage>
      <IonContent fullscreen className="home-page">
        {/* Decorative elements */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>

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
                Descubre productos premium cuidadosamente seleccionados para realzar tu belleza natural. 
                Desde maquillaje hasta cuidado de la piel, tenemos todo lo que necesitas para sentirte radiante.
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <span className="icon">✨</span>
                </div>
                <h3 className="feature-title">Productos Premium</h3>
                <p className="feature-description">
                  Selección cuidadosa de las mejores marcas de belleza del mundo
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <span className="icon">🎨</span>
                </div>
                <h3 className="feature-title">Personalización</h3>
                <p className="feature-description">
                  Recomendaciones personalizadas basadas en tu tipo de piel y preferencias
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <span className="icon">🚚</span>
                </div>
                <h3 className="feature-title">Envío Express</h3>
                <p className="feature-description">
                  Recibe tus productos en tiempo récord con nuestro servicio premium
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <span className="icon">💎</span>
                </div>
                <h3 className="feature-title">Experiencia Luxury</h3>
                <p className="feature-description">
                  Atención al cliente de primera clase y embalaje exclusivo
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Productos</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Clientes</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">99%</div>
                <div className="stat-label">Satisfacción</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Soporte</div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <div className="cta-content">
              <h2 className="cta-title">¿Lista para comenzar?</h2>
              <p className="cta-description">
                Explora nuestra colección y descubre tu nueva rutina de belleza
              </p>
              <button className="cta-button">
                Explorar Productos
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
