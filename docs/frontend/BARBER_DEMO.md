# Área do barbeiro demonstrativa

Entrega local de 2026-10-05, orientada pela skill `interface-design` e pelos
padrões privados em `.interface-design/system.md`.

## Rotas e implementação

- `/barbeiro`: próximo atendimento de exemplo, detalhes e acesso à agenda.
- O início também apresenta resumo do histórico e link para o histórico completo.
- `/barbeiro/agenda`: lista cronológica do dia de exemplo, estados e intervalos.
- `/barbeiro/historico`: histórico completo com data de cada atendimento e detalhes.
- Layout e `BarberHeader` existentes preservados; os destinos Início e Minha
  agenda foram habilitados. Perfil e Ajuda também estão disponíveis, conforme
  [PROFILE_HELP.md](PROFILE_HELP.md). O header e seu drawer seguem o padrão da
  landing desde a [revisão de 2026-10-06](HEADERS_REVIEW.md), mantendo destinos,
  notificações demonstrativas e saída por navegação local.
- Feature `frontend/src/features/barber-demo`: fixtures/modelos de apresentação,
  transições puras, estilos, shell Server Component, provider e view interativos.
- `Container` e `DemoDialog` existentes reutilizados. Páginas são Server Components.

## Comportamentos e limites

A fixture apresenta somente Rafael Lima e a Barbearia Esquina, ambos fictícios.
A agenda tem referência fixa em 5 de outubro de 2026 às 10:00 de Brasília
(UTC−3). Há exemplos anteriores em 30 de setembro e 4 de outubro de 2026.
Há atendimentos agendados, concluído e falta, um intervalo livre e um bloqueado.
Detalhes identificam cliente fictício, profissional, serviço, valor de exemplo,
data, intervalo e estado.

Conclusão ou falta afetam apenas um atendimento agendado da amostra. O início
passa ao próximo exemplo, ou mostra ausência de próximos. Bloqueio/desbloqueio
afetam somente intervalos livres/bloqueados; não alteram atendimentos.
Essas transições são convenções da demonstração, não regras aprovadas da API.
Cada ação exibe feedback local explícito; Restaurar exemplos reinicia a amostra.

O provider no layout conserva alterações na navegação interna entre início,
agenda e histórico. Recarregar ou sair da área desmonta esse estado. Não há backend, banco,
requisições de agenda, localStorage, cookies de sessão ou persistência. A amostra
é independente do wizard e dos exemplos da área do cliente.

O OpenAPI continua com `paths: {}`. Não há OAuth, sessão, vínculo profissional
aprovado, titularidade, autorização ou isolamento efetivo nesta interface.
Rotas, header e recorte de uma fixture não protegem dados. Nenhum `tenant_id`
fornecido pela interface é usado como autorização. As URLs reutilizam a convenção
existente; esta entrega não modifica roteamento por domínio ou o admin.

Integração real depende de contratos aprovados para identidade do profissional,
vínculo com estabelecimento e permissões, agenda, detalhes, status e bloqueios,
com contexto autenticado e isolamento multi-tenant validados pelo backend.

## Validação

Na pasta `frontend`, `npm run test:barber` executa doze grupos de verificações
das transições: próximo cronológico/referência fixa, conclusão, falta/estado
vazio, status terminal/idempotência, bloqueio/desbloqueio e ações incompatíveis
ou chaves desconhecidas, recorte do histórico, resumo e transições entre listas,
ordenação por dia/mês/ano, formatação da data e recorte da agenda por data.
Também verifica preservação da fixture original.

Executados e aprovados nesta entrega:

- `npm run test:barber`: seis grupos de comportamento.
- `npm run lint`, `npm run typecheck` e `npm run build` (Turbopack).
- Regressões: `test:routing` (3 testes), `test:auth` (62 verificações),
  `test:booking` (39 verificações) e `test:appointments` (8 grupos).
- Navegador local em `localhost:3000`: início, agenda, detalhes, conclusão,
  falta, bloqueio/desbloqueio, restauração, navegação interna com estado
  compartilhado, ausência de próximos após esgotar a amostra e reinício ao
  recarregar. Bloqueio/desbloqueio também experimentados com Enter.
- Foco inicial no diálogo, foco nos detalhes após remover ações de status,
  Escape e retorno ao botão de origem conferidos. Shift+Tab permaneceu no
  diálogo nativo. Inspeção visual de foco visível.
- Agenda sem rolagem horizontal em 320, 390, 768 e 1440px por medição DOM;
  revisão visual do início/agenda e do diálogo em mobile, e da agenda desktop.

Evidências: `validation/barber-demo-desktop.png`, `barber-demo-mobile.png` e
`barber-demo-agenda-mobile.png`. A revisão de navegador usou desenvolvimento;
o build foi compilado, mas não foi navegado em servidor de produção. Não foram
executados leitor de tela, QA em dispositivo físico, DNS/TLS público, OAuth
ou testes de autorização/isolamento real. Avisos `aria-live` foram inspecionados
no DOM; isso não certifica sua leitura por tecnologia assistiva.

## Arquivos desta entrega

