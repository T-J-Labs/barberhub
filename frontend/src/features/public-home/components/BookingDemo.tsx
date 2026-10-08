"use client";

import { useState, type ReactNode } from "react";
import styles from "../institutional.module.css";

export function BookingDemo({ children }: { children: ReactNode }) {
  const [active, setActive] = useState("service");
  return (
    <div className={styles["booking-demo"]}>
      <div
        className={styles["shot-switch"]}
        role="group"
        aria-label="Etapas capturadas"
      >
        <button
          type="button"
          aria-pressed={active === "service"}
          aria-controls="booking-service"
          onClick={() => setActive("service")}
        >
          Serviço
        </button>
        <button
          type="button"
          aria-pressed={active === "professional"}
          aria-controls="booking-professional"
          onClick={() => setActive("professional")}
        >
          Profissional
        </button>
      </div>
      <div className={styles["booking-shots"]} data-active={active}>
        {children}
      </div>
    </div>
  );
}
