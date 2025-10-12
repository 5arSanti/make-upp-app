import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { supabase } from "./api/config/supabase-client";

import "@ionic/react/css/ionic.bundle.css";

/* Theme variables */
import "./theme/variables.css";
import { LoginPage } from "./pages/Login";
import { AccountPage } from "./pages/Account";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";

setupIonicReact();

const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  useEffect(() => {
    const getSession = async () => {
      setSession(
        await supabase.auth.getSession().then((res) => res.data.session)
      );
    };
    getSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route
            exact
            path="/"
            render={() => {
              return session ? <Redirect to="/account" /> : <LoginPage />;
            }}
          />
          <Route exact path="/account">
            <AccountPage />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
