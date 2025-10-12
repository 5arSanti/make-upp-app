import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from "@ionic/react";
import { homeOutline, personOutline, settingsOutline, receiptOutline } from "ionicons/icons";
import { Route, Redirect } from "react-router-dom";
import { HomePage } from "../../pages/Home";
import { AccountPage } from "../../pages/Account";
import { SettingsPage } from "../../pages/Settings";
import { AdminPage } from "../../pages/Admin";
import { useState, useEffect } from "react";
import { ProfileController, AuthController, UserRole } from "../../services";
import { useRolePermissions } from "../../utils/roleGuards";
import "./Navigation.css";

export function GlobalNavigation() {
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const permissions = useRolePermissions(userRole);
  
  const profileController = new ProfileController();
  const authController = new AuthController();

  useEffect(() => {
    getUserRole();
  }, []);

  const getUserRole = async () => {
    try {
      const user = await authController.getCurrentUser();
      if (!user) return;

      const profileData = await profileController.getProfileByUserId(user.id);
      if (profileData?.role && typeof profileData.role === "object" && "name" in profileData.role) {
        setUserRole(profileData.role.name);
      }
    } catch (error) {
      console.error("Error getting user role:", error);
    }
  };

  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/home">
          <HomePage />
        </Route>
        <Route exact path="/account">
          <AccountPage />
        </Route>
        <Route exact path="/settings">
          <SettingsPage />
        </Route>
        <Route exact path="/admin">
          <AdminPage />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
      
      <IonTabBar slot="bottom" className="custom-tab-bar">
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={homeOutline} />
          <IonLabel>Inicio</IonLabel>
        </IonTabButton>

        <IonTabButton tab="account" href="/account">
          <IonIcon icon={personOutline} />
          <IonLabel>Cuenta</IonLabel>
        </IonTabButton>

        <IonTabButton tab="settings" href="/settings">
          <IonIcon icon={settingsOutline} />
          <IonLabel>Configuración</IonLabel>
        </IonTabButton>

        {/* Admin-only tab for orders and invoices */}
        {permissions.isAdmin && (
          <IonTabButton tab="admin" href="/admin">
            <IonIcon icon={receiptOutline} />
            <IonLabel>Admin</IonLabel>
          </IonTabButton>
        )}
      </IonTabBar>
    </IonTabs>
  );
}
