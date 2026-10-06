# Consolidação de QA e acessibilidade

Entrega de 2026-10-06: infraestrutura de testes, regressões, auditoria e correções
pontuais. **Parcialmente validada**: verificações externas/manuais listadas abaixo
continuam pendentes. Não certifica WCAG, autenticação, autorização, isolamento do
backend ou reservas reais. OpenAPI permanece `paths: {}`; CI e publicação fora do
escopo. Registros anteriores dos documentos de cada feature são históricos.

## Diagnóstico e consolidação

| Suíte existente | Diferenças encontradas | Reuso atual |
| --- | --- | --- |
| `frontend/tests/*host*`, `*http*`, metadados | Configuração por TEST_*, sem navegador; conexão loopback com Host simulado | Regras, HTTP e probe compartilhado |
| `validation/*state.cjs`, `client-auth-routing.cjs`, `pwa-policy.cjs` | Transpilam fontes TS; amostras carregadas sem escrever fixtures | Todos os grupos de regras incluídos |
| Auth/booking/appointments HTTP | Portas padrão 3000/3101; argumento Host implicava produção; auth/booking sobrescreviam JSON histórico | Adaptador `qa-http.cjs`, configuração compartilhada e saída por execução |
| Headers/browser/zoom | Edge padrão, localhost, muitos breakpoints, diretórios fixos; zoom em perfil temporário | Header, teclado, foco, destinos, nomes longos, toque emulado e zoom nativo reutilizados |
| Perfil/ajuda browser | Chromium externo, 3000, screenshots junto aos scripts | Reutilizado em desenvolvimento; cenários e links dependem desse ambiente |
| Superadmin/cadastro browser | 3000, detecta controles de desenvolvimento; diretórios fixos | Reutilizados em desenvolvimento e produção local |
| PWA/browser/lifecycle | 3110, Chromium/CDP e perfis temporários; ciclo de vida usa servidor próprio na porta dinâmica | Produção local; cache/offline e worker real, sem refazer implementação |
| Baseline/visual/install/icons/performance/Lighthouse | Evidência e ferramentas específicas da entrega anterior | Históricos, não contados como nova execução; geração de ícones e instalação nativa não obrigatórias neste agregador |

Ampliação em 2026-10-06: os agregadores incluem regras/HTTP de Minhas barbearias
e as jornadas existentes incorporam cards, destinos, filtro combinado, limpeza,
Voltar, valores inválidos, estados e independência das amostras. A navegação de
headers foi atualizada para os cinco destinos. Resultados da rodada da entrega
e limitações em [CLIENT_BARBERSHOPS.md](CLIENT_BARBERSHOPS.md); registros anteriores
abaixo continuam históricos.

Onboarding do proprietário: regras/HTTP em `test:qa:local` e `test:qa:production`;
`owner-onboarding-journeys.mjs` é chamado pela jornada existente nos agregadores de
navegador/produção, reutilizando contexto, transporte, axe e evidências. O comando
`test:onboarding:browser` recorta esses mesmos testes pelo executor, sem duplicá-los.
[Escopo, resultados e limitações](OWNER_ONBOARDING.md).

Lacunas completadas em `frontend/tests/qa-journeys.mjs`: busca/filtros/vazio e
perfil; wizard por teclado, edição/invalidação, conflito/recuperação, repetição,
falhas e reinício; cliente com duas barbearias, histórico, diálogo, cancelamento
local/restauração e link de reagendamento; barbeiro com conclusão/falta e
bloqueios; smoke e axe das páginas existentes. Não sincroniza wizard/lista global.

## Instalação limpa e dependências

Node **24** recomendado (execução registrada: 24.21.0), npm e Git. Os adaptadores
CJS usam `require()` de ESM, exigindo Node 22.12+; use Node 24 para reproduzir.
As ferramentas de browser ficam separadas em `validation/tools`, com lockfile.
Nenhum caminho pessoal é necessário.

```powershell
cd frontend
npm ci
npm ci --prefix ../validation/tools
# Escolha: browsers gerenciados ou Edge/Chrome já instalado.
npm run browsers --prefix ../validation/tools
# Para Edge instalado, dispense download e configure:
$env:PLAYWRIGHT_CHANNEL="msedge"
```

