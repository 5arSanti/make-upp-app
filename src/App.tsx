import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { supabase } from "./api/config/supabase-client";

import "@ionic/react/css/ionic.bundle.css";

/* Theme variables */
import "./theme/variables.css";
import { LoginPage } from "./pages/Login";
import { AccountPage } from "./pages/Account";
import { OnboardingPage } from "./pages/Onboarding";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

setupIonicReact();

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

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
        const { data, error } = await supabase
          .from("profiles")
          .select("username, full_name")
          .eq("id", session.user.id)
          .single();

        console.log("Profile query result:", { data, error });

        if (error) {
          if (error.code === "PGRST116") {
            console.log("Profile not found, setting hasProfile to false");
            setHasProfile(false);
          } else {
            console.error("Error checking profile:", error);
            setHasProfile(false);
          }
        } else if (data && data.username && data.username.trim().length >= 3) {
          console.log("Profile found with username:", data.username);
          setHasProfile(true);
        } else {
          console.log("Profile exists but incomplete:", data);
          setHasProfile(false);
        }
      } catch (error) {
        console.error("Exception checking profile:", error);
        setHasProfile(false);
      } finally {
        console.log("Setting loading to false");
        setLoading(false);
      }
    };

    checkProfile();
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
              <Redirect to="/account" />
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

          <Route exact path="/account">
            {session && hasProfile === true ? (
              <AccountPage />
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
