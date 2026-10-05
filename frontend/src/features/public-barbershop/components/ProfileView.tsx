import { FiCalendar, FiClock, FiMapPin, FiMessageCircle, FiScissors } from "react-icons/fi"
import type { PublicBarbershopPresentation } from "../types"
import { profileFocusClass, profilePanelClass } from "../styles"
import { ProfileHero } from "./ProfileHero"

const priceFormat = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })

export function ProfileView({ shop, bookingHref }: { shop: PublicBarbershopPresentation; bookingHref: string | null }) {
  return (
    <>
      <p className="mb-5 border-l-2 border-sky-400 pl-3 text-sm leading-6 text-slate-300">Página demonstrativa. Este estabelecimento e as informações apresentadas são fictícios.</p>
      <ProfileHero shop={shop} bookingHref={bookingHref} />
      <nav aria-label="Nesta barbearia" className="mt-3 flex flex-wrap gap-x-5 border-b border-[#26384A] py-2 text-sm font-medium sm:gap-x-8">
        {[["#servicos", "Serviços"], ["#equipe", "Profissionais"], ["#visita", "Localização e contato"]].map(([href, label]) => (
          <a key={href} href={href} className={`inline-flex min-h-11 items-center rounded-md text-slate-300 hover:text-sky-300 ${profileFocusClass}`}>{label}</a>
        ))}
      </nav>
      <div className="mt-8 grid items-start gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
        <div className="min-w-0 space-y-12">
          <section id="servicos" aria-labelledby="services-title" className="scroll-mt-6">
            <h2 id="services-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">Serviços</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{shop.services.length ? "Preços e durações de exemplo para conhecer a proposta da barbearia." : "Os serviços desta barbearia ainda não foram informados."}</p>
            {shop.services.length > 0 && <ul className="mt-4 divide-y divide-[#26384A]">
              {shop.services.map((service) => (
                <li key={service.name} className="flex min-w-0 items-start gap-3 py-6 sm:gap-5">
                  <div aria-hidden="true" className="mt-1 grid size-10 shrink-0 place-items-center rounded-lg bg-[#172535] text-sky-400"><FiScissors size={19} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <h3 className="text-lg font-semibold break-words">{service.name}</h3>
                      <p className="shrink-0 text-lg font-semibold tabular-nums">{priceFormat.format(service.price)}</p>
                    </div>
                    <p className="mt-2 max-w-lg text-sm leading-6 text-[#B6C2D1]">{service.description}</p>
                    <p className="mt-3 flex items-center gap-2 text-sm text-slate-400"><FiClock aria-hidden="true" />{service.durationMinutes} min</p>
                  </div>
                </li>
              ))}
            </ul>}
          </section>
          <section id="equipe" aria-labelledby="team-title" className="scroll-mt-6">
            <h2 id="team-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">Quem cuida do seu estilo</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">{shop.professionals.length ? "Conheça a equipe de exemplo desta demonstração." : "A equipe desta barbearia ainda não foi informada."}</p>
            {shop.professionals.length > 0 && <ul className="mt-6 grid gap-6 sm:grid-cols-2">
              {shop.professionals.map((person) => (
                <li key={person.name} className="flex items-start gap-4">
                  <div aria-hidden="true" className="grid size-14 shrink-0 place-items-center rounded-full border border-[#334155] bg-[#172535] font-semibold text-sky-300">{person.initials}</div>
                  <div className="min-w-0"><h3 className="text-lg font-semibold break-words">{person.name}</h3><p className="mt-1 text-sm leading-6 text-[#B6C2D1]">{person.description}</p></div>
                </li>
              ))}
            </ul>}
          </section>
          <section id="agendamento" aria-labelledby="booking-title" tabIndex={-1} className={`${profilePanelClass} scroll-mt-6 p-5 sm:p-7 ${profileFocusClass}`}>
            <FiCalendar size={26} className="text-sky-400" aria-hidden="true" />
            <h2 id="booking-title" className="mt-4 text-2xl font-semibold tracking-tight">Seu próximo horário começa aqui</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-[#B6C2D1]">O botão Agendar horário abre a introdução demonstrativa de {shop.name}. Você pode explorar serviço, profissional, data, horário e revisão com exemplos locais.</p>
            <p className="mt-4 text-sm leading-6 text-slate-400">O acesso com Google continua indisponível. Esta demonstração não cria sessão nem reserva horários.</p>
          </section>
        </div>
        <aside id="visita" aria-labelledby="visit-title" className={`${profilePanelClass} min-w-0 scroll-mt-6 p-5 sm:p-6`}>
          <h2 id="visit-title" className="text-xl font-semibold tracking-tight">Planeje sua visita</h2>
          <section aria-labelledby="location-title" className="mt-6">
            <h3 id="location-title" className="flex items-center gap-2 font-semibold"><FiMapPin className="text-sky-400" aria-hidden="true" />Localização</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">{shop.neighborhood}<br />{shop.city}</p>
            <p className="mt-2 text-sm leading-6 text-slate-400">Endereço completo ainda não informado.</p>
          </section>
          <section aria-labelledby="hours-title" className="mt-6 border-t border-[#26384A] pt-6">
            <h3 id="hours-title" className="flex items-center gap-2 font-semibold"><FiClock className="text-sky-400" aria-hidden="true" />Funcionamento</h3>
            {shop.openingHours.length > 0 ? <>
              <p className="mt-2 text-sm leading-6 text-slate-400">Horários de exemplo.</p>
              <dl className="mt-3 space-y-3 text-sm">{shop.openingHours.map((entry) => <div key={entry.days} className="flex flex-wrap justify-between gap-2"><dt className="text-slate-300">{entry.days}</dt><dd className="font-medium text-white">{entry.hours}</dd></div>)}</dl>
            </> : <p className="mt-3 text-sm leading-6 text-slate-400">Horários ainda não informados.</p>}
          </section>
          <section aria-labelledby="contact-title" className="mt-6 border-t border-[#26384A] pt-6">
            <h3 id="contact-title" className="flex items-center gap-2 font-semibold"><FiMessageCircle className="text-sky-400" aria-hidden="true" />Contato</h3>
            <p className="mt-3 text-sm leading-6 text-slate-400">Telefone e WhatsApp ainda não informados.</p>
          </section>
        </aside>
      </div>
    </>
  )
}
