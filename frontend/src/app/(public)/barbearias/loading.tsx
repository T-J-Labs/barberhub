import { CatalogShell } from "@/features/barbershop-catalog/components/CatalogShell"
import { CatalogState } from "@/features/barbershop-catalog/components/CatalogState"

export default function Loading() {
  return <CatalogShell><CatalogState kind="loading" /></CatalogShell>
}
