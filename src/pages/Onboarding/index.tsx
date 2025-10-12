import { useState, useEffect } from "react";
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
import { personOutline, checkmarkCircleOutline } from "ionicons/icons";

import {
  ProfileController,
  AuthController,
  RoleController,
} from "../../services";
import "./Onboarding.css";
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

async function getRoleId(roleName: UserRole): Promise<number> {
  const roleController = new RoleController();
  const role = await roleController.getRoleByName(roleName);
  if (!role) {
    throw new Error(`Rol ${roleName} no encontrado`);
  }
  return role.id;
}

export function OnboardingPage() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profileController = new ProfileController();
  const authController = new AuthController();

  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const router = useIonRouter();

  // Verificar que los hooks estén disponibles
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Asegurar que el DOM esté listo
      const timer = setTimeout(() => {
        // Los hooks ya deberían estar disponibles
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCompleteProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validación básica
    if (username.length < 3) {
      try {
        await showToast({
          message: "El nombre de usuario debe tener al menos 3 caracteres",
          duration: 3000,
          color: "warning",
        });
      } catch (error) {
        console.error("Error showing toast:", error);
      }
      setIsSubmitting(false);
      return;
    }

    try {
      await showLoading({
        message: "Completando perfil...",
        spinner: "crescent",
      });
    } catch (error) {
      console.error("Error showing loading:", error);
    }

    try {
      const user = await authController.getCurrentUser();

      if (!user) {
        throw new Error("No hay usuario autenticado");
      }

      const updates = {
        username,
        full_name: fullName,
        role_id: await getRoleId(selectedRole),
      };

      await profileController.updateProfile(user.id, updates);

      try {
        await showToast({
          message: "✨ Perfil completado exitosamente",
          duration: 2000,
          color: "success",
        });
      } catch (error) {
        console.error("Error showing success toast:", error);
      }

      // Pequeño delay antes de redirigir
      setTimeout(() => {
        router.push("/account", "forward", "replace");
      }, 500);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      try {
        await showToast({ message, duration: 5000, color: "danger" });
      } catch (toastError) {
        console.error("Error showing error toast:", toastError);
        // Fallback: mostrar en consola
        console.error("Profile completion error:", message);
      }
    } finally {
      try {
        await hideLoading();
      } catch (error) {
        console.error("Error hiding loading:", error);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="onboarding-page">
        {/* Decorative elements */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>

        <div className="onboarding-container">
          <div className="onboarding-content">
            {/* Header */}
            <div className="onboarding-header">
              <div className="welcome-icon">
                <IonIcon icon={checkmarkCircleOutline} />
              </div>
              <h1 className="onboarding-title">¡Bienvenido a Make‑upp!</h1>
              <p className="onboarding-subtitle">
                Completa tu perfil para comenzar tu experiencia de belleza
                luxury
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleCompleteProfile} className="onboarding-form">
              <div className="input-wrapper">
                <label className="input-label">
                  Nombre completo <span className="required">*</span>
                </label>
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
                <label className="input-label">
                  Nombre de usuario <span className="required">*</span>
                </label>
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

              {/* Role selection */}
              <div className="role-selection">
                <label className="input-label">
                  Tipo de cuenta <span className="required">*</span>
                </label>
                <IonRadioGroup
                  value={selectedRole}
                  onIonChange={(e) => setSelectedRole(e.detail.value)}
                >
                  <IonItem className="role-item">
                    <IonRadio slot="start" value={UserRole.CUSTOMER} />
                    <IonLabel>
                      <div className="role-content">
                        <div className="role-header">
                          <span className="role-icon">🛍️</span>
                          <span className="role-name">Comprador</span>
                        </div>
                        <p className="role-description">
                          Compra productos de belleza
                        </p>
                      </div>
                    </IonLabel>
                  </IonItem>
                  <IonItem className="role-item">
                    <IonRadio slot="start" value={UserRole.SELLER} />
                    <IonLabel>
                      <div className="role-content">
                        <div className="role-header">
                          <span className="role-icon">💄</span>
                          <span className="role-name">Vendedor</span>
                        </div>
                        <p className="role-description">
                          Vende productos en la plataforma
                        </p>
                      </div>
                    </IonLabel>
                  </IonItem>
                </IonRadioGroup>
              </div>

              <IonButton
                type="submit"
                expand="block"
                className="submit-button"
                disabled={isSubmitting}
              >
                <span>
                  {isSubmitting ? "Completando..." : "Completar perfil"}
                </span>
                <IonIcon icon={checkmarkCircleOutline} slot="end" />
              </IonButton>
            </form>

            {/* Footer note */}
            <p className="onboarding-note">
              Podrás actualizar esta información más tarde desde tu perfil
            </p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
