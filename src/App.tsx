import { IonApp, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

import "@ionic/react/css/ionic.bundle.css";

/* Theme variables */
import "./theme/variables.css";
import { UserProvider, useUser } from "./contexts/useUser";
import { CartProvider } from "./contexts/CartContext";
import { useEffect } from "react";
import { ensureTRMForToday } from "./utils/trm";
import { AppRoutes } from "./routes/AppRoutes";
import { GlobalNavigation } from "./components/Navigation";
import { Profile } from "./services/profile/types";
import { LoadingSpinner } from "./components/LoadingSpinner/index";

setupIonicReact();

const AppContent: React.FC = () => {
  const { user, profile, isLoading } = useUser();

  const isProfileComplete = (p: Profile | null): boolean => {
    if (!p) return false;
    const hasName = Boolean(
      p.full_name && String(p.full_name).trim().length > 0
    );
    const hasUsername = Boolean(
      p.username && String(p.username).trim().length > 0
    );
    const roleName =
      p?.role && typeof p.role === "object" && "name" in p.role
        ? p.role.name
        : undefined;
    const hasRole = Boolean(roleName || p.role_id);
    return hasName && hasUsername && hasRole;
  };

  useEffect(() => {
    ensureTRMForToday();
  }, []);

  if (isLoading) {
    return (
      <IonApp>
        <LoadingSpinner
          message="Preparando tu experiencia de belleza..."
          size="large"
          color="primary"
        />
      </IonApp>
    );
  }

  const profileComplete = isProfileComplete(profile);

  return (
    <IonApp>
      <IonReactRouter>
        {!user ? (
          <AppRoutes />
        ) : !profileComplete ? (
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
      <CartProvider>
        <AppContent />
      </CartProvider>
    </UserProvider>
  );
};

export default App;
