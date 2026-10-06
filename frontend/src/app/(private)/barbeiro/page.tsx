import type { Metadata } from "next"
import { BarberDemoShell } from "@/features/barber-demo/components/BarberDemoShell"
import { BarberDemoView } from "@/features/barber-demo/components/BarberDemoView"

export const metadata: Metadata = { title: "Início do barbeiro — demonstração | BarberHub", robots: { index: false, follow: false } }

export default function BarberHomePage() {
  return <BarberDemoShell title="Próximo atendimento"><BarberDemoView mode="home" /></BarberDemoShell>
}
