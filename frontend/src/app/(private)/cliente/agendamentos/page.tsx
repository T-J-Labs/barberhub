import type { Metadata } from "next"
import Link from "next/link"
import { Container } from "@/components/ui/Container"
import { getPlatformNavigation } from "@/features/auth/server-navigation"
import { publicBookingHref } from "@/features/booking/routing"
import { catalogFocusClass } from "@/features/barbershop-catalog/styles"
import { demoAppointments } from "@/features/client-appointments/demo-data"
import { ClientAppointmentsView } from "@/features/client-appointments/components/ClientAppointmentsView"
import { AppointmentsState } from "@/features/client-appointments/components/AppointmentsState"

export const metadata: Metadata = { title: "Meus agendamentos — BarberHub", description: "Demonstração local da área de agendamentos do cliente.", robots: { index: false, follow: false } }

// O grupo private e o header não autorizam acesso. Esta página expõe apenas fixtures fictícias.
// Intenção: agenda global de cliente; título 30px, Geist e superfícies herdadas da conta,
// sem painel administrativo. Ritmo 4px e espaço de 32px mantêm as reservas como foco.
export default async function ClientAppointmentsPage() {
  const platform = await getPlatformNavigation()
  const bookingLinks = Object.fromEntries(demoAppointments.map((item) => [item.barbershop.subdomain, publicBookingHref(platform, item.barbershop.subdomain)]))
  return <div className="py-8 sm:py-12" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}><Container><div className="mx-auto max-w-5xl">
    <header className="mb-8"><p className="text-xs font-semibold tracking-widest text-sky-400">CONTA BARBERHUB</p><h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Meus agendamentos</h1><p className="mt-3 text-sm leading-6 text-slate-300">Sua próxima visita e seu histórico, com cada barbearia no lugar certo.</p>
      {platform.isPlatform && <Link href="/barbearias" className={`mt-3 inline-flex min-h-11 items-center rounded-md text-sm text-sky-300 underline underline-offset-4 ${catalogFocusClass}`}>Explorar barbearias</Link>}
    </header>
    {platform.isPlatform ? <ClientAppointmentsView initialItems={demoAppointments} bookingLinks={bookingLinks} allowScenarios={process.env.NODE_ENV === "development"} /> : <AppointmentsState kind="unavailable" />}
  </div></Container></div>
}
