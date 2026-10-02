"use client"

import Link from "next/link"
import { createContext, useContext, type ReactNode } from "react"

const CatalogHrefContext = createContext("/barbearias")

export function PublicCatalogNavigation({ href, children }: { href: string; children: ReactNode }) {
  return <CatalogHrefContext.Provider value={href}>{children}</CatalogHrefContext.Provider>
}

export function PublicCatalogLink({ children, className }: { children: ReactNode; className?: string }) {
  const href = useContext(CatalogHrefContext)
  return <Link href={href} className={className}>{children}</Link>
}
