"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { superadminShopsMock, type DemoShop } from "../mock-data"
import { setDemoStatus } from "../presentation"

type Scenario = "ready" | "loading" | "error" | "empty"
type DemoContext = {
  shops: readonly DemoShop[]
  scenario: Scenario
  setScenario: (scenario: Scenario) => void
  changeStatus: (id: string, status: DemoShop["demoStatus"]) => void
}
const Context = createContext<DemoContext | null>(null)

export function SuperadminProvider({ children }: { children: ReactNode }) {
  const [shops, setShops] = useState<readonly DemoShop[]>(superadminShopsMock)
  const [scenario, setScenario] = useState<Scenario>("ready")
  return <Context.Provider value={{ shops: scenario === "empty" ? [] : shops, scenario, setScenario,
    changeStatus: (id, status) => setShops(current => setDemoStatus(current, id, status)),
  }}>{children}</Context.Provider>
}

export function useSuperadminDemo() {
  const context = useContext(Context)
  if (!context) throw new Error("SuperadminProvider ausente")
  return context
}
