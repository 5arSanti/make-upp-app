import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonToast,
  useIonRouter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { ProfileController, AuthController, AuthSession } from "../../services";
import { Session } from "@supabase/supabase-js";

// Helper function to convert AuthSession to Session
const convertAuthSessionToSession = (authSession: AuthSession | null): Session | null => {
  if (!authSession) return null;
  return {
    ...authSession,
    token_type: "bearer" as const,
  } as Session;
};

export function AccountPage() {
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const [session, setSession] = useState<Session | null>(null);
  const router = useIonRouter();
  const [profile, setProfile] = useState({
    username: "",
    website: "",
    avatar_url: "",
  });

  const profileController = new ProfileController();
  const authController = new AuthController();

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
    console.log("get");
    await showLoading();
    try {
      const user = await authController.getCurrentUser();
      if (!user) throw new Error("No hay usuario autenticado");

      const profileData = await profileController.getProfileByUserId(user.id);
      
      if (profileData) {
        setProfile({
          username: profileData.username,
          website: profileData.website || "",
          avatar_url: profileData.avatar_url || "",
        });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al cargar perfil";
      showToast({ message, duration: 5000 });
    } finally {
      await hideLoading();
    }
  };
  const signOut = async () => {
    await authController.signOut();
    router.push("/", "forward", "replace");
  };
  const updateProfile = async (
    e?: React.FormEvent<HTMLFormElement>,
    avatar_url: string = ""
  ) => {
    e?.preventDefault();

    console.log("update ");
    await showLoading();

    try {
      const user = await authController.getCurrentUser();
      if (!user) throw new Error("No hay usuario autenticado");

      const updates = {
        username: profile.username,
        full_name: profile.username, // Using username as full_name for now
        website: profile.website,
        avatar_url: avatar_url,
        updated_at: new Date().toISOString(),
      };

      await profileController.updateProfile(user.id, updates);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al actualizar perfil";
      showToast({ message, duration: 5000 });
    } finally {
      await hideLoading();
    }
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Account</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <form onSubmit={updateProfile}>
          <IonItem>
            <IonLabel>
              <p>Email</p>
              <p>{session?.user?.email}</p>
            </IonLabel>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Name</IonLabel>
            <IonInput
              type="text"
              name="username"
              value={profile.username}
              onIonChange={(e) =>
                setProfile({ ...profile, username: e.detail.value ?? "" })
              }
            ></IonInput>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Website</IonLabel>
            <IonInput
              type="url"
              name="website"
              value={profile.website}
              onIonChange={(e) =>
                setProfile({ ...profile, website: e.detail.value ?? "" })
              }
            ></IonInput>
          </IonItem>
          <div className="ion-text-center">
            <IonButton fill="clear" type="submit">
              Update Profile
            </IonButton>
          </div>
        </form>

        <div className="ion-text-center">
          <IonButton fill="clear" onClick={signOut}>
            Log Out
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