`PLAYWRIGHT_MODULE` é um override opcional para um runtime externo, não um
requisito. O padrão resolve `validation/tools/node_modules/playwright`.
Firefox/WebKit exigem os respectivos binários; selecionar navegador inexistente
falha e preserva o diagnóstico. WebKit automatizado não equivale a Safari real.
PWA/CDP e zoom nativo desta suíte exigem Chromium. A regressão de headers/perfil
exige desenvolvimento em localhost; não usar origem publicada nesses scripts.

## Configuração e servidores

| Variável | Uso / padrão |
| --- | --- |
| `TEST_ENV` | `development` (padrão) ou `production` |
| `TEST_PORT` | Porta lógica de QA, padrão 3000 |
| `TEST_ADDRESS` | Transporte HTTP(S), padrão `http://127.0.0.1:TEST_PORT`; HTTP aceita endereço alternativo |
| `TEST_PUBLIC_HOST` | Host público esperado, padrão localhost; sem protocolo/porta |
| `TEST_PROTOCOL` | HTTP em desenvolvimento, HTTPS como origem pública em produção; incompatibilidades são recusadas |
| `TEST_BROWSER` | chromium (padrão), firefox ou webkit |
| `PLAYWRIGHT_CHANNEL` | Opcional, msedge/chrome para Chromium instalado |
| `TEST_OUTPUT` | Raiz de evidências, padrão `validation/qa-runs` relativo ao repositório |
| `TEST_SERVER` | **Obrigatório:** `isolated` ou `prepared` |

`isolated` recusa porta ocupada, inicia processo Next próprio, registra comando,
PID e log, e encerra apenas essa árvore no final. Não encontra ou encerra
servidores por nome/porta. Desenvolvimento usa `.next/qa-<id>` e uma cópia do
tsconfig; a referência gerada de `next-env.d.ts` é restaurada apenas se não houve
outra edição. Artefatos gerados ficam ignorados pelo Git. Não execute build no
mesmo diretório enquanto um dev de QA estiver ativo.

`prepared` exige preparar explicitamente o servidor em outro terminal. O
agregador não inicia nem encerra esse processo. Sem essa escolha, falha. O probe
verifica worker de produção (200/JavaScript) versus desenvolvimento (404), landing
e origem pública esperada antes das suítes. Não basta a porta responder.
Produção requer build com o mesmo Host e mocks desabilitados.

```powershell
# Desenvolvimento isolado, sem usar o servidor pessoal de 3000:
$env:TEST_ENV="development"
$env:TEST_PORT="3210"
$env:TEST_PUBLIC_HOST="localhost"
$env:TEST_SERVER="isolated"
$env:TEST_BROWSER="chromium"
$env:PLAYWRIGHT_CHANNEL="msedge"
npm run test:qa:local
npm run test:qa:browser

# Produção local, após encerrar o dev de QA:
$env:BARBERHUB_PUBLIC_HOST="localhost"
$env:NEXT_PUBLIC_API_MOCKING="disabled"
npm run build
$env:TEST_ENV="production"
$env:TEST_PORT="3211"
$env:TEST_SERVER="isolated"
npm run test:qa:production

# Servidor explicitamente preparado, alternativa ao isolated:
# terminal 1: npm run dev -- --port 3210
# terminal 2: TEST_ENV=development; TEST_PORT=3210; TEST_SERVER=prepared
# então executar os agregadores local e browser.
```

Para trocar ambiente, remova `TEST_PROTOCOL`/`TEST_ADDRESS` anteriores ou
configure valores compatíveis. Os agregadores não aceitam argumentos posicionais.
Comandos HTTP antigos continuam aceitando porta/Host, mas recusam contradições
com TEST_* e agora fazem o probe. As restrições de localhost dos browsers
legados e da PWA permanecem explícitas; os agregadores recusam essa combinação
quando incompatível. HTTP por Host simulado não prova DNS/TLS.

## Preparação, isolamento e evidências

