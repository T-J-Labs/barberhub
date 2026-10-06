import { FiHome, FiSearch, FiPlus, FiRefreshCw, FiArrowUpRight } from "react-icons/fi"
import { HelpShell, HelpDestination } from "@/features/help/components/HelpShell"
import { onboardingHref } from "@/features/owner-onboarding/routing"

const destinations = [
  { href: "/super-admin", title: "Entender a visão geral", description: "Consulte total, rascunhos, ativas e suspensas da mesma amostra em memória.", icon: <FiHome /> },
  { href: "/super-admin/barbearias", title: "Buscar e consultar barbearias", description: "Busque por nome, cidade ou bairro e use Ver detalhes no exemplo escolhido.", icon: <FiSearch /> },
  { href: "/super-admin/barbearias", title: "Experimentar o cadastro manual", description: "Na lista, use Cadastrar barbearia. Preencha nome, cidade, bairro, subdomínio pretendido e motivo do cadastro manual; todos são obrigatórios.", icon: <FiPlus /> },
  { href: "/super-admin/barbearias", title: "Experimentar suspensão ou reativação", description: "Abra os detalhes de um exemplo que não seja rascunho, use Suspender na amostra ou Reativar na amostra e confirme no diálogo. Cancelar ou Escape mantém o estado.", icon: <FiRefreshCw /> },
  { href: onboardingHref("superadmin"), title: "Ver demonstração do onboarding", description: "Abre um exemplo independente de configuração do proprietário. Ao sair da área do superadmin, rascunhos e alterações locais são descartados. Nenhum dado será transferido ao proprietário e não há retomada do rascunho.", icon: <FiArrowUpRight /> },
]

const questions = [
  { question: "O que representam os indicadores da visão geral?", answer: "Total conta todos os itens da amostra atual. Rascunhos, ativas e suspensas contam separadamente os respectivos estados demonstrativos. Os seis exemplos originais começam ativos: total 6, rascunhos 0, ativas 6 e suspensas 0. Criar um rascunho ou mudar o estado de um exemplo atualiza a mesma coleção; os números não representam estabelecimentos publicados, assinaturas ou acesso real." },
  { question: "Como buscar e consultar os detalhes de uma barbearia?", answer: "Abra Barbearias, preencha Buscar barbearia com nome, cidade ou bairro e use Buscar. A busca ignora diferenças de maiúsculas e acentos. Use Ver detalhes no item desejado. Voltar à lista com a busca e Voltar do navegador preservam a busca submetida. Se não houver resultados, limpe a busca para consultar a amostra." },
  { question: "O cadastro manual cria um estabelecimento real?", answer: "Não. Na lista, Cadastrar barbearia abre o formulário. Nome, cidade, bairro, subdomínio pretendido e motivo são obrigatórios. Criar adiciona apenas um rascunho em memória e abre seus detalhes; Cancelar descarta o preenchimento. O rascunho participa da lista, busca e resumo local, sem criar tenant, conta, compra, convite, acesso ou publicação." },
  { question: "Por que o motivo do cadastro é obrigatório?", answer: "É uma exigência do formulário e da validação local implementados. O texto acompanha o rascunho e aparece em seus detalhes como contexto do cadastro manual. Isso não é uma auditoria persistida nem uma aprovação ou liberação real." },
  { question: "O subdomínio informado fica reservado?", answer: "Não. A demonstração valida o formato e conflitos apenas contra a amostra atual, incluindo rascunhos, e a proteção local de nomes de rotas. Aceitar o campo não garante disponibilidade real, não reserva o nome e não provisiona um endereço público. Política oficial e unicidade concorrente dependem de contratos e backend." },
  { question: "Por que rascunhos não podem ser suspensos ou reativados?", answer: "Rascunho é um estado distinto da amostra: nenhum estabelecimento, acesso, compra, publicação ou subdomínio foi provisionado. Por isso seus detalhes não oferecem suspensão ou reativação, e a regra local ignora essas alterações em rascunhos. As ações estão disponíveis nos exemplos originais." },
  { question: "Suspender um exemplo altera catálogo, acesso ou publicação?", answer: "Não. Confirmar suspensão ou reativação muda apenas o estado do exemplo na memória do superadmin. Lista, detalhes e resumo refletem a mudança, mas as fixtures públicas, o catálogo, os vínculos do cliente, o acesso e a publicação permanecem independentes. Nada é aplicado a uma barbearia real." },
  { question: "Por quanto tempo ficam as alterações demonstrativas?", answer: "Rascunhos e estados alterados permanecem enquanto a área do superadmin estiver montada. Navegar entre Início, Barbearias, detalhes e Ajuda preserva essa mesma memória. Não há armazenamento persistente, sessão autenticada ou garantia de retomada." },
  { question: "O que acontece ao recarregar ou sair da área?", answer: "Recarregar restaura os seis exemplos originais e remove os rascunhos e suspensões locais. Sair para onboarding ou outra área também descarta essa memória. Voltar depois não recupera os dados. Visitar Ajuda e retornar à lista por navegação interna preserva a amostra." },
  { question: "Por que um rascunho pode aparecer como indisponível?", answer: "Seu identificador existe somente na memória da navegação em que foi criado. Após recarregar ou sair da área, abrir aquele endereço mostra Exemplo indisponível. Use o retorno à lista, que preserva a busca quando ela estiver no endereço. Não há recuperação ou consulta a um cadastro real." },
  { question: "O onboarding usa os dados do rascunho?", answer: "Não. O atalho abre um exemplo fictício independente pela origem superadmin, com uma prévia de convite e aceite demonstrativo. Não leva identificador ou campos do rascunho, não transfere dados ao proprietário, não sincroniza e não envia convite. Sair do superadmin para esse fluxo descarta rascunhos e alterações locais." },
  { question: "Compra e liberação manual já funcionam?", answer: "Como comportamento implementado, o superadmin apenas cria rascunhos e altera estados de exemplos em memória. O onboarding apresenta cenários fictícios de compra e liberação. A regra de produto aprovada exige configuração mínima e compra confirmada ou liberação explícita pelo superadmin para a publicação futura; checklist completo não publica automaticamente. Pagamento, convite, vínculo do responsável, autorização, provisionamento e publicação reais ainda não estão integrados." },
  { question: "Por que “Planos e assinaturas” está indisponível?", answer: "Essa página e suas operações não estão implementadas. A demonstração não oferece planos, cobrança, preços ou condições comerciais. O menu mantém o item indisponível; a ajuda orienta somente destinos existentes, sem executar compra ou conceder poderes administrativos reais." },
]

