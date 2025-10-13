import {} from "react-router-dom";
import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import "@ionic/react/css/ionic.bundle.css";

/* Theme variables */
import "./theme/variables.css";
import { UserProvider, useUser } from "./contexts/useUser";
import { useEffect } from "react";
import { ensureTRMForToday } from "./utils/trm";
import { AppRoutes } from "./routes/AppRoutes";
import { GlobalNavigation } from "./components/Navigation";

setupIonicReact();

// Componente interno que usa el contexto
const AppContent: React.FC = () => {
  const { user, profile, isLoading } = useUser();
  console.log(isLoading);

  useEffect(() => {
    // Ensure TRM is fetched once per day at app start
    ensureTRMForToday();
  }, []);

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

  return (
    <IonApp>
      <IonReactRouter>
        {!user ? (
          <AppRoutes />
        ) : profile === null ? (
          <AppRoutes />
        ) : (
          <GlobalNavigation />
        )}
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
