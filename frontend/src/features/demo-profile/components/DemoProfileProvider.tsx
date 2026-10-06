"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Profile = { name: string; initialName: string; apply: (name: string) => void; restore: () => void }
const ProfileContext = createContext<Profile | null>(null)

// Each area layout owns an instance. Unmounting the area discards presentation only.
export function DemoProfileProvider({ initialName, children }: { initialName: string; children: ReactNode }) {
  const [name, setName] = useState(initialName)
  return <ProfileContext.Provider value={{ name, initialName, apply: setName, restore: () => setName(initialName) }}>{children}</ProfileContext.Provider>
}

export function useDemoProfile() {
  const profile = useContext(ProfileContext)
  if (!profile) throw new Error("DemoProfileProvider ausente.")
  return profile
}

/** Public headers outside the area must continue to work without its provider. */
export function useOptionalDemoProfile() { return useContext(ProfileContext) }

// This boundary is mounted by each area layout, never by the root auth provider.
export function AreaProfileProvider({ role, initialName, children }: { role: "cliente" | "barbeiro"; initialName: string; children: ReactNode }) {
  return <DemoProfileProvider key={role} initialName={initialName}>{children}</DemoProfileProvider>
}
