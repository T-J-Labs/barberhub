import Link from "next/link"
import { FiMapPin } from "react-icons/fi"
import { catalogActionClass, catalogPanelClass, catalogSecondaryActionClass } from "@/features/barbershop-catalog/styles"
import type { PlatformNavigation } from "@/features/auth/routing"
import type { DemoClientBarbershop } from "../types"
import { clientBarbershopActions } from "../presentation"

// Cliente no celular decide onde voltar: nome 20px/600 e avatar identificam a casa;
// localização 14px recua. Superfície/borda pública, Geist, ritmo 4px, padding 24px,
// controles 44px e sky-500 aprovado concentram a ação em Agendar horário.
export function ClientBarbershopCard({ shop, platform }: { shop: DemoClientBarbershop; platform: PlatformNavigation }) {
  const actions = clientBarbershopActions(shop, platform)
  const secondary = `inline-flex items-center justify-center ${catalogSecondaryActionClass}`
  return <article aria-labelledby={`shop-${shop.id}`} className={`${catalogPanelClass} flex h-full min-w-0 flex-col p-6`}>
    <div className="flex items-center gap-4">
      <div aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-lg border border-[#26384A] bg-[#172535] text-lg font-semibold text-sky-300">{shop.initials}</div>
      <div className="min-w-0"><p className="text-xs text-slate-400">Vínculo fictício</p><h2 id={`shop-${shop.id}`} className="mt-1 text-xl font-semibold tracking-tight break-words">{shop.name}</h2></div>
    </div>
    <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-slate-300"><FiMapPin aria-hidden="true" className="mt-1 shrink-0 text-sky-400" /><span>{shop.neighborhood}<span className="block text-slate-400">{shop.city}</span></span></p>
    {!shop.available && <p role="status" className="mt-4 text-sm leading-6 text-slate-300">Barbearia indisponível neste exemplo. O vínculo fictício permanece e os agendamentos podem ser consultados.</p>}
    <div className="mt-auto pt-6"><div className="grid gap-3 sm:grid-cols-2">
      {actions.profile && <a href={actions.profile} className={secondary}>Ver barbearia</a>}
      {actions.booking && <a href={actions.booking} className={catalogActionClass}>Agendar horário</a>}
      <Link href={actions.appointments} className={`${secondary} sm:col-span-2`}>Ver meus agendamentos</Link>
    </div></div>
  </article>
}
