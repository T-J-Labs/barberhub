# Interface administrativa — BarberHub

## Direção

Painel operacional para o gerente de uma barbearia: leitura rápida, decisões claras e controles que funcionam bem no celular. Manter continuidade visual entre Dashboard, Agenda, Clientes, Serviços e Barbeiros. Preservar o padrão visual já estabelecido no código; não aplicar automaticamente a paleta da landing page às telas privadas.

## Cores e profundidade

- Fundo: `#07111c`.
- Superfície de painéis e listas: `#0b1a29`; cabeçalho de lista: `#0d1d2d`; hover: `#102235`.
- Azul de ação, foco e sinalização: `#65d5ff`; azul de texto destacado: `#8de1ff`; preenchimento auxiliar: `#12344a`.
- Texto principal branco; apoio em `slate-400`; metadados em `slate-500`.
- Bordas discretas `slate-800`; inputs mais escuros que os painéis, com borda `slate-700`.
- Profundidade por bordas e mudança sutil de superfície. Sem sombras decorativas ou gradientes.
- Verde identifica disponibilidade/atividade; cinza identifica inatividade. Reservar outras cores semânticas para alertas reais.

## Hierarquia e densidade

- Página em `Container` (`max-w-7xl`, `px-4`), com `py-7 lg:py-10`.
- Cabeçalho: eyebrow azul 14px, `h1` 30px/36px no mobile e 36px no desktop, texto de apoio 14px, ação primária de pelo menos 44px.
- Resumo compacto imediatamente abaixo; métricas com valor 24px, rótulo 12px e números tabulares.
- Filtros em painel próprio; lista como conteúdo principal. Cabeçalho tabular no desktop e linhas em cartões legíveis no mobile.
- Base de espaçamento de 4px. Espaço entre grandes blocos entre 20px e 32px; controles de pelo menos 44px.
- Cantos `rounded-lg` em controles e `rounded-xl` em painéis. Fontes do projeto, com peso e cor definindo hierarquia.

## Padrões de interação

- Formulário de criação/edição embutido acima dos filtros, com título focado ao abrir, rótulos explícitos, validação e ações Salvar/Cancelar.
- Busca e filtro alteram a lista local. Exibir contagem de resultados e estado vazio específico para catálogo vazio ou filtro sem correspondências.
- Ações de linha usam botões nativos com foco visível e área mínima de 44px.
- Inativação preserva o item, conforme ADR de exclusão lógica. Ações demonstrativas em estado React local precisam informar claramente que se perdem ao recarregar.
- Páginas App Router permanecem Server Components; apenas views interativas recebem `"use client"`.
- Dados demonstrativos ficam em `src/features/<feature>/mock-data.ts`. Não presumir endpoints até aprovação no OpenAPI.

## Relatórios

- Indicadores, barras e recortes devem derivar do mesmo conjunto filtrado; nunca escrever números independentes na UI.
- Dar um ponto focal ao resultado principal e manter métricas de contexto em menor hierarquia.
- Gráficos com barras simples no azul do painel, cores semânticas para faltas e cancelamentos, legenda e contagens textuais acessíveis.
- Explicar denominadores e exclusões de cada taxa na própria tela. A amostra demonstra status da agenda, sem estimar faturamento a partir de preço de serviço.

## Configurações para Admin, Barbeiro e Cliente

- Identidade própria de “caderno de ajustes”: cabeçalho calmo, navegação por âncoras com rótulos claros e seções de formulário em folhas amplas. Não repetir o grid de KPIs dos dashboards.
- Preservar `#07111c` no fundo, `#0b1a29` nas folhas, `#65d5ff` em foco e ações, bordas `slate-800` e inputs recuados em `#07111c`.
- Compartilhar `SettingsShell`, `SettingsSection`, `SettingsField` e `settingsInputClass` em `src/features/settings`; o conteúdo dos campos fica na feature de cada papel.
- Navegação horizontal rolável no mobile e coluna lateral no desktop; seções com título, descrição e áreas de toque de pelo menos 44px.
- Exibir prévia contextual somente onde ela ajuda (por exemplo, identidade da barbearia). Na fase de mocks, esclarecer que salvar aplica apenas na sessão e que a recarga restaura os dados demonstrativos.

## Ajuda contextual