Cada execução cria diretório único com data UTC e sufixo aleatório. `run.json`
registra revisão Git, alterações locais, hash SHA-256 de fontes/testes,
Node/plataforma, configuração, comandos,
tempos, saída e resultado por suíte, limites, PID e encerramento do servidor.
Cada suíte tem `output.txt` e seus JSONs/capturas; as jornadas novas também geram
`axe.json` com detalhes/exceções/inconclusivos e `trace.zip`. Logs de versões
anteriores não são sobrescritos. Uma suíte obrigatória falhando mantém exit 1;
as outras continuam para preservar diagnóstico. Relatórios locais não são
versionados automaticamente.

Os scripts individuais migrados também usam uma saída única por padrão via
`validation/qa-output.cjs`; o agregador continua recomendado para probe e
relatório completo. Overrides explícitos antigos (`HEADER_QA_OUTPUT` e
`PROFILE_QA_OUTPUT`) conservam seu comportamento de diretório indicado.

As suítes usam contextos ou perfis temporários exclusivos. Não abrem perfis
pessoais, não gravam sessão, não modificam preferências pessoais nem fixtures
de código. Novo contexto/recarga restaura exemplos; ações específicas também
usam “Restaurar exemplos”. A suspensão/rascunho do superadmin desaparece ao sair
ou recarregar. Os testes puros verificam que a fonte não é mutada.

Em produção, as jornadas de conta usam origem HTTPS **lógica interceptada** pelo
Playwright, encaminhada ao servidor HTTP local com Host canônico sem porta.
Isso permite exercitar as telas completas que recusam Host de produção com porta.
Service workers são bloqueados nesse contexto. A PWA é verificada em **outro
perfil temporário**, via HTTP localhost e a exceção de contexto seguro do browser,
com worker real e sem esse roteamento. São camadas diferentes, ambas locais.

## Cobertura e resultados desta execução

| Jornada/camada | Cobertura |
| --- | --- |
| Descoberta | Nome, cidade, vazio, identidade e subdomínio do perfil |
| Acesso demonstrativo | Regras/HTTP de perfis e retorno; browser de prévia, saída, recarga, Google indisponível |
| Booking | Regras de serviço/profissional/data/horário; wizard, erro associado, conflito, repetição, recuperação e reinício |
| Cliente | Duas fixtures, detalhes/histórico, cancelamento somente local, retorno de foco, restauração/recarga, href para wizard |
| Barbeiro | Própria amostra fictícia, conclusão/falta, bloqueio/desbloqueio, restauração |
| Superadmin | Busca, detalhes, resumo, suspensão, rascunhos, erros e perda após recarga/saída |
| Admin | Smoke das páginas, landmarks/contraste, sidebar desktop e destinos existentes |
| Headers | Tab/Shift+Tab/Escape, backdrop, resize, menu extenso, nome longo, destinos/contexto, toque emulado |
| Responsividade | Jornadas críticas e headers em 320/390/768/1440px; headers também nos breakpoints intermediários |
| PWA | Política, cache exclusivo, offline, exclusões, worker conflitante e ciclo de vida real local |

Execução em Windows, Node **24.21.0**, Next **16.3.0**, Playwright **1.58.2**,
axe-core **4.11.1** e **Microsoft Edge 154.0.4258.53**. Host público esperado:
localhost. Rodadas concluídas em 2026-10-06 (horário local de São Paulo).

| Camada / comando executado | Resultado final |
| --- | --- |
| `npm ci --prefix ../validation/tools` | Instalação pelo lockfile aprovada; 0 vulnerabilidades reportadas pelo npm nesta execução |
| `npm run test:qa:local` | **PASS**, 12 suítes; regras, 11 testes de host/configuração/executor, 19 HTTP compartilhados, auth/booking/appointments HTTP |
| `npm run test:qa:browser` | **PASS**, 6 suítes no dev isolado `localhost:3210`: headers 160, perfil/ajuda 38, zoom nativo 10, superadmin 27, cadastro 20, jornadas/axe 39 grupos |
| `npm run test:qa:production` | **PASS**, 17 suítes no processo próprio `localhost:3211`: regras/HTTP, superadmin 25, cadastro 20, jornadas/axe 39, PWA 15 e ciclo de vida 4 |
| `node --test tests/qa-config.test.mjs` | **PASS**, 4 testes; ambiente incompatível, execuções únicas e falha obrigatória com diagnóstico/servidor preparado preservados |
| `npm run lint` | **PASS**, sem avisos ou erros na execução final |
| `npm run typecheck` | **PASS** na execução final |
| `npm run build` | **PASS**, produção com `BARBERHUB_PUBLIC_HOST=localhost` e mocks desabilitados |
| Revisão visual de capturas | Conflito do wizard e diálogo do cliente em 320px, barbeiros admin em 390px; inspeção das imagens, não aparelho real |

