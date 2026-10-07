import Link from "next/link"
import {
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiScissors,
  FiSettings,
  FiUsers,
} from "react-icons/fi"
import { HelpDestination, HelpShell } from "@/features/help/components/HelpShell"

const destinations = [
  { href: "/admin/agenda", title: "Acompanhar a agenda", description: "Veja horários, clientes e profissionais do dia; filtre os atendimentos por situação.", icon: <FiCalendar size={18} /> },
  { href: "/admin/clientes", title: "Consultar clientes", description: "Encontre pessoas cadastradas e consulte o histórico e os indicadores exibidos na lista.", icon: <FiUsers size={18} /> },
  { href: "/admin/servicos", title: "Organizar serviços", description: "Revise o catálogo, preços e duração; experimente adicionar, editar ou inativar um serviço.", icon: <FiScissors size={18} /> },
  { href: "/admin/barbeiros", title: "Organizar a equipe", description: "Cadastre profissionais e ajuste os dias e horários da jornada semanal de exemplo.", icon: <FiClock size={18} /> },
  { href: "/admin/relatorios", title: "Ler os relatórios", description: "Compare atendimentos concluídos, faltas e cancelamentos no período selecionado.", icon: <FiBarChart2 size={18} /> },
  { href: "/admin/configuracoes", title: "Ajustar a barbearia", description: "Edite a identidade, os contatos e o horário de funcionamento na prévia local.", icon: <FiSettings size={18} /> },
] as const

const questions = [
  {
    question: "As mudanças feitas aqui ficam salvas?",
    answer: "Ainda não. Agenda, clientes, serviços, barbeiros e configurações usam dados demonstrativos nesta fase. As alterações feitas nessas telas desaparecem ao recarregar a página.",
  },
  {
    question: "Por que a agenda e os relatórios podem mostrar números diferentes?",
    answer: "Cada tela usa uma amostra própria de dados. Os filtros e indicadores dos relatórios são consistentes dentro da própria tela, mas ainda não compartilham uma base de dados com a agenda.",
  },
  {
    question: "Onde altero os horários de cada barbeiro?",
    answer: "Na aba Barbeiros, abra o cadastro ou a edição de um profissional para ajustar sua jornada semanal. O horário geral da barbearia fica em Configurações.",
  },
] as const

export function AdminHelpView() {
  return (
    <HelpShell eyebrow="Área administrativa / orientação" title="Ajuda para a rotina da barbearia" description="Encontre o caminho para cada tarefa e entenda o que já pode explorar nesta versão do painel.">
      <section aria-labelledby="start-title" className="mt-9 overflow-hidden rounded-xl border border-slate-800 bg-[#0b1a29]">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="border-b border-slate-800 p-6 sm:p-8 lg:border-r lg:border-b-0 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#65d5ff]">Ponto de partida</p>
            <h2 id="start-title" className="mt-4 max-w-sm text-2xl font-semibold tracking-tight text-balance sm:text-3xl">O que você precisa resolver agora?</h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">Acompanhe o movimento do dia, mantenha sua equipe organizada ou encontre um cliente sem percorrer o painel inteiro.</p>
            <Link href="/admin/agenda" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#65d5ff] px-5 text-sm font-bold text-[#061522] transition-colors hover:bg-[#8de1ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff]">Abrir agenda</Link>
          </div>
          <div className="p-3 sm:p-5">
            <p className="px-3 pt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 sm:px-4">Caminhos mais usados</p>
            <ul className="mt-2">
              {destinations.slice(0, 3).map((item) => <HelpDestination key={item.href} {...item} />)}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="topics-title" className="mt-11">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#65d5ff]">Explore o painel</p>
          <h2 id="topics-title" className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">Cada área tem seu lugar</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">Acesse diretamente as ferramentas de equipe, análise e identidade da barbearia.</p>
        </div>
        <div className="mt-5 rounded-xl border border-slate-800 bg-[#0b1a29] px-3 sm:px-5">
          <ul className="grid md:grid-cols-2 md:gap-x-5">
            {destinations.slice(3).map((item) => <HelpDestination key={item.href} {...item} />)}
          </ul>
        </div>
      </section>

      <section aria-labelledby="questions-title" className="mt-11 border-t border-slate-800 pt-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#65d5ff]">Para saber antes de usar</p>
          <h2 id="questions-title" className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">Dúvidas frequentes</h2>
        </div>
        <div className="mt-5 divide-y divide-slate-800 rounded-xl border border-slate-800 bg-[#0b1a29] px-5 sm:px-7">
          {questions.map(({ question, answer }) => (
            <details key={question} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-sm font-semibold text-slate-100 marker:content-none hover:text-[#8de1ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff] [&::-webkit-details-marker]:hidden">
                {question}
                <span className="shrink-0 text-lg font-normal text-[#65d5ff] group-open:hidden" aria-hidden="true">+</span>
                <span className="hidden shrink-0 text-lg font-normal text-[#65d5ff] group-open:block" aria-hidden="true">−</span>
              </summary>
              <p className="max-w-3xl pb-5 text-sm leading-6 text-slate-400">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <p className="mt-8 text-xs leading-5 text-slate-400">Esta ajuda descreve a prévia atual do painel administrativo. Recursos que dependem da API serão disponibilizados em uma etapa posterior.</p>
    </HelpShell>
  )
}
