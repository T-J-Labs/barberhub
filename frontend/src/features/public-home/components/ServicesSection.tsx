import { Container } from "@/components/ui/Container"
import {
  LuCalendarCheck,
  LuCalendarDays,
  LuClipboardCheck,
  LuGlobe,
  LuScissors,
  LuUsersRound,
} from "react-icons/lu";

export function ServicesSection() {
  return(
    <section
      id="servicos"
      className="relative isolate overflow-hidden bg-[#0A1521] py-12 sm:py-16"
    >
      <Container>
        <div className="flex flex-col lg:items-center lg:text-center gap-4">
          <p className="text-sky-400 font-medium text-sm tracking-widest">SERVIÇOS</p>
          <h2 className="text-[2.25rem] sm:text-5xl font-bold text-white max-w-4xl">Tudo para simplificar a rotina da sua barbearia</h2>
          <p className="text-lg text-[#B6C2D1] max-w-4xl">Organize sua operação, acompanhe sua equipe e ofereça uma experiência de agendamento simples para seus clientes.</p>

          <div className="mt-4 grid w-full auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article
              className="flex h-full w-full items-center rounded-lg border border-slate-700/70 bg-[#0D1722] px-4 py-5 gap-6"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-sky-500/15">
                <LuGlobe aria-hidden="true" className="size-6 text-sky-400" />
              </span>
              <div className="flex flex-col items-start justify-center">
                <h3 className="text-lg text-white font-medium">Página institucional da barbearia</h3>
                <p className="text-sm text-slate-400 text-start">Apresente seus serviços, profissionais e informações de contato em um só lugar.</p>
              </div>
            </article>

            <article
              className="flex h-full w-full items-center rounded-lg border border-slate-700/70 bg-[#0D1722] px-4 py-5 gap-6"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-sky-500/15">
                <LuScissors aria-hidden="true" className="size-6 text-sky-400" />
              </span>
              <div className="flex flex-col items-start justify-center">
                <h3 className="text-lg text-white font-medium">Catálogo de serviços</h3>
                <p className="text-sm text-slate-400 text-start">Organize preços, duração e detalhes de cada atendimento.</p>
              </div>
            </article>

            <article
              className="flex h-full w-full items-center rounded-lg border border-slate-700/70 bg-[#0D1722] px-4 py-5 gap-6"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-sky-500/15">
                <LuUsersRound aria-hidden="true" className="size-6 text-sky-400" />
              </span>
              <div className="flex flex-col items-start justify-center">
                <h3 className="text-lg text-white font-medium">Gestão da equipe</h3>
                <p className="text-sm text-slate-400 text-start">Cadastre profissionais e organize a rotina de cada um.</p>
              </div>
            </article>

            <article
              className="flex h-full w-full items-center rounded-lg border border-slate-700/70 bg-[#0D1722] px-4 py-5 gap-6"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-sky-500/15">
                <LuCalendarDays aria-hidden="true" className="size-6 text-sky-400" />
              </span>
              <div className="flex flex-col items-start justify-center">
                <h3 className="text-lg text-white font-medium">Agenda e disponibilidade</h3>
                <p className="text-sm text-slate-400 text-start">Tenha visão dos horários, bloqueios e atendimentos do dia.</p>
              </div>
            </article>

            <article
              className="flex h-full w-full items-center rounded-lg border border-slate-700/70 bg-[#0D1722] px-4 py-5 gap-6"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-sky-500/15">
                <LuCalendarCheck aria-hidden="true" className="size-6 text-sky-400" />
              </span>
              <div className="flex flex-col items-start justify-center">
                <h3 className="text-lg text-white font-medium">Agendamento online</h3>
                <p className="text-sm text-slate-400 text-start">Permita que clientes escolham serviço, profissional, data e horário.</p>
              </div>
            </article>

            <article
              className="flex h-full w-full items-center rounded-lg border border-slate-700/70 bg-[#0D1722] px-4 py-5 gap-6"
            >
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-sky-500/15">
                <LuClipboardCheck aria-hidden="true" className="size-6 text-sky-400" />
              </span>
              <div className="flex flex-col items-start justify-center">
                <h3 className="text-lg text-white font-medium">Acompanhamento de atendimentos</h3>
                <p className="text-sm text-slate-400 text-start">Registre concluídos, cancelamentos e faltas para ter mais controle da operação.</p>
              </div>
            </article>
          </div>
        </div>
      </Container>
    </section>
  )
}