A rodada local final usou `TEST_SERVER=prepared` na porta 3210: reutilização
**explícita do servidor de QA** iniciado pelo agregador browser, sem usar o dev
pessoal em 3000. As demais rodadas finais usaram `TEST_SERVER=isolated`.
O executor encerrou seus processos próprios; a rodada local não encerrou o
servidor preparado. Há também uma rodada local isolada aprovada na porta 3212.

Evidências finais, relativas a `validation/qa-runs/`:

- Local: `2026-10-06T17-54-04.385Z-local-zxvnsR/run.json`.
- Browser: `2026-10-06T17-50-49.863Z-browser-GWSJee/run.json`.
- Produção: `2026-10-06T17-54-04.375Z-production-nsQwLm/run.json`.
- Resumo portátil versionável: `validation/qa-summary.json`; nele estão os
  caminhos das capturas, traces, relatórios axe e logs das ferramentas.

Cada rodada de axe cobriu **21 páginas/estados**, com zero falhas fora das
**4 ocorrências** da exceção explícita dos botões. Permaneceram **22 entradas
inconclusivas** por rodada (`aria-valid-attr-value`, `aria-prohibited-attr` e
`color-contrast`) para revisão humana; não foram promovidas a aprovação.
Por exemplo, algumas referências ARIA exigem confirmação no estado dinâmico.

Tentativas com falhas permanecem preservadas em outros diretórios da mesma
raiz e não contam como aprovação. Houve correções nos testes de seletor e de
espera do streaming após recarga. O teste negativo do executor precisou remover
`NODE_TEST_CONTEXT` do subprocesso para executar a suíte HTTP sintética, em vez
de o Node ignorá-la como execução recursiva. Essa fixture testa o executor;
nunca é contada como teste bem-sucedido da aplicação.

## Correções e impacto

Skill `interface-design` aplicada com `.interface-design/system.md`: intenção de
conferir visitas/agenda com calma, mantendo hierarquia, Geist, superfícies/bordas,
ritmo de 4px e ações existentes. Não houve reformulação de headers nem da PWA.

- `DemoDialog`: Tab e Shift+Tab passam a circular entre controles visíveis;
  antes o último Tab saía do conteúdo para a interface do navegador. Mantidos
  diálogo nativo, Escape, fundo inerte e retorno de foco.
- `catalogActionClass`: movimento reduzido anula `scale` do hover. `transform-none`
  sozinho não anulava a propriedade independente `scale` no CSS gerado.
- Textos secundários das páginas admin auditadas e helpers de settings usam
  `slate-400`, já presente no sistema, em lugar dos tons com contraste insuficiente.
  Sem mudanças nos botões públicos, layout ou regras.
- A jornada de trabalho em `/admin/barbeiros` possui `role="group"` para
  sustentar seu nome acessível; antes o `aria-label` estava em um contêiner
  genérico que não admite esse atributo.
- **Exceção mantida:** branco sobre `sky-500` nos botões públicos aprovados,
  medido pelo axe em aproximadamente **2,7:1** para texto pequeno. Falha de
  contraste WCAG AA permanece; relatório identifica elementos, impacto e motivo.
  A exceção não elimina outros alertas de contraste. `incomplete` do axe exige
  inspeção humana e não é registrado como aprovado.

## Verificações não executadas e conclusão parcial

- Leitor de tela real, ferramenta/versão: **não executado**. DOM, axe e teclado
  não são teste com NVDA/Narrator/VoiceOver. Nem ordem de anúncios real está certificada.
