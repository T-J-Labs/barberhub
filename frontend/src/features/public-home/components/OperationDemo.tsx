"use client";

import {
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import styles from "../institutional.module.css";

const tabs = [
  { id: "services", label: "Serviços", description: "Preço e duração" },
  { id: "team", label: "Equipe", description: "Profissionais e jornadas" },
  { id: "settings", label: "Funcionamento", description: "Dias e intervalos" },
] as const;

export function OperationDemo({
  services,
  team,
  settings,
}: {
  services: ReactNode;
  team: ReactNode;
  settings: ReactNode;
}) {
  const [active, setActive] = useState(0);
  const [vertical, setVertical] = useState(false);
  const controls = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1251px)");
    const update = () => setVertical(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index + tabs.length - 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    controls.current[next]?.focus();
  }
  const panels = [services, team, settings];
  return (
    <div className={styles["operation-workspace"]}>
      <div
        className={styles["operation-selector"]}
        role="tablist"
        aria-label="Telas da operação"
        aria-orientation={vertical ? "vertical" : "horizontal"}
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            ref={(el) => {
              controls.current[index] = el;
            }}
            type="button"
            role="tab"
            aria-label={tab.label}
            aria-selected={active === index}
            aria-controls={`screen-${tab.id}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => move(event, index)}
          >
            <strong>{tab.label}</strong>
            <span>{tab.description}</span>
          </button>
        ))}
      </div>
      <div className={styles["operation-screen"]}>
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            id={`screen-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            tabIndex={0}
            hidden={active !== index}
          >
            {panels[index]}
          </div>
        ))}
      </div>
    </div>
  );
}