- Identidade de guia de trabalho: ponto de partida com a ação mais comum, caminhos por tarefa e dúvidas frequentes, sem métricas ou cartões de dashboard.
- Compartilhar `HelpShell` e `HelpDestination` em `src/features/help`; o texto e os destinos ficam na feature de cada papel.
- Manter as cores e superfícies da área privada. Links de destino devem ter área de toque de pelo menos 44px e foco visível; perguntas usam `details` nativo.
- Descrever somente fluxos que existem na interface e distinguir claramente prévias locais de funcionalidades persistidas.

## Ações demonstrativas no admin

- Manter controles visíveis com resposta coerente: formulário e mudança de estado em memória para Agenda/Clientes; detalhes em diálogo nativo para “Mais opções”.
- `DemoDialog` em `src/features/demo-ui` centraliza foco, Escape, fechamento e superfície dos diálogos demonstrativos.
- Dados criados ou alterados na prévia atualizam imediatamente a lista e seus resumos, mas não são persistidos; informar isso junto à tela.
- Atalhos do Dashboard levam às respectivas telas, e a amostra de atendimentos do Dashboard deriva da mesma agenda demonstrativa.

## Headers — decisão explícita de 2026-10-06

- A landing é a referência visual e de menu, substituindo a referência anterior
  ao barbeiro. Essa decisão aplica-se aos headers; as páginas operacionais
  conservam suas superfícies e cores.
- Base escura `#07111C`, borda `#26384A`, marca BARBER branco/HUB `sky-500`,
  tipografia Geist, ritmo de 4px e controles fixos de 44px com foco `sky-400`.
- Header com altura mínima de 80px, padding vertical 16px. Visitantes mobile:
  grade de 44px/coluna flexível/44px, menu à esquerda e marca centralizada.
  Áreas operacionais conservam Perfil/Notificações e marca responsiva.
- `MobileDrawer`: diálogo nativo à esquerda, 85% da largura, máximo 384px,
  `h-dvh`, borda direita, backdrop preto 65% com blur, nav rolável com padding
  16px/24px. Header do drawer tem separador e padding inferior 20px; conteúdo
  tem padding vertical 24px; rodapé fica no fim, com separador e padding 20px.
- Entrar usa `publicLoginClass`; Criar conta usa `catalogActionClass`, sempre
  `sky-500`/texto `#07111C` com ampliação que respeita movimento reduzido.
  Decisão explícita de 2026-10-07 substitui branco para corrigir contraste.
- Modal contém foco, torna fundo inerte, fecha por Escape/backdrop/controle/link,
  restaura foco e overflow. Breakpoints de fechamento: público/visitante 1024px;
  admin 1200px com foco na sidebar; prévia/operacional conservam menu no desktop.
- Destinos e estados pertencem a cada composição; não criar regras de papéis
  no drawer. Sidebar desktop mantém aparência e navegação anteriores.
- Ajuste solicitado: a prévia do cliente usa a mesma grade operacional do
  barbeiro, com Notificações/Perfil à direita em todas as larguras, por
  `HeaderAccountActions`. Nome/identificação demonstrativa ficam no drawer.
  Notificações permanece painel vazio de demonstração e Perfil usa o destino
  próprio do papel.
- No drawer do cliente, Explorar barbearias/Minhas barbearias/Meus agendamentos ficam no bloco principal;
  Perfil/Ajuda ficam no rodapé separado, acima da saída, como no barbeiro.
- Exceção de posição: somente `/barbearias` em estado visitante centraliza
  verticalmente Entrar/Criar conta no drawer. A composição pública sinaliza
  essa variação visual; os outros contextos mantêm ações no rodapé.

## QA de acessibilidade — 2026-10-06

- Nas superfícies escuras auditadas do admin, metadados legíveis usam `slate-400`
  em lugar dos tons `slate-500/600` que falharam no contraste automatizado.
- `DemoDialog` mantém o modal nativo e circula Tab/Shift+Tab entre controles.
- Ações públicas mantêm `sky-500`/texto `#07111C` (decisão de 2026-10-07); movimento reduzido usa
  `motion-reduce:hover:scale-100`, pois `transform-none` não anula `scale`.
- A exceção de contraste dos botões foi removida após a decisão de 2026-10-07.
  Pendências humanas/externas continuam documentadas em
  `docs/frontend/QA_ACCESSIBILITY.md`; sem certificação WCAG integral.
