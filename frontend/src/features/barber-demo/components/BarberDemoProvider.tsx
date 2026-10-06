"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { demoSlots, type DemoSlot } from "../demo-data"
import { applyDemoAction, type DemoAction } from "../state"

const DemoContext = createContext<{ slots: readonly DemoSlot[]; apply: (action: DemoAction) => void; reset: () => void } | null>(null)

export function BarberDemoProvider({ children }: { children: ReactNode }) {
  const [slots, setSlots] = useState(demoSlots)
  return <DemoContext.Provider value={{ slots, apply: (action) => setSlots((current) => applyDemoAction(current, action)), reset: () => setSlots(demoSlots) }}>{children}</DemoContext.Provider>
}

export function useBarberDemo() {
  const context = useContext(DemoContext)
  if (!context) throw new Error("BarberDemoProvider ausente")
  return context
}
