import React from "react";
import { Route, Redirect } from "react-router-dom";
import { IonRouterOutlet } from "@ionic/react";
import { LoginPage } from "../pages/Login";
import { RegisterPage } from "../pages/Register";
import { OnboardingPage } from "../pages/Onboarding";
import { useUser } from "../contexts/useUser";

export const AppRoutes: React.FC = () => {
  const { user } = useUser();

  return (
    <IonRouterOutlet>
      <Route exact path="/">
        <LoginPage />
      </Route>

      <Route exact path="/register">
        {!user ? <RegisterPage /> : <Redirect to="/" />}
      </Route>

      <Route exact path="/onboarding">
        <OnboardingPage />
      </Route>

      <Route render={() => <Redirect to="/" />} />
    </IonRouterOutlet>
  );
};
