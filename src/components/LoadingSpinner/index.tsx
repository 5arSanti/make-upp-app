import React from "react";
import { IonSpinner, IonIcon } from "@ionic/react";
import { sparklesOutline } from "ionicons/icons";

import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "medium" | "large";
  color?: "primary" | "secondary" | "tertiary" | "success" | "warning" | "danger" | "light" | "medium" | "dark";
}

export function LoadingSpinner({ 
  message = "Cargando...", 
  size = "medium",
  color = "primary" 
}: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner-container">
      {/* Decorative background elements */}
      <div className="loading-decoration loading-decoration-1"></div>
      <div className="loading-decoration loading-decoration-2"></div>
      <div className="loading-decoration loading-decoration-3"></div>
      
      {/* Main loading content */}
      <div className="loading-content">
        {/* Brand icon */}
        <div className="loading-brand-icon">
          <IonIcon icon={sparklesOutline} />
        </div>
        
        {/* Spinner */}
        <div className="loading-spinner-wrapper">
          <IonSpinner 
            name="crescent" 
            color={color}
            className={`loading-spinner loading-spinner-${size}`}
          />
        </div>
        
        {/* Loading message */}
        <div className="loading-message">
          <h3 className="loading-title">Make‑upp</h3>
          <p className="loading-text">{message}</p>
        </div>
        
        {/* Animated dots */}
        <div className="loading-dots">
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
        </div>
      </div>
    </div>
  );
}
