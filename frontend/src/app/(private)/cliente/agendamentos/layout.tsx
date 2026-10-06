import { redirectClientArea } from "@/features/client-barbershops/server-domain"

/** Validar o domínio antes do boundary, preservando a query do request. */
export default async function AppointmentsLayout({ children }: { children: React.ReactNode }) {
  await redirectClientArea("/cliente/agendamentos")
  return children
}
