import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from "@ionic/react";
import { homeOutline, personOutline } from "ionicons/icons";
import "./Navigation.css";

export function GlobalNavigation() {
  return (
    <IonTabs>
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
