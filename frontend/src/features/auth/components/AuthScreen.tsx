import Link from "next/link"
import { redirect } from "next/navigation"
import { Container } from "@/components/ui/Container"
import { ClientHeader } from "@/features/navigation/components/authenticated/ClientHeader"
import { getPublicBarbershopPresentation } from "@/features/public-barbershop/barbershop-presentation"
import { catalogFocusClass, catalogPanelClass } from "@/features/barbershop-catalog/styles"
import { getPlatformNavigation } from "../server-navigation"
import { clientAuthHref, isAccountType, platformReturnHref, tenantPublicOrigin, validateAuthContext, type AuthMode } from "../routing"
import { AccountTypeOptions } from "./AccountTypeOptions"
import { GoogleAccess } from "./GoogleAccess"
import { onboardingHref } from "@/features/owner-onboarding/routing"
import { catalogActionClass } from "@/features/barbershop-catalog/styles"

export type AuthPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export async function AuthScreen({ mode, searchParams }: AuthPageProps & { mode: AuthMode }) {
  const platform = await getPlatformNavigation()
  const query = await searchParams
  // Intenção de interface, nunca papel autenticado ou concessão de acesso.
  const accountType = isAccountType(query.perfil) ? query.perfil : "cliente"
  const requestedShop = typeof query.barbearia === "string" ? query.barbearia : query.barbearia === undefined ? platform.hostSubdomain : null
  const shop = requestedShop ? getPublicBarbershopPresentation(requestedShop) : null
  const sourceReturn = query.returnTo === undefined && shop && shop.subdomain === platform.hostSubdomain && platform.origin
    ? `${tenantPublicOrigin(platform.origin, shop.subdomain)}/` : query.returnTo
  const context = validateAuthContext(platform.origin, shop?.subdomain ?? null, sourceReturn)
  const contextDiscarded = query.barbearia !== undefined && !shop
  const returnDiscarded = query.returnTo !== undefined && query.returnTo !== context.returnTo
  const currentHref = clientAuthHref(platform.origin, mode, context, accountType)
  if (platform.isTrustedHost && !platform.isPlatform && currentHref) redirect(currentHref)
  const available = platform.isPlatform && platform.origin
  const alternateHref = clientAuthHref(platform.origin, mode === "login" ? "cadastro" : "login", context, accountType)
  const returnHref = platformReturnHref(platform.origin, context)
  const returnLabel = shop ? `Voltar para ${shop.name}` : "Explorar barbearias"
  return <>
    <ClientHeader platformOrigin={platform.origin} context={context} accountType={accountType} brandHref={platform.origin ? `${platform.origin}/` : "/"} />
    <main id="conteudo" className="py-8 sm:py-12 lg:py-16" style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
      <Container>
        <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-16">
          <section className="min-w-0 lg:pt-8" aria-labelledby="account-context-title">
            <p className="text-xs font-semibold tracking-widest text-sky-400">CONTA BARBERHUB</p>
            <h2 id="account-context-title" className="sr-only mt-4 text-2xl leading-tight font-semibold tracking-tight text-balance sm:text-3xl lg:not-sr-only">Sua conta acompanha você.</h2>
            <p className="mt-4 hidden max-w-md text-base leading-7 text-[#B6C2D1] lg:block">Entre com sua conta Google. No cadastro, escolha se você é cliente, barbeiro ou proprietário de uma barbearia.</p>
            <div className="mt-4 border-l-2 border-sky-400 pl-4 lg:mt-6">
              <p className="text-xs font-medium tracking-wider text-slate-400">{shop ? "BARBEARIA DE ORIGEM" : "DESCUBRA SEU PRÓXIMO DESTINO"}</p>
              <p className="mt-2 text-lg font-semibold break-words">{shop?.name ?? "Catálogo de barbearias"}</p>
              {shop && <p className="mt-1 text-sm leading-6 text-slate-400">{shop.neighborhood}, {shop.city}</p>}
              <Link href={returnHref} className={`mt-2 inline-flex min-h-11 items-center rounded-md text-sm font-medium text-sky-300 underline underline-offset-4 ${catalogFocusClass}`}>{returnLabel}</Link>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400 lg:mt-5">Reservas reais ainda indisponíveis.<span className="hidden lg:inline"> Este fluxo volta ao perfil público, onde você pode experimentar o agendamento demonstrativo.</span></p>
          </section>
          <section aria-labelledby="auth-title" className={`${catalogPanelClass} min-w-0 p-5 sm:p-8`}>
            <h1 id="auth-title" className="text-3xl font-semibold tracking-tight text-balance">{mode === "login" ? "Entrar na sua conta" : "Criar sua conta"}</h1>
            <p className="mt-3 text-sm leading-6 text-[#B6C2D1]">{mode === "login" ? "O acesso ao BarberHub será feito somente com Google." : "Escolha seu perfil e use sua conta Google para continuar."}</p>
            {(contextDiscarded || returnDiscarded) && <p role="status" className="mt-4 rounded-lg border border-amber-300/30 p-3 text-sm leading-6 text-amber-200">{contextDiscarded ? "Barbearia de origem não reconhecida. O retorno foi ajustado para o catálogo." : "Destino de retorno descartado. Usaremos o perfil público da barbearia escolhida."}</p>}
            <div className="mt-6">{available && alternateHref && platform.origin ? <>
              {mode === "cadastro" && <div className="mb-5"><AccountTypeOptions origin={platform.origin} context={context} selected={accountType} /></div>}
              <GoogleAccess mode={mode} accountType={accountType} alternateHref={alternateHref} returnHref={returnHref} returnLabel={returnLabel} />
              {mode === "cadastro" && accountType === "barbearia" && <div className="mt-6 border-t border-[#26384A] pt-5"><p className="mb-3 text-sm leading-6 text-slate-400">Ensaie a configuração de uma barbearia fictícia. Esta ação é independente do Google e não cria conta ou acesso.</p><Link href={onboardingHref("cadastro")} className={catalogActionClass}>Experimentar configuração</Link></div>}
            </> : <p role="status" className="text-sm leading-6 text-slate-300">Acesso indisponível neste domínio. A origem principal da plataforma precisa estar configurada e validada.</p>}</div>
          </section>
        </div>
      </Container>
    </main>
  </>
}
