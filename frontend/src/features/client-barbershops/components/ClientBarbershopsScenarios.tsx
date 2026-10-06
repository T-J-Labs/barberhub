"use client"

import { useState } from "react"
import { catalogFocusClass, catalogSecondaryActionClass } from "@/features/barbershop-catalog/styles"
import { ClientBarbershopsState } from "./ClientBarbershopsState"

// Controle de QA local; slots preservam cards/lista no servidor. Texto 14px, foco
// sky-400, bordas públicas e ritmo 4px; controles 44px secundários não competem.
export function ClientBarbershopsScenarios({ children, unavailable }: { children: React.ReactNode; unavailable: React.ReactNode }) {
  const [scenario, setScenario] = useState("normal")
  return <>
    <details className="my-4 text-sm text-slate-300"><summary className={`flex min-h-11 w-fit cursor-pointer items-center rounded-md ${catalogFocusClass}`}>Cenários de demonstração (desenvolvimento)</summary>
      <div className="mt-2 flex flex-wrap gap-2">{[["normal", "Lista completa"], ["empty", "Lista vazia"], ["loading", "Carregamento"], ["error", "Falha ao carregar"], ["unavailable", "Barbearia indisponível"]].map(([key, label]) => <button key={key} type="button" aria-pressed={scenario === key} onClick={() => setScenario(key)} className={catalogSecondaryActionClass}>{label}</button>)}</div>
    </details>
    {scenario === "normal" ? children : scenario === "unavailable" ? unavailable : <ClientBarbershopsState kind={scenario as "empty" | "loading" | "error"} />}
    {(scenario === "error" || scenario === "loading") && <button type="button" onClick={() => setScenario("normal")} className={`mt-4 ${catalogSecondaryActionClass}`}>{scenario === "error" ? "Tentar carregar exemplos novamente" : "Concluir carregamento demonstrativo"}</button>}
  </>
}
