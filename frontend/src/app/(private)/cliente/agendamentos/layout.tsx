import { redirect } from "next/navigation"
import { getPlatformNavigation } from "@/features/auth/server-navigation"

/** Redirecionar antes do boundary de carregamento. Domínio não concede autorização. */
export default async function AppointmentsLayout({ children }: { children: React.ReactNode }) {
  const platform = await getPlatformNavigation()
  if (platform.isTrustedHost && !platform.isPlatform && platform.origin) redirect(`${platform.origin}/cliente/agendamentos`)
  return children
}
