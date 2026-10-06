import type { Metadata } from "next"
import { BarberDemoShell } from "@/features/barber-demo/components/BarberDemoShell"
import { BarberDemoView } from "@/features/barber-demo/components/BarberDemoView"

export const metadata: Metadata = { title: "Histórico do barbeiro — demonstração", robots: { index: false, follow: false } }

export default function BarberHistoryPage() {
  return <BarberDemoShell title="Histórico de atendimentos"><BarberDemoView mode="history" /></BarberDemoShell>
}