- `frontend/src/app/(private)/barbeiro/layout.tsx`, `page.tsx`, `agenda/page.tsx`
  e `historico/page.tsx`.
- `frontend/src/features/navigation/config/barber-navigation.ts`.
- `frontend/src/features/barber-demo/demo-data.ts`, `state.ts`, `styles.ts` e
  `components/{BarberDemoProvider,BarberDemoShell,BarberDemoView,DemoHistory}.tsx`.
- `frontend/package.json` e `validation/barber-demo-state.cjs`.
- Este documento, `README.md`, `FRONTEND_ROADMAP.md`, `CLIENT_EXPERIENCE.md`
  e as três evidências visuais acima.

Mudanças da área do cliente já presentes no workspace foram preservadas.

### Correção de retorno de foco

Ao concluir os dois atendimentos no início, o último botão de detalhes deixa
de existir. O fechamento desse diálogo agora direciona o foco para “Ver minha
agenda de exemplo” após o diálogo fechar. O retorno nativo ao botão de origem
é preservado nos demais casos. Reproduzido no navegador local: concluir 10:00,
Escape, concluir 11:15, Escape; `document.activeElement` terminou no link
`/barbeiro/agenda`, com o diálogo fechado. ESLint, TypeScript, build e os seis
grupos de transições passaram novamente. Evidência:
`validation/barber-demo-empty-focus.png`.

### Histórico e resumo no início (registro da versão anterior)

Ampliação solicitada: o histórico da agenda reúne os atendimentos concluídos e
marcados como falta, do horário mais recente para o mais antigo no dia fictício.
Agendados e intervalos livres/bloqueados permanecem na lista da agenda, sem
duplicação. Os detalhes do histórico são consultivos, sem novas ações de status.
O início mostra até dois finalizados mais recentes, com totais de concluídos e
faltas derivados do mesmo estado em memória e link `/barbeiro/agenda#historico`.
Não há taxas, reputação, faturamento ou dados de outros profissionais.

Concluir ou marcar falta move o exemplo e atualiza o resumo imediatamente;
restaurar ou recarregar reinicia também o histórico. Há mensagem para histórico
vazio. Ao fechar um diálogo na agenda após mover o atendimento, o foco retorna
ao botão correspondente no histórico. No início, após finalizar o último
atendimento, permanece o retorno para o link da agenda.

Validação desta ampliação: nove grupos de testes em `npm run test:barber`
(incluindo recorte/ordem, resumo após transições, exclusão de bloqueios,
preservação da fixture e histórico vazio), ESLint, TypeScript e build passaram.
No navegador de desenvolvimento foram verificados resumo inicial e atualizado,
histórico completo, detalhes consultivos, movimento após conclusão/falta,
restauração, navegação com estado compartilhado e retorno de foco com Escape,
inclusive no último atendimento. Início e agenda sem rolagem horizontal em
320, 390, 768 e 1440px por medição DOM; revisão visual em mobile e desktop.
O histórico vazio foi testado na função de recorte, sem reprodução no navegador.
Não foram executados leitor de tela, dispositivo físico ou navegador em produção.
Evidências: `validation/barber-history-home-mobile.png` e
`validation/barber-history-agenda-mobile.png` e `validation/barber-history-summary.png`.

### Página dedicada e datas completas

O histórico completo foi movido para `/barbeiro/historico`, com destino próprio
no menu existente. O início preserva o resumo dos dois mais recentes e aponta
para essa página. A agenda oferece o link para o histórico e não repete a lista.
Esta versão substitui o destino anterior `/barbeiro/agenda#historico`.

Cada item da fixture tem data ISO local. Lista, resumo, nomes acessíveis dos
botões e detalhes exibem a data específica do atendimento, com dia, mês por
extenso e ano (por exemplo, “30 de setembro de 2026”). Horários permanecem no
fuso de Brasília. Histórico ordenado por data e horário decrescentes; a agenda
mostra apenas o dia de referência. A formatação usa fuso explícito, sem depender
do relógio ou do fuso da máquina. Os totais do resumo abrangem todo o histórico
da amostra, não apenas um dia. Concluir/falta preservam a data do exemplo.

Ao fechar detalhes depois de concluir na agenda, o foco vai para o link do
histórico, pois o item finalizado passou para outra página. Detalhes do histórico
são consultivos e Escape retorna ao botão de origem. Sem sessão real,
persistência ou integração; OpenAPI segue com `paths: {}`.

Validação desta versão: ESLint, TypeScript, build e doze grupos de testes passaram,
incluindo ordenação entre dias, meses e anos diferentes, formatação e preservação
da data após conclusão. Navegador de desenvolvimento: acesso direto ao histórico,
menu, detalhes de setembro com data correta, ausência de ações de status no
histórico, Escape/retorno de foco e conclusão na agenda seguida de navegação ao
histórico com estado compartilhado e data preservada. Sem rolagem horizontal em
320, 390, 768 e 1440px por medição DOM; revisão visual mobile/desktop.
Não foram executados leitor de tela, dispositivo físico ou navegação em produção.
Evidências: `validation/barber-history-page-desktop.png` e
`validation/barber-history-page-mobile.png`.
