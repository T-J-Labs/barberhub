import type { Metadata } from "next"
import { BarberDemoShell } from "@/features/barber-demo/components/BarberDemoShell"
import { BarberDemoView } from "@/features/barber-demo/components/BarberDemoView"

export const metadata: Metadata = { title: "Minha agenda — demonstração | BarberHub", robots: { index: false, follow: false } }

export default function BarberAgendaPage() {
  return <BarberDemoShell title="Minha agenda"><BarberDemoView mode="agenda" /></BarberDemoShell>
}
