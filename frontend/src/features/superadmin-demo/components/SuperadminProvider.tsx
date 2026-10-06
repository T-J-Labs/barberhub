"use client"

import { createContext, useContext, useRef, useState, type ReactNode } from "react"
import { superadminShopsMock, type DemoShop } from "../mock-data"
import { setDemoStatus } from "../presentation"
import { makeManualDraft, validateRegistration, type RegistrationDraft, type RegistrationErrors } from "../registration"

type Scenario = "ready" | "loading" | "error" | "empty"
type DemoContext = {
  shops: readonly DemoShop[]
  scenario: Scenario
  setScenario: (scenario: Scenario) => void
  changeStatus: (id: string, status: "active" | "suspended") => void
  createDraft: (input: RegistrationDraft) => { id: string; errors?: never } | { id?: never; errors: RegistrationErrors }
  createdShopId: string | null
}
const Context = createContext<DemoContext | null>(null)

export function SuperadminProvider({ children }: { children: ReactNode }) {
  const [shops, setShops] = useState<readonly DemoShop[]>(superadminShopsMock)
  const shopsRef = useRef<readonly DemoShop[]>(superadminShopsMock)
  const [createdShopId, setCreatedShopId] = useState<string | null>(null)
  const [scenario, setScenario] = useState<Scenario>("ready")
  function createDraft(input: RegistrationDraft) {
    // A referência é atualizada sincronicamente: duas chamadas antes do próximo
    // render também verificam os rascunhos recém-criados. Não há persistência.
    const result = validateRegistration(input, shopsRef.current)
    if (!result.valid) return { errors: result.errors }
    const id = `manual-${crypto.randomUUID()}`
    const next = [...shopsRef.current, makeManualDraft(result.value, id)]
    shopsRef.current = next
    setShops(next)
    setCreatedShopId(id)
    return { id }
  }
  return <Context.Provider value={{ shops: scenario === "empty" ? [] : shops, scenario, setScenario, createDraft, createdShopId,
    changeStatus: (id, status) => {
      shopsRef.current = setDemoStatus(shopsRef.current, id, status)
      setShops(shopsRef.current)
    },
  }}>{children}</Context.Provider>
}

export function useSuperadminDemo() {
  const context = useContext(Context)
  if (!context) throw new Error("SuperadminProvider ausente")
  return context
}
