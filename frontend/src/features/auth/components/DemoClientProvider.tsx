"use client"

import { createContext, useContext, useRef, useState, type ReactNode } from "react"

// Apresentação em memória, isolada de qualquer futura fonte de sessão real.
export type ClientPresentation =
  | { kind: "visitor" }
  | { kind: "client"; name: string; demonstration: boolean }
  | { kind: "signing-out"; demonstration: boolean }

type DemoPresentation = {
  presentation: ClientPresentation
  showDemoClient: () => void
  leaveDemo: () => Promise<void>
}
const DemoContext = createContext<DemoPresentation | null>(null)

export function DemoClientProvider({ children }: { children: ReactNode }) {
  const [presentation, setPresentation] = useState<ClientPresentation>({ kind: "visitor" })
  const exiting = useRef(false)
  async function leaveDemo() {
    if (exiting.current) return
    exiting.current = true
    setPresentation({ kind: "signing-out", demonstration: true })
    await new Promise((resolve) => setTimeout(resolve, 250))
    setPresentation({ kind: "visitor" })
    exiting.current = false
  }
  return <DemoContext.Provider value={{ presentation, showDemoClient: () => setPresentation({ kind: "client", name: "Cliente de demonstração", demonstration: true }), leaveDemo }}>{children}</DemoContext.Provider>
}

export function useDemoClientPresentation() {
  const context = useContext(DemoContext)
  if (!context) throw new Error("DemoClientProvider ausente.")
  return context
}
