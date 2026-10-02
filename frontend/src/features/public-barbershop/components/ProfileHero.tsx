import { FiCalendar, FiMapPin } from "react-icons/fi"
import type { PublicBarbershopPresentation } from "../types"
import { profileActionClass, profileSecondaryActionClass } from "../styles"
import { BarbershopLogo } from "./BarbershopLogo"

export function ProfileHero({ shop }: { shop: PublicBarbershopPresentation }) {
  return (
    <header className="overflow-hidden rounded-2xl border border-[#26384A] bg-[#0A1521]">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_340px]">
        <div aria-hidden="true" className="relative flex items-center justify-center border-b border-[#26384A] bg-[#0D1722] p-6 sm:p-8 lg:order-2 lg:min-h-80 lg:border-b-0 lg:border-l lg:p-10">
          <div className="absolute inset-y-0 left-6 hidden w-2 border-x border-sky-400/40 lg:block" />
          <div className="absolute inset-y-0 right-6 hidden w-2 border-x border-sky-400/40 lg:block" />
          <BarbershopLogo shop={shop} />
        </div>
        <div className="min-w-0 px-5 py-8 sm:p-10 lg:order-1 lg:p-12">
          <h1 className="max-w-3xl text-[2.5rem] leading-[1.08] font-bold tracking-tight break-words text-balance sm:text-6xl">{shop.name}</h1>
          <p className="mt-4 flex min-w-0 items-start gap-2 text-sm leading-6 text-slate-300 sm:text-base"><FiMapPin className="mt-1 shrink-0 text-sky-400" aria-hidden="true" /><span className="break-words">{shop.neighborhood}, {shop.city}</span></p>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#B6C2D1] sm:text-lg sm:leading-8">{shop.description}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#agendamento" aria-describedby="booking-preview-note" className={profileActionClass}><FiCalendar size={18} aria-hidden="true" />Agendar horário</a>
            <a href="#visita" className={profileSecondaryActionClass}><FiMapPin size={18} aria-hidden="true" />Informações de visita</a>
          </div>
          <p id="booking-preview-note" className="mt-3 text-sm leading-6 text-slate-400">Agendamento online ainda indisponível nesta demonstração.</p>
        </div>
      </div>
    </header>
  )
}