// Guia de trabalho do superadmin: tarefas da amostra lideram a leitura.
// Reutiliza superfícies, tipografia, densidade e foco da ajuda administrativa.
// Conteúdo estático independe dos cenários e da coleção do provider existente.
export function SuperadminHelpPage() {
  return <HelpShell eyebrow="Área do superadmin · guia da demonstração" title="Ajuda do superadmin" description="Consulte a amostra, experimente as ações existentes e entenda os limites de cada caminho.">
    <p className="mt-6 border-l-2 border-[#65d5ff] pl-4 text-sm leading-6 text-slate-300">Dados fictícios em memória. Não há autenticação, autorização ou alteração real. Criar rascunhos, suspender e reativar afeta somente a demonstração.</p>
    <section aria-labelledby="tasks-title" className="mt-8">
      <h2 id="tasks-title" className="text-xl font-semibold">O que você quer fazer?</h2>
      <ul className="mt-4 rounded-xl border border-slate-800 bg-[#0b1a29] px-3 sm:px-5">
        {destinations.map(item => <HelpDestination key={item.title} {...item} />)}
      </ul>
    </section>
    <section aria-labelledby="faq-title" className="mt-10">
      <h2 id="faq-title" className="text-xl font-semibold">Dúvidas frequentes</h2>
      <div className="mt-4 divide-y divide-slate-800 rounded-xl border border-slate-800 bg-[#0b1a29] px-5 sm:px-7">
        {questions.map(({ question, answer }) => <details key={question} className="group py-1">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 py-3 text-sm font-semibold text-slate-100 hover:text-[#8de1ff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65d5ff] [&::-webkit-details-marker]:hidden">{question}<span aria-hidden="true" className="shrink-0 group-open:hidden">+</span><span aria-hidden="true" className="hidden shrink-0 group-open:block">−</span></summary>
          <p className="max-w-3xl pb-5 text-sm leading-6 text-slate-400">{answer}</p>
        </details>)}
      </div>
    </section>
  </HelpShell>
}
