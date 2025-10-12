import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { supabase } from "./api/config/supabase-client";

import "@ionic/react/css/ionic.bundle.css";

/* Theme variables */
import "./theme/variables.css";
import { LoginPage } from "./pages/Login";
import { OnboardingPage } from "./pages/Onboarding";
import { GlobalNavigation } from "./components/Navigation";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { ProfileController } from "./services";

setupIonicReact();

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const profileController = new ProfileController();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };
    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setHasProfile(null); // Reset profile check on auth change
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const checkProfile = async () => {
      if (!session) {
        console.log("No session, setting hasProfile to null");
        setHasProfile(null);
        setLoading(false);
        return;
      }

      console.log("Checking profile for user:", session.user.id);
      setLoading(true);

      try {
        const hasProfileResult = await profileController.checkProfileExists(
          session.user.id
        );
        console.log("Profile exists:", hasProfileResult);
        setHasProfile(hasProfileResult);
      } catch (error) {
        console.error("Exception checking profile:", error);
        setHasProfile(false);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    checkProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (loading) {
    return (
      <IonApp>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(135deg, #fff8fc 0%, #f7e9ff 100%)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              color: "#6b6374",
              fontSize: "16px",
            }}
          >
            Cargando...
          </div>
        </div>
      </IonApp>
    );
  }

  console.log("Rendering with session:", !!session, "hasProfile:", hasProfile);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/">
            {!session ? (
              <LoginPage />
            ) : hasProfile === false ? (
              <Redirect to="/onboarding" />
            ) : hasProfile === true ? (
              <Redirect to="/home" />
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                  background:
                    "linear-gradient(135deg, #fff8fc 0%, #f7e9ff 100%)",
                }}
              >
                <div
                  style={{
                    textAlign: "center",
                    color: "#6b6374",
                    fontSize: "16px",
                  }}
                >
                  Verificando perfil...
                </div>
              </div>
            )}
          </Route>

          <Route exact path="/onboarding">
            {session && hasProfile === false ? (
              <OnboardingPage />
            ) : (
              <Redirect to="/" />
            )}
          </Route>

          <Route exact path="/home">
            {session && hasProfile === true ? (
              <GlobalNavigation />
            ) : (
              <Redirect to="/" />
            )}
          </Route>

          <Route exact path="/account">
            {session && hasProfile === true ? (
              <GlobalNavigation />
            ) : (
              <Redirect to="/" />
            )}
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
