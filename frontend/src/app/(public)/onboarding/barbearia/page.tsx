import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { Container } from "@/components/ui/Container"
import { getPlatformNavigation } from "@/features/auth/server-navigation"
import { OwnerOnboardingWizard } from "@/features/owner-onboarding/components/OwnerOnboardingWizard"
import { onboardingHref, readDemoOrigin } from "@/features/owner-onboarding/routing"
import type { DemoSearchParams } from "@/features/owner-onboarding/components/AdminDemoNotice"

export const metadata: Metadata = { title: "Configuração demonstrativa | BarberHub", robots: { index: false, follow: false } }
export default async function OwnerOnboardingPage({ searchParams }: DemoSearchParams) {
  const platform = await getPlatformNavigation()
  const origin = readDemoOrigin((await searchParams).origem)
  if (platform.isTrustedHost && !platform.isPlatform && platform.origin) redirect(new URL(onboardingHref(origin), platform.origin).href)
  if (!platform.isPlatform || !platform.origin) return <main id="conteudo" className="py-12"><Container><h1 className="text-3xl font-semibold">Demonstração indisponível neste domínio</h1><p className="mt-4 text-slate-300">A configuração demonstrativa requer o domínio principal validado da plataforma.</p></Container></main>
  return <OwnerOnboardingWizard key={origin ?? "direct"} initialOrigin={origin} platformOrigin={platform.origin} />
}
