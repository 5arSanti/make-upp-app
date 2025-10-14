import React, { useState, useRef, useEffect } from "react";
import { IonInput, IonIcon } from "@ionic/react";

import "./CustomInput.css";

interface CustomInputProps {
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "number";
  placeholder?: string;
  icon?: string;
  required?: boolean;
  minlength?: number;
  maxlength?: number;
  enterkeyhint?:
    | "enter"
    | "done"
    | "go"
    | "next"
    | "previous"
    | "search"
    | "send";
  className?: string;
  disabled?: boolean;
  name?: string;
}

export function CustomInput({
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  required = false,
  minlength,
  maxlength,
  enterkeyhint,
  className = "custom-input",
  disabled = false,
  name,
}: CustomInputProps) {
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef<HTMLIonInputElement>(null);

  // Sync external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Handle input changes with immediate state update
  const handleInputChange = (e: CustomEvent) => {
    const newValue = String(e.detail.value ?? "");
    setInternalValue(newValue);
    onChange(newValue);
  };

  // Handle blur to ensure final value is captured
  const handleBlur = () => {
    if (inputRef.current) {
      const finalValue = String(inputRef.current.value ?? "");
      setInternalValue(finalValue);
      onChange(finalValue);
    }
  };

  // Handle key press for immediate capture
  const handleKeyPress = (e: React.KeyboardEvent<HTMLIonInputElement>) => {
    if (e.key === "Enter" && inputRef.current) {
      const finalValue = String(inputRef.current.value ?? "");
      setInternalValue(finalValue);
      onChange(finalValue);
    }
  };

  return (
    <div className="input-container">
      {icon && <IonIcon icon={icon} className="input-icon" />}
      <IonInput
        ref={inputRef}
        value={internalValue}
        onIonInput={handleInputChange}
        onIonBlur={handleBlur}
        onKeyDown={handleKeyPress}
        type={type}
        placeholder={placeholder}
        className={className}
        required={required}
        minlength={minlength}
        maxlength={maxlength}
        enterkeyhint={enterkeyhint}
        disabled={disabled}
        name={name}
      />
    </div>
  );
}
