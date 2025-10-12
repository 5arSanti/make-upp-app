import { useState } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  useIonToast,
  useIonLoading,
} from "@ionic/react";
import {
  sparklesOutline,
  mailOutline,
  arrowForwardOutline,
} from "ionicons/icons";

import { AuthController } from "../../services";
import "./Login.css";

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

export function LoginPage() {
  const [email, setEmail] = useState("");
  const authController = new AuthController();

  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await showLoading();
    try {
      await authController.signInWithOtp({ email });
      await showToast({
        message: "✨ Revisa tu email para el enlace de acceso",
        duration: 3000,
        color: "success",
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      await showToast({ message, duration: 5000, color: "danger" });
    } finally {
      await hideLoading();
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-page">
        {/* Decorative elements */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>

        <div className="login-container">
          {/* Left side - Branding */}
          <div className="brand-section">
            <div className="brand-content">
              <div className="sparkle-icon">
                <IonIcon icon={sparklesOutline} />
              </div>
              <h1 className="brand-name">Make‑upp</h1>
              <p className="brand-tagline">Luxury Beauty Experience</p>
              <div className="brand-divider"></div>
              <p className="brand-description">
                Descubre una nueva forma de expresar tu belleza. Productos
                premium seleccionados para ti.
              </p>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="form-section">
            <div className="form-content">
              <div className="form-header">
                <h2 className="form-title">Bienvenido</h2>
                <p className="form-subtitle">
                  Ingresa tu correo para acceder a tu cuenta
                </p>
              </div>

              <form onSubmit={handleLogin} className="login-form">
                <div className="input-wrapper">
                  <label className="input-label">Correo electrónico</label>
                  <div className="input-container">
                    <IonIcon icon={mailOutline} className="input-icon" />
                    <IonInput
                      value={email}
                      name="email"
                      onIonChange={(e) => setEmail(e.detail.value ?? "")}
                      type="email"
                      placeholder="tu@email.com"
                      className="custom-input"
                      enterkeyhint="send"
                      required
                    />
                  </div>
                </div>

                <IonButton
                  type="submit"
                  expand="block"
                  className="submit-button"
                >
                  <span>Continuar</span>
                  <IonIcon icon={arrowForwardOutline} slot="end" />
                </IonButton>

                <p className="form-note">
                  Te enviaremos un enlace mágico para iniciar sesión sin
                  contraseña
                </p>
              </form>

              <div className="form-footer">
                <p className="footer-text">
                  ¿No tienes cuenta?{" "}
                  <a href="/register" className="footer-link">
                    Regístrate aquí
                  </a>
                </p>
                <p className="footer-terms">
                  Al continuar, aceptas nuestros{" "}
                  <a href="#" className="footer-link">
                    Términos de Servicio
                  </a>{" "}
                  y{" "}
                  <a href="#" className="footer-link">
                    Política de Privacidad
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
