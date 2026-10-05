import { redirect } from "next/navigation"
import { getPlatformNavigation } from "@/features/auth/server-navigation"
import { clientAuthHref } from "@/features/auth/routing"

/** Compatibilidade dos antigos links institucionais, sem onboarding fictício. */
export default async function LegacyRegisterPage() {
  const platform = await getPlatformNavigation()
  redirect(clientAuthHref(platform.origin, "cadastro", undefined, "barbearia") ?? "/#contato")
}
