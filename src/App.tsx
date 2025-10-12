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
        setHasProfile(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, full_name")
          .eq("id", session.user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "not found" error
          console.error("Error checking profile:", error);
          setHasProfile(false);
        } else if (data && data.username) {
          // Profile exists and has username (required field)
          setHasProfile(true);
        } else {
          // Profile doesn't exist or is incomplete
          setHasProfile(false);
        }
      } catch (error) {
        console.error("Error checking profile:", error);
        setHasProfile(false);
      } finally {
        setLoading(false);
      }
    };

    checkProfile();
  }, [session]);

  if (loading) {
    return <IonApp></IonApp>; // Or a loading spinner
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/">
            {!session ? (
              <LoginPage />
            ) : hasProfile === false ? (
              <Redirect to="/onboarding" />
            ) : (
              <Redirect to="/account" />
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
            {session && hasProfile ? (
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
