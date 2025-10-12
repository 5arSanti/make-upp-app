import { useState } from "react";
import {
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonItem,
  IonLabel,
  useIonToast,
  useIonLoading,
  useIonRouter,
} from "@ionic/react";
import {
  sparklesOutline,
  mailOutline,
  personOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";

import { AuthController } from "../../services";
import "./Register.css";
import { UserRole } from "../../services/auth/types";

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

export function RegisterPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authController = new AuthController();

  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const router = useIonRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validación básica
    if (username.length < 3) {
      await showToast({
        message: "El nombre de usuario debe tener al menos 3 caracteres",
        duration: 3000,
        color: "warning",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      await showLoading({
        message: "Registrando usuario...",
        spinner: "crescent",
      });
    } catch (error) {
      console.error("Error showing loading:", error);
    }

    try {
      // Enviar OTP para registro
      await authController.signInWithOtp({ email });

      await showToast({
        message: "✨ Revisa tu email para el enlace de acceso",
        duration: 3000,
        color: "success",
      });

      // Redirigir al login con información del registro
      setTimeout(() => {
        router.push("/", "forward", "replace");
      }, 1000);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      await showToast({ message, duration: 5000, color: "danger" });
    } finally {
      try {
        await hideLoading();
      } catch (error) {
        console.error("Error hiding loading:", error);
      }
      setIsSubmitting(false);
    }
  };

  const roleOptions = [
    {
      value: UserRole.CUSTOMER,
      label: "Comprador",
      description: "Compra productos de belleza",
      icon: "🛍️",
    },
    {
      value: UserRole.SELLER,
      label: "Vendedor",
      description: "Vende productos en la plataforma",
      icon: "💄",
    },
  ];

  return (
    <IonPage>
      <IonContent fullscreen className="register-page">
        {/* Decorative elements */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>

        <div className="register-container">
          {/* Left side - Branding */}
          <div className="brand-section">
            <div className="brand-content">
              <div className="sparkle-icon">
                <IonIcon icon={sparklesOutline} />
              </div>
              <h1 className="brand-name">Make‑upp</h1>
              <p className="brand-tagline">Únete a la Comunidad</p>
              <div className="brand-divider"></div>
              <p className="brand-description">
                Regístrate y forma parte de nuestra comunidad de belleza luxury.
                Elige tu rol y comienza tu experiencia.
              </p>
            </div>
          </div>

          {/* Right side - Register form */}
          <div className="form-section">
            <div className="form-content">
              <div className="form-header">
                <h2 className="form-title">Crear Cuenta</h2>
                <p className="form-subtitle">
                  Completa la información para registrarte
                </p>
              </div>

              <form onSubmit={handleRegister} className="register-form">
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
                      required
                    />
                  </div>
                </div>

                <div className="input-wrapper">
                  <label className="input-label">Nombre completo</label>
                  <div className="input-container">
                    <IonIcon icon={personOutline} className="input-icon" />
                    <IonInput
                      value={fullName}
                      name="fullName"
                      onIonChange={(e) => setFullName(e.detail.value ?? "")}
                      type="text"
                      placeholder="Ej: María García"
                      className="custom-input"
                      required
                    />
                  </div>
                </div>

                <div className="input-wrapper">
                  <label className="input-label">Nombre de usuario</label>
                  <div className="input-container">
                    <IonIcon icon={personOutline} className="input-icon" />
                    <IonInput
                      value={username}
                      name="username"
                      onIonChange={(e) => setUsername(e.detail.value ?? "")}
                      type="text"
                      placeholder="Ej: mariagarcia"
                      className="custom-input"
                      required
                      minlength={3}
                    />
                  </div>
                  <p className="input-hint">Mínimo 3 caracteres, único</p>
                </div>

                <div className="role-selection">
                  <label className="input-label">Tipo de cuenta</label>
                  <IonRadioGroup
                    value={selectedRole}
                    onIonChange={(e) => setSelectedRole(e.detail.value)}
                  >
                    {roleOptions.map((role) => (
                      <IonItem key={role.value} className="role-item">
                        <IonRadio slot="start" value={role.value} />
                        <IonLabel>
                          <div className="role-content">
                            <div className="role-header">
                              <span className="role-icon">{role.icon}</span>
                              <span className="role-name">{role.label}</span>
                            </div>
                            <p className="role-description">
                              {role.description}
                            </p>
                          </div>
                        </IonLabel>
                      </IonItem>
                    ))}
                  </IonRadioGroup>
                </div>

                <IonButton
                  type="submit"
                  expand="block"
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  <span>
                    {isSubmitting ? "Registrando..." : "Crear Cuenta"}
                  </span>
                  <IonIcon icon={checkmarkCircleOutline} slot="end" />
                </IonButton>

                <p className="form-note">
                  Te enviaremos un enlace mágico para completar tu registro
                </p>
              </form>

              <div className="form-footer">
                <p className="footer-text">
                  ¿Ya tienes cuenta?{" "}
                  <a href="/" className="footer-link">
                    Inicia sesión aquí
                  </a>
                </p>
                <p className="footer-terms">
                  Al registrarte, aceptas nuestros{" "}
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
