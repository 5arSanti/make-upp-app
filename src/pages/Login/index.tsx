import { useState } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  useIonToast,
  useIonLoading,
  useIonRouter,
} from "@ionic/react";
import {
  sparklesOutline,
  mailOutline,
  lockClosedOutline,
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
  const [password, setPassword] = useState("");
  const authController = new AuthController();
  const router = useIonRouter();

  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validations
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail) {
      await showToast({
        message: "Ingresa tu correo electrónico",
        duration: 3000,
        color: "warning",
      });
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      await showToast({
        message: "Correo electrónico inválido",
        duration: 3000,
        color: "warning",
      });
      return;
    }

    if (!trimmedPassword) {
      await showToast({
        message: "Ingresa tu contraseña",
        duration: 3000,
        color: "warning",
      });
      return;
    }

    if (trimmedPassword.length < 6) {
      await showToast({
        message: "La contraseña debe tener al menos 6 caracteres",
        duration: 3000,
        color: "warning",
      });
      return;
    }

    await showLoading();
    try {
      await authController.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      await showToast({
        message: "✨ ¡Bienvenido de vuelta!",
        duration: 3000,
        color: "success",
      });

      // Redirect to home after successful login
      router.push("/home");
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      // Handle specific Supabase error codes
      const errObj = error as {
        code?: string;
        message?: string;
        error?: { code?: string; message?: string };
      };
      const code = errObj.code ?? errObj.error?.code;

      if (code === "invalid_credentials") {
        await showToast({
          message: "Correo o contraseña incorrectos",
          duration: 4000,
          color: "danger",
        });
      } else if (code === "email_not_confirmed") {
        await showToast({
          message: "Confirma tu correo electrónico antes de iniciar sesión",
          duration: 5000,
          color: "warning",
        });
      } else if (code === "too_many_requests") {
        await showToast({
          message: "Demasiados intentos. Intenta más tarde",
          duration: 5000,
          color: "warning",
        });
      } else {
        await showToast({ message, duration: 5000, color: "danger" });
      }
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
                  Ingresa tus credenciales para acceder a tu cuenta
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
                      enterkeyhint="next"
                      required
                    />
                  </div>
                </div>

                <div className="input-wrapper">
                  <label className="input-label">Contraseña</label>
                  <div className="input-container">
                    <IonIcon icon={lockClosedOutline} className="input-icon" />
                    <IonInput
                      value={password}
                      name="password"
                      onIonChange={(e) => setPassword(e.detail.value ?? "")}
                      type="password"
                      placeholder="Tu contraseña"
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
                  <span>Iniciar Sesión</span>
                  <IonIcon icon={arrowForwardOutline} slot="end" />
                </IonButton>
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
