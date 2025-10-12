import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from "@ionic/react";
import { homeOutline, personOutline } from "ionicons/icons";
import { Route, Redirect } from "react-router-dom";
import { HomePage } from "../../pages/Home";
import { AccountPage } from "../../pages/Account";
import "./Navigation.css";

export function GlobalNavigation() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/home">
          <HomePage />
        </Route>
        <Route exact path="/account">
          <AccountPage />
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
      </IonTabBar>
    </IonTabs>
  );
}
