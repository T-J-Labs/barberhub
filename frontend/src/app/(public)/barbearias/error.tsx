"use client"

import { CatalogShell } from "@/features/barbershop-catalog/components/CatalogShell"
import { CatalogState } from "@/features/barbershop-catalog/components/CatalogState"

export default function Error({ reset }: { reset: () => void }) {
  return <CatalogShell><div className="mt-8"><CatalogState kind="error" onRetry={reset} /></div></CatalogShell>
}