- Android e iPhone físicos: **não executado**; toque emulado não comprova teclado
  virtual, orientação, rolagem nativa nem instalação manual nesses aparelhos.
- Firefox/WebKit/Safari real: **não executado nesta máquina**, sem binários
  gerenciados instalados no diagnóstico. Ferramentas ficam configuráveis para
  nova rodada, sem confundir WebKit com Safari.
- HTTPS publicado, DNS/subdomínios/TLS e instalação manual: **não executado**,
  sem ambiente disponibilizado. Esta entrega não publica o projeto.
- Uso humano completo com zoom, ordem de leitura/anúncios e contraste em cada
  estado: **pendente**. Zoom nativo 200% e teclado automatizados são evidências
  locais separadas. Sem declaração de conformidade WCAG ou QA integral.
- Instalação completamente limpa do **produto** em outro computador: não
  executada; as ferramentas de QA foram reinstaladas pelo lockfile, mas os
  `node_modules` da aplicação existentes foram preservados. Os comandos de
  instalação limpa estão documentados, sem alegar teste em outro ambiente.

Próxima ação de QA: executar as camadas pendentes quando houver ambientes e
equipamentos, anexando nova evidência datada. Não autoriza implementar Minhas
barbearias, onboarding, sincronização de demos ou integração real.

## Revisões independentes posteriores — 2026-10-06

Minhas barbearias, onboarding e Ajuda do superadmin já foram implementados por
solicitações específicas posteriores. A observação de escopo acima não indica
que essas telas ainda estejam ausentes. Seus registros de revisão estão em
[CLIENT_BARBERSHOPS.md](CLIENT_BARBERSHOPS.md),
[OWNER_ONBOARDING.md](OWNER_ONBOARDING.md) e
[SUPERADMIN_DEMO.md](SUPERADMIN_DEMO.md). Datas e resultados anteriores foram
preservados; o [roadmap](FRONTEND_ROADMAP.md#11-consolidação-das-entregas-e-revisões--2026-10-06)
consolida o estado das entregas.

Nesta rodada de revisão da Ajuda:

- ESLint e TypeScript passaram.
- `test:superadmin:help` passou em desenvolvimento e produção local, com
  regressões de superadmin/cadastro, HTTP, teclado/foco, quatro larguras e zoom
  nativo 200%. Sete grupos da ajuda em desenvolvimento e seis em produção.
- Oito auditorias axe da ajuda expandida não detectaram violações; resultados
  `incomplete` permanecem sujeitos a inspeção humana, não contam como aprovados.
- `test:qa:local` passou nas 14 suítes. Inclui agora o HTTP da Ajuda, além de
  autenticação/retorno, domínios e regras/HTTP das demonstrações existentes.
- Inspecionadas visualmente as capturas de 320px e 1440px da Ajuda, seguindo
  `interface-design` e o sistema existente, sem alterações visuais.
- Build de produção existente reutilizado. Não houve novo build, regressão
  ampla de navegador/PWA, teste de instalação ou medição de desempenho nesta
  revisão. Os testes do onboarding registrados agora foram executados na
  revisão anterior, não reexecutados pelo recorte da Ajuda.

Evidências em `validation/qa-runs/`: desenvolvimento
`2026-10-06T23-06-58.199Z-superadmin-help-ouLzy7`, produção local
`2026-10-06T23-07-49.305Z-superadmin-help-CVrwIe` e regressão local
`2026-10-06T23-08-00.867Z-local-JS2r3d`. Windows, Node 24.21.0 e Edge 154;
portas isoladas 3225/3226, servidor preparado 3000 preservado. Host/HTTPS lógico
simulados sobre loopback não comprovam publicação.

QA integral continua parcial: leitor de tela real, dispositivos físicos,
outros navegadores, contraste integral e ambiente publicado não foram validados.
A exceção de contraste dos botões públicos continua vigente nas outras jornadas;
a ausência de violações nesta página não elimina essa pendência transversal.

Referências das ferramentas: [isolamento do Playwright](https://playwright.dev/docs/browser-contexts)
e [navegadores/canais](https://playwright.dev/docs/browsers).
