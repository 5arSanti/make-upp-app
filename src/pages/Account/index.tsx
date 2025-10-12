import { useState, useEffect } from "react";
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
  personOutline,
  mailOutline,
  logOutOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";

import { ProfileController, AuthController, AuthSession } from "../../services";
import { Session } from "@supabase/supabase-js";
import "./Account.css";

// Helper function to convert AuthSession to Session
const convertAuthSessionToSession = (
  authSession: AuthSession | null
): Session | null => {
  if (!authSession) return null;
  return {
    ...authSession,
    token_type: "bearer" as const,
  } as Session;
};

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

export function AccountPage() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  const profileController = new ProfileController();
  const authController = new AuthController();

  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const router = useIonRouter();

  useEffect(() => {
    const getSession = async () => {
      const session = await authController.getCurrentSession();
      setSession(convertAuthSessionToSession(session));
    };
    getSession();
    authController.onAuthStateChange((_event, session) => {
      setSession(convertAuthSessionToSession(session));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (session) {
      getProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const getProfile = async () => {
    await showLoading();
    try {
      const user = await authController.getCurrentUser();
      if (!user) throw new Error("No hay usuario autenticado");

      const profileData = await profileController.getProfileByUserId(user.id);

      if (profileData) {
        setUsername(profileData.username);
        setFullName(profileData.full_name || "");
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      await showToast({ message, duration: 5000, color: "danger" });
    } finally {
      await hideLoading();
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
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
        message: "Actualizando perfil...",
        spinner: "crescent",
      });
    } catch (error) {
      console.error("Error showing loading:", error);
    }

    try {
      const user = await authController.getCurrentUser();
      if (!user) throw new Error("No hay usuario autenticado");

      const updates = {
        username,
        full_name: fullName,
      };

      await profileController.updateProfile(user.id, updates);

      await showToast({
        message: "✨ Perfil actualizado exitosamente",
        duration: 2000,
        color: "success",
      });
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

  const handleSignOut = async () => {
    try {
      await showLoading({
        message: "Cerrando sesión...",
        spinner: "crescent",
      });
    } catch (error) {
      console.error("Error showing loading:", error);
    }

    try {
      await authController.signOut();
      await showToast({
        message: "👋 Sesión cerrada exitosamente",
        duration: 2000,
        color: "success",
      });

      setTimeout(() => {
        router.push("/", "forward", "replace");
      }, 500);
    } catch (error: unknown) {
      const message = getErrorMessage(error);
      await showToast({ message, duration: 5000, color: "danger" });
    } finally {
      try {
        await hideLoading();
      } catch (error) {
        console.error("Error hiding loading:", error);
      }
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="account-page">
        {/* Decorative elements */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
        <div className="decoration decoration-3"></div>

        <div className="account-container">
          {/* Left side - Profile Info */}
          <div className="profile-section">
            <div className="profile-content">
              <div className="profile-icon">
                <IonIcon icon={personOutline} />
              </div>
              <h1 className="profile-title">Mi Perfil</h1>
              <p className="profile-subtitle">
                Gestiona tu información personal
              </p>
              <div className="profile-divider"></div>

              {/* Email display */}
              <div className="email-display">
                <IonIcon icon={mailOutline} className="email-icon" />
                <div className="email-info">
                  <p className="email-label">Correo electrónico</p>
                  <p className="email-value">{session?.user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Edit Form */}
          <div className="form-section">
            <div className="form-content">
              <div className="form-header">
                <h2 className="form-title">Editar Perfil</h2>
                <p className="form-subtitle">
                  Actualiza tu información personal
                </p>
              </div>

              <form onSubmit={handleUpdateProfile} className="profile-form">
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

                <IonButton
                  type="submit"
                  expand="block"
                  className="update-button"
                  disabled={isSubmitting}
                >
                  <span>
                    {isSubmitting ? "Actualizando..." : "Actualizar perfil"}
                  </span>
                  <IonIcon icon={checkmarkCircleOutline} slot="end" />
                </IonButton>
              </form>

              {/* Sign Out Button */}
              <div className="signout-section">
                <IonButton
                  expand="block"
                  className="signout-button"
                  onClick={handleSignOut}
                >
                  <IonIcon icon={logOutOutline} slot="start" />
                  <span>Cerrar sesión</span>
                </IonButton>
              </div>

              <div className="form-footer">
                <p className="footer-text">
                  Los cambios se guardarán automáticamente en tu perfil
                </p>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
