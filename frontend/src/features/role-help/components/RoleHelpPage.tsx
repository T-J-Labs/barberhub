import { FiCalendar, FiClock, FiHome, FiSearch, FiUser, FiLogIn } from "react-icons/fi"
import { HelpShell, HelpDestination } from "@/features/help/components/HelpShell"
import { getPlatformNavigation } from "@/features/auth/server-navigation"
import { helpNavigation } from "../navigation"

type Props = { role: "cliente" | "barbeiro"; candidate?: unknown }

export async function RoleHelpPage({ role, candidate }: Props) {
  const platform = await getPlatformNavigation()
  const navigation = helpNavigation(platform, candidate, role)
  const client = role === "cliente"
  const destinations = client ? [
    { href: "/barbearias", title: "Explorar barbearias", description: "Busque por nome, cidade ou bairro e escolha um perfil público.", icon: <FiSearch /> },
    { href: "/cliente/barbearias", title: "Minhas barbearias", description: "Consulte vínculos fictícios, abra o perfil, o agendamento ou filtre suas visitas por estabelecimento.", icon: <FiHome /> },
    { href: "/cliente/agendamentos", title: "Próximas visitas e histórico", description: "Abra detalhes, simule cancelamento ou consulte a prévia de reagendamento.", icon: <FiCalendar /> },
    { href: navigation.profile, title: navigation.context.barbershop ? "Perfil público da barbearia" : "Escolher uma barbearia", description: "O catálogo abre o perfil na raiz do subdomínio validado.", icon: <FiHome /> },
    { href: navigation.booking, title: navigation.context.barbershop ? "Experimentar o agendamento" : "Encontrar um agendamento demonstrativo", description: "No perfil público, use Agendar horário e Experimentar demonstração.", icon: <FiClock /> },
  ] : [
    { href: "/barbeiro", title: "Início do barbeiro", description: "Consulte o próximo atendimento do exemplo.", icon: <FiHome /> },
    { href: "/barbeiro/agenda", title: "Consultar e experimentar a agenda", description: "Detalhes, conclusão, falta, bloqueio e desbloqueio de intervalos.", icon: <FiCalendar /> },
    { href: "/barbeiro/historico", title: "Consultar histórico", description: "Veja os atendimentos concluídos e faltas da amostra.", icon: <FiClock /> },
  ]
  destinations.push({ href: `/${role}/perfil`, title: "Editar nome demonstrativo", description: "Aplique um nome local, cancele o rascunho ou restaure o exemplo.", icon: <FiUser /> })
  if (navigation.login) destinations.push({ href: navigation.login, title: "Consultar tela de acesso", description: "Acesso Google indisponível; nenhuma sessão é criada.", icon: <FiLogIn /> })
  if (navigation.signup) destinations.push({ href: navigation.signup, title: "Consultar tela de cadastro", description: "A escolha de perfil não concede papel ou permissões.", icon: <FiUser /> })

  const questions = [
    ...(client ? [
      { question: "Quando uma barbearia aparece em Minhas barbearias?", answer: "O vínculo real nasce após o primeiro agendamento real confirmado na barbearia. A tela atual mostra duas barbearias vinculadas à mesma identidade fictícia; não é uma lista de favoritos. Concluir o wizard não cria vínculo nem reserva global. Cancelar um exemplo ou suspender a amostra no superadmin não altera esses vínculos. Uma barbearia indisponível permanece na lista, com consulta aos agendamentos e sem as ações públicas indisponíveis." },
      { question: "Como vejo só os agendamentos de uma barbearia?", answer: "Em Minhas barbearias, use Ver meus agendamentos. O filtro mostra a barbearia selecionada e combina com a busca por serviço ou profissional. Limpar busca mantém a barbearia; Remover filtro de barbearia mantém a busca. Valores desconhecidos ou repetidos precisam ser removidos antes de consultar os exemplos. Esse filtro não concede acesso a dados privados." },
      { question: "Como entro no perfil público e no wizard?", answer: "Explore o catálogo e abra uma barbearia. O perfil usa a raiz do subdomínio validado; Agendar horário abre /agendar nesse mesmo subdomínio. Sem contexto válido, os atalhos desta ajuda levam ao catálogo para você escolher um estabelecimento." },
      { question: "Como consulto visitas, detalhes e histórico?", answer: "Abra Meus agendamentos. A página reúne exemplos de próximas visitas e histórico; cada item identifica a barbearia. Abra os detalhes para consultar o atendimento demonstrativo." },
      { question: "Cancelar ou reagendar altera uma reserva real?", answer: "Não. Cancelar altera somente a amostra em memória e move o exemplo para o histórico. A prévia de reagendamento abre o wizard da mesma barbearia, sem transportar uma reserva real ou confirmar a mudança. Wizard e lista global usam dados independentes: experimentar um não atualiza o outro." },
    ] : [
      { question: "De quem é a agenda desta demonstração?", answer: "A agenda pertence a um profissional fictício da Barbearia Esquina. Esse recorte visual não representa sessão, vínculo de equipe ou autorização real. Editar o nome de exibição não muda a identidade ou a titularidade dos atendimentos." },
      { question: "Como experimento conclusão, falta e bloqueios?", answer: "Na agenda, abra os detalhes de um atendimento e use as ações de simular conclusão ou falta disponíveis. Em um intervalo livre, use Bloquear; em um bloqueado, use Desbloquear. Essas mudanças afetam somente exemplos locais. O início e o histórico refletem a mesma amostra." },
      { question: "Como restauro a agenda?", answer: "Use Restaurar exemplos na área demonstrativa para repor a amostra de atendimentos e intervalos. Essa ação é independente de Restaurar exemplo no perfil, que repõe somente o nome de exibição." },
    ]),
    { question: "Como edito ou restauro o nome?", answer: "No Perfil, edite Nome de exibição e use Aplicar à demonstração. Acentos e espaços internos são aceitos; espaços nas extremidades são removidos e nomes vazios são rejeitados. Cancelar edição descarta o rascunho e mantém o último nome aplicado. Restaurar exemplo volta ao nome fictício inicial." },
    { question: "Por quanto tempo ficam as alterações?", answer: "O nome aplicado permanece durante a navegação interna desta área. Recarregar ou sair da área restaura o exemplo. Cliente e barbeiro têm estados independentes. Nada é salvo em conta real, cookies ou armazenamento persistente." },
    { question: "Posso entrar com Google ou recuperar meu acesso?", answer: "O acesso Google ainda está indisponível. A tela de acesso não autentica e escolher um perfil não concede permissões. Recuperação de acesso é responsabilidade do Google; o BarberHub não oferece senha local. Nome, e-mail, avatar e credenciais do Google não são alterados pela demonstração." },
  ]
  return <HelpShell variant={client ? "public" : "admin"} eyebrow={`Área do ${role} · guia da demonstração`} title={client ? "Encontre sua próxima visita" : "Oriente seu dia de atendimento"} description="Caminhos para experimentar o que já existe, com os limites de cada ação à vista.">
    <p className="mt-6 border-l-2 border-[var(--settings-accent,#65d5ff)] pl-4 text-sm leading-6 text-slate-300">Dados fictícios em memória. Não há autenticação, autorização ou reservas reais.</p>
    <section aria-labelledby="tasks-title" className="mt-8">
      <h2 id="tasks-title" className="text-xl font-semibold">O que você quer fazer?</h2>
      <ul className="mt-4 rounded-xl border border-slate-800 bg-[var(--settings-surface,#0b1a29)] px-3 sm:px-5">{destinations.map((item, index) => <HelpDestination key={`${item.title}-${index}`} {...item} />)}</ul>
      {!navigation.login && <p className="mt-3 text-sm leading-6 text-slate-400">Acesso à conta indisponível neste endereço. Use o domínio principal configurado.</p>}
    </section>
    <section aria-labelledby="faq-title" className="mt-10">
      <h2 id="faq-title" className="text-xl font-semibold">Dúvidas frequentes</h2>
      <div className="mt-4 divide-y divide-slate-800 rounded-xl border border-slate-800 bg-[var(--settings-surface,#0b1a29)] px-5 sm:px-7">
        {questions.map(({ question, answer }) => <details key={question} className="group py-1">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-sm font-semibold text-slate-100 hover:text-[var(--settings-highlight,#8de1ff)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--settings-accent,#65d5ff)] [&::-webkit-details-marker]:hidden">{question}<span aria-hidden="true" className="shrink-0 group-open:hidden">+</span><span aria-hidden="true" className="hidden shrink-0 group-open:block">−</span></summary>
          <p className="max-w-3xl pb-5 text-sm leading-6 text-slate-400">{answer}</p>
        </details>)}
      </div>
    </section>
  </HelpShell>
}
