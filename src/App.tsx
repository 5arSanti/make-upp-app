import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import "@ionic/react/css/ionic.bundle.css";

/* Theme variables */
import "./theme/variables.css";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { OnboardingPage } from "./pages/Onboarding";
import { GlobalNavigation } from "./components/Navigation";
import { UserProvider, useUser } from "./contexts/useUser";

setupIonicReact();

// Componente interno que usa el contexto
const AppContent: React.FC = () => {
  const { user, profile, isLoading } = useUser();
  console.log(isLoading);

  if (isLoading) {
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

  const hasProfile = profile !== null;

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/">
            {!user ? (
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

          <Route exact path="/register">
            {!user ? <RegisterPage /> : <Redirect to="/" />}
          </Route>

          <Route exact path="/onboarding">
            {user && hasProfile === false ? (
              <OnboardingPage />
            ) : (
              <Redirect to="/" />
            )}
          </Route>

          <Route exact path="/home">
            {user && hasProfile === true ? (
              <GlobalNavigation />
            ) : (
              <Redirect to="/" />
            )}
          </Route>

          <Route exact path="/account">
            {user && hasProfile === true ? (
              <GlobalNavigation />
            ) : (
              <Redirect to="/" />
            )}
          </Route>

          <Route exact path="/settings">
            {user && hasProfile === true ? (
              <GlobalNavigation />
            ) : (
              <Redirect to="/" />
            )}
          </Route>

          <Route exact path="/admin">
            {user && hasProfile === true ? (
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

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;
