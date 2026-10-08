# Histórico de validação do frontend

Os três relatos sequenciais foram reunidos em 2026-10-07. Datas, comandos,
resultados PASS/FAIL, tentativas e limitações foram preservados. Afirmações
de pendência nestes relatos são históricas; o estado atual está em
[TECHNICAL_CLOSURE.md](TECHNICAL_CLOSURE.md) e no [roadmap](FRONTEND_ROADMAP.md).
Publicação e validação pública ficam para depois das integrações com o backend
estarem funcionando e validadas localmente, conforme a decisão posterior.

- [Consolidação inicial](#consolidacao-inicial)
- [Acompanhamento](#acompanhamento)
- [Revisão final](#revisao-final)

## Correção do QA de produção após o ajuste do header — 2026-10-08

O log do GitHub fornecido pelo usuário registrou três falhas no agregador:
`public-routing-http` esperava o nome acessível do header institucional antigo;
`client-auth-http` esperava um aviso que estava no drawer antigo; a jornada do
wizard em 390px recebeu `false` em uma asserção booleana imediata.

Os testes HTTP agora conferem o header compartilhado aprovado, o drawer e os
quatro destinos institucionais atuais, além do aviso Google existente na FAQ e
da ausência de criação de conta/permissões. A jornada aguarda o foco esperado
após a validação e o conflito, reutilizando `focused`, com o mesmo timeout.
O código de agendamento aplica foco por `requestAnimationFrame` e `useEffect`;
ler imediatamente não garante que essa etapa de renderização ocorreu.
Um reproducer em 390px, com clique e leitura no mesmo frame, confirmou foco
ainda no botão e depois no radio; evidência local em
`validation/qa-runs/ci-focus-same-frame.json`. Dez cliques normais com CPU 8x
passaram localmente; isso não reproduziu a intermitência exata do runner Linux.
Nenhuma interface, regra, backend ou contrato foi alterado nesta correção.

Validação executada: ESLint e build novo isolado pela CLI Next, incluindo
TypeScript, passaram. `npm run test:qa:production` passou nas 19 suítes,
com fontes estáveis, em Windows/Edge 154.0.4258.62, porta 3241, Host localhost
e HTTPS lógico simulado sobre transporte loopback. Inclui 27 testes HTTP
compartilhados, 48 de auth, wizard nas quatro larguras, axe, PWA, zoom e ciclo
de atualização do worker. Evidência:
`validation/qa-runs/2026-10-08T15-41-26.704Z-production-3vV72a/run.json`.
O build não executou geração OpenAPI. A nova execução do GitHub/Linux não foi
realizada nesta sessão; dispositivos físicos, leitor de tela e DNS/TLS público
continuam fora desta validação local.

<a id="consolidacao-inicial"></a>

## Consolidação inicial — 2026-10-06 e início de 2026-10-07

Este é o registro da rodada inicial. O [acompanhamento das pendências](VALIDATION_HISTORY.md#acompanhamento)
registra a adoção posterior do lock no ambiente pessoal, decisão aprovada de
texto escuro nos botões e as novas execuções. Exceções e dependências antigas
descritas abaixo são resultados históricos, não o estado visual/instalado atual.

Rodada solicitada em três etapas sequenciais. Foram lidos `AGENTS.md`, ADR,
README, roadmap, experiência/autenticação do cliente, documentos das jornadas,
QA e PWA, sistema visual e guias locais do Next. Nenhuma feature foi refeita;
backend, banco, OpenAPI, domínios e regras de produto foram preservados.
O contrato continua com `paths: {}` e as jornadas continuam sendo demonstrações
em memória, sem sessão, autorização ou reserva real.

### Ambiente e preservação

- Windows 10.0.26200, Node 24.21.0, npm 11.19.0.
- Playwright 1.58.2 e axe-core 4.11.1, instalados pelo lock de `validation/tools`.
- Edge 154.0.4258.53 e Chrome 154.0.8037.98 locais, headless, com contextos/perfis
  temporários. Ambos usam Chromium; isso não constitui cobertura entre engines.
- Chromium gerenciado 145.0.7632.6 foi instalado posteriormente com Playwright,
  em cache temporário próprio, para verificar o navegador escolhido para o CI.
- O usuário informou que somente o ambiente local estava disponível.
- Checkout inicialmente limpo, HEAD `ee0fddfa13102b851c98d851bdb7e4296f8ddf28`.
  Os snapshots incluíram as correções não commitadas desta rodada.
- `node_modules`, `.next`, arquivos de ambiente e servidor pessoal na porta
  3000/PID 15056 (iniciado às 15:26:03 locais) foram preservados. Instalações,
  builds e servidores de QA ocorreram em cópias próprias no diretório temporário.
  Não foram usados perfis pessoais dos navegadores.
- Portas próprias: 3235/3236 na etapa 1, 3240 na etapa 2 e 3241–3252 nos
  testes do executor de CI. Servidores são encerrados somente por seus PIDs.
- Rodada iniciada em 2026-10-06 e retomada em 2026-10-07 no fuso de São Paulo.
  Relatórios mantêm timestamps UTC. Não houve publicação, push ou execução remota.

Evidências novas, sem substituir relatórios históricos:
`validation/qa-runs/final-consolidation-2026-10-06-d2c675ca/` (ignorado pelo Git).
Resumo portátil versionado: `validation/frontend-consolidation-summary.json`.
O diretório temporário de execução foi
`%LOCALAPPDATA%/Temp/barberhub-final-d2c675ca6bfc46f09f375b92240fdec5`.
Os `run.json` preservam caminhos originais, versões, fingerprint e comandos.
Snapshots fora do Git têm `code` vazio no executor; `snapshot.json` registra
explicitamente o HEAD e as alterações de origem. Não representam um novo commit.

### Etapa 1 — QA e acessibilidade

**Concluída no ambiente disponível, com pendências externas e de contraste.**
Percursos reais de Tab foram ampliados para 23 rotas estáticas; registram
elemento ativo, ordem, visibilidade e outline/ring. Campos nativos date/time
possuem segmentos com o mesmo elemento ativo, tratados sem encerrar o percurso
prematuramente. Foram verificadas também setas no grupo nativo de serviços,
Tab/Shift+Tab em diálogos, Escape, foco inicial/contido e retorno ao gatilho.
As jornadas existentes cobrem cliente, barbeiro, admin, superadmin, cadastro
manual, onboarding, catálogo e agendamento de Esquina/Navalha, inclusive
estados vazios, erros, conflito, recuperação e descarte de rascunhos.

Responsividade foi exercitada em 320/390/768/1440px nas jornadas e em dez
larguras de 320 a 1440px nos headers, incluindo seus breakpoints. Contexto
touch e zoom nativo 200% são automação local, não testes em aparelho físico.
Foram inspecionadas capturas de onboarding, diálogo do cliente e páginas admin
de relatórios/ajuda; o título do diálogo também foi auditado inteiro, após
rolagem explícita, para distinguir recorte de contraste insuficiente.

Correções pontuais encontradas:

- Iniciais em Configurações recebem `role="img"`, compatível com o nome
  acessível já existente; elimina o inconclusivo `aria-prohibited-attr`.
- Textos secundários em Relatórios e Ajuda do admin passam de `slate-500`
  para `slate-400`, padrão já usado no painel. Eliminadas 12 ocorrências de
  contraste dessas telas; ícones decorativos e botões públicos foram preservados.
- O teste do menu superadmin reconhece Ajuda já implementada e apenas Planos
  e assinaturas indisponível. Não altera navegação nem habilita funcionalidades.
- Teste de perfil aguarda o drawer terminar de fechar antes de selecionar
  Entrar no header. Capturas usam `caret: 'initial'`, evitando injeção de CSS
  de caret antes da hidratação e o aviso artificial observado no perfil público.

#### Resultados observados e reexecuções

| Execução em desenvolvimento | Resultado efetivo |
| --- | --- |
| Edge agregado `2026-10-06T23-44-31.654Z-browser-b4Wjbq` | FAIL inicial: expectativa antiga do menu, foco das ferramentas Next e contraste admin; preservado |
| Edge `final-edge-headers` | PASS, 160 verificações após correção da expectativa |
| Edge `final-edge-journeys` | PASS, 73 grupos e 121 auditorias; zero falhas fora da exceção pública |
| Chrome agregado `2026-10-06T23-53-15.314Z-browser-VZ4cBS` | FAIL apenas por sincronização do fechamento do drawer no teste de perfil; outras cinco camadas passaram |
| Chrome `final-chrome-profiles` | PASS, 38 verificações após corrigir o teste |
| Edge `final-edge-supplementary-pass` | PASS: setas, título inteiro, Tab completo em Configurações (34 controles) e Relatórios (9), captura sem aviso de hidratação |

A primeira tentativa suplementar esperou indevidamente zero violações, incluindo
o CTA público já excetuado; foi corrigida e preservada separadamente. Tentativas
iniciais com junction de `node_modules` foram recusadas pelo Turbopack porque
apontavam para fora do snapshot. A execução efetiva usou instalação própria,
sem alterar dependências do checkout. Os agregados FAIL não foram reclassificados
como PASS: as reexecuções são evidências distintas.

Comando do primeiro agregado, em `stage1-native/frontend` (resultado inicial
FAIL na tabela, seguido das correções e reexecuções):

```powershell
$env:TEST_SERVER='isolated'
$env:TEST_ENV='development'
$env:TEST_PORT='3235'
$env:TEST_PUBLIC_HOST='localhost'
$env:TEST_BROWSER='chromium'
$env:PLAYWRIGHT_CHANNEL='msedge'
npm run test:qa:browser
```

Recortes finais usaram o servidor próprio preparado na porta 3236:
`QA_SUITE_OUTPUT=../validation/qa-runs/final-edge-journeys node tests/qa-journeys.mjs`
com Edge; `PROFILE_QA_OUTPUT=../validation/qa-runs/final-chrome-profiles`
e `npm run test:profiles:browser -- 3236` com `PLAYWRIGHT_CHANNEL=chrome`.
As atribuições são variáveis de ambiente (no PowerShell, `$env:NOME='valor'`),
não argumentos posicionais do agregador. O script suplementar foi preservado
ao lado da evidência para permitir identificar exatamente o recorte executado.

#### Revisão dos inconclusivos do axe

`accessibility-review.mjs` guarda HTML, referências ARIA, estilos, fundos
ancestrais, tamanho, geometria e obstrução de cada nó inconclusivo, ao lado
do resultado bruto. Isso complementa a revisão, sem suprimir alertas ou
transformá-los em aprovação automática.

No recorte Edge de desenvolvimento foram 169 entradas de regras inconclusivas
e 482 nós inspecionados: 98 referências a popup fechado, 382 alertas de
contraste com a chave `nonBmp` do axe (conteúdo não textual), um título
parcialmente recortado e um texto curto decorativo.
Os IDs de `aria-controls` existem no DOM e apontam para diálogos nativos
fechados; abertura/foco/fechamento são exercitados nas suítes de navegação.
Os símbolos `✓`, `○`, `+` e `−` observados são decorativos, ocultos por ARIA,
com texto equivalente adjacente. O marcador “1” da landing é decorativo em
uma lista ordenada. Permanecem registrados como inconclusivos, sujeitos a
revisão humana e leitor de tela; a inspeção DOM não certifica anúncios reais.

Na produção Edge foram 110 auditorias, 160 entradas inconclusivas e 473 nós
inspecionados. O título inteiro não gerou o inconclusivo de recorte; o registro
anterior continua preservado. Variações nas contagens refletem estados,
ambientes e repetições auditados, não número de defeitos únicos.

**Pendência conhecida:** branco sobre `bg-sky-500` nos botões públicos tem
aproximadamente 2,7:1 segundo o axe e continua falhando contraste AA de texto
pequeno. Foram 100 ocorrências repetidas excetuadas no recorte Edge de
desenvolvimento e 90 em produção. A lista existente é limitada a esses botões;
outros contrastes continuam causando falha. Nenhuma nova variante de cor foi
criada. Alterar esse padrão exige orientação explícita do usuário.

### Etapa 2 — instalação limpa, build e produção local

**PASS no ambiente local isolado.** Foram copiados arquivos rastreados e
arquivos novos não ignorados, incluindo documentos/contrato necessários ao
frontend; backend, dependências, artefatos e arquivos de ambiente não foram
copiados. `snapshot.json` confirma ausência inicial de `node_modules`, `.next`
e `.env.local`. Não foi usado `git reset`, `git clean` ou instalação no checkout.
O isolamento é de arquivos, dependências, build, processo e perfis, na mesma
máquina Windows e com cache npm compartilhado; não é outro computador/container.

O snapshot inicial `stage2-clean` passou lint, TypeScript e build com Next
16.3.0, mas revelou 15 alertas de dependências (1 moderado, 13 altos, 1 crítico).
Esse build foi substituído antes da regressão de produção. No snapshot
`stage2-patched`, o lock final foi instalado novamente com `npm ci`, seguido
de lint, TypeScript e build novo: todos retornaram exit 0. Next final 16.3.8,
Axios 1.20.0 e Orval 8.40.0 resolvido dentro do range existente. Build
`MBHQoC0b17PM3Sgz5Ck2Z`, mocks desabilitados, host público lógico `localhost`.

Atualizações compatíveis foram feitas no snapshot com:

```powershell
npm install --package-lock-only --ignore-scripts --save-exact next@16.3.8 eslint-config-next@16.3.8
npm install --package-lock-only --ignore-scripts axios@^1.20.0
npm update --package-lock-only --ignore-scripts sharp nanoid source-map-js brace-expansion fast-uri js-yaml markdown-it
npm update --package-lock-only --ignore-scripts orval
```

Manifesto e lock revisados foram copiados de volta; `node_modules` pessoal não
foi atualizado. `npm audit --omit=dev --json` final registra **zero** alertas de
produção. `npm audit --json` final registra **cinco altos** na cadeia
`braces → micromatch → fast-glob → @next/eslint-plugin-next → eslint-config-next`.
O advisory de braces ainda não publica versão corrigida; a alternativa sugerida
pelo npm seria downgrade major do eslint-config-next. Não foi aplicado
`npm audit fix --force`, downgrade ou override sem compatibilidade demonstrada.
Isto é dívida das ferramentas de desenvolvimento, não auditoria global zerada.

Fontes consultadas: [Next/Windows](https://github.com/advisories/GHSA-p293-qw3h-jr36),
[Next/og](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j),
[Axios](https://github.com/advisories/GHSA-vh66-26gq-q6x8),
[sharp](https://github.com/advisories/GHSA-wq5f-xc86-pv6w) e
[braces sem versão corrigida](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

Comandos executados no snapshot final, a partir de `frontend`:

```powershell
npm ci --no-audit
# Em ../validation/tools: npm ci --no-audit
npm run lint
npm run typecheck
$env:BARBERHUB_PUBLIC_HOST='localhost'
$env:NEXT_PUBLIC_API_MOCKING='disabled'
npm run build
# Processo próprio oculto, Next start --hostname 127.0.0.1 --port 3240
$env:TEST_SERVER='prepared'
$env:TEST_ENV='production'
$env:TEST_PORT='3240'
$env:TEST_PUBLIC_HOST='localhost'
$env:TEST_BROWSER='chromium'
$env:PLAYWRIGHT_CHANNEL='msedge'
npm run test:qa:production
```

`2026-10-07T00-19-25.011Z-production-hRFeqR`: **19/19 suítes PASS**,
incluindo regras, redirects/retorno e domínios, HTTP de todas as demonstrações,
superadmin/cadastro, 70 grupos de jornadas, 110 auditorias axe, 15 grupos
de PWA e quatro de lifecycle. Sem falhas de axe fora da exceção pública.
Verificados manifesto/ícones/escopo, exclusão de tenant/IP/host arbitrário,
cache restrito ao fallback e ícone, ausência de sessão/dados/fila/replay,
primeiro acesso offline, recuperação, RSC/API/POST sem fallback, atualização
waiting sem perder rascunho e preservação de outro worker.

Navegação/domínios usam Host e HTTPS lógico simulados sobre HTTP loopback;
isso não testa TLS/DNS reais. A PWA usa separadamente origem real
`http://localhost:3240`, perfil temporário e service worker real.

Instalação adicional por CDP (`PWA_HEADLESS=true`, `PLAYWRIGHT_MODULE` apontando
para as ferramentas do snapshot, `node ../validation/pwa-install.cjs 3240`):

- Edge: critérios sem erros, instalação e desinstalação bem-sucedidas; abertura
  excedeu o timeout. Janela standalone não validada nesse navegador nesta rodada.
- Chrome: instalação, abertura real em `/barbearias`, modo standalone, ausência
  de painel de instalação, cookie vazio e `localStorage` vazio, desinstalação PASS.
- Preferência standalone foi definida por CDP pelo QA; não é instalação manual
  humana nem prova do comportamento padrão de todos os navegadores.
- JSON bruto do Chrome mantém o rótulo antigo “Edge” no campo `method` do script;
  canal, comando e versão real identificam Chrome. O resumo corrige essa
  identificação sem modificar a evidência bruta.

### Etapa 3 — GitHub Actions

Workflow: `.github/workflows/frontend.yml`. Executa em push, pull request dos
arquivos relevantes ou disparo manual. Usa `ubuntu-24.04`, Node 24.21.0,
permissão somente de leitura e actions oficiais fixadas em SHA (checkout
7.0.1, setup-node 6.4.0, upload-artifact 7.0.1), conferidos pelos tags remotos.

O job principal executa `npm ci`, lint, TypeScript, `test:rules` e build.
`test:rules` reutiliza dez suítes existentes de routing/regras/estado, incluindo
os testes de falha do executor; não precisa de servidor Next, navegador ou API.
A lista é compartilhada com o agregador de regressão para evitar divergência.

**Testes de navegador incluídos:** a infraestrutura existente já oferece locks
separados, agregador portátil, saídas por execução e isolamento de servidor.
O segundo job depende das verificações, instala ferramentas e Chromium via
`npx playwright install --with-deps chromium`, usa `PLAYWRIGHT_CHANNEL=chromium`
(navegador completo em new headless), executa `test:qa:browser` em
desenvolvimento, gera novo build e executa `test:qa:production`, incluindo PWA.
Guarda evidências com `if: always()` por 14 dias. O executor passa a ouvir
explicitamente em `127.0.0.1`; o hostname público e as regras não mudam.

Instalação nativa via CDP fica fora do gate: tem limitações de navegador/OS
observadas. Firefox/WebKit, leitor de tela, aparelhos e publicação também não
estão cobertos pelo job Chromium. Alertas `incomplete` e contraste excetuado
continuam presentes nos artefatos, não são declaração de conformidade.

Validação local: `actionlint` 1.7.12 (download com SHA256 conferido) retornou
exit 0 para o workflow. Lint, TypeScript e as dez suítes de `test:rules`
retornaram exit 0 no snapshot com o executor final. Os resultados adicionais
de navegador estão no resumo versionado e nos relatórios datados.

A primeira execução adicional com Chromium gerenciado
`2026-10-07T00-32-11.271Z-production-fsVuvm` foi **FAIL**: reset de conexão ao
buscar CSS pelo transporte de QA e exigência indevida de `:focus-visible` após
foco programático em modalidade de mouse na PWA. O teste passou a usar
Shift+Tab/Tab reais antes de exigir o indicador. O transporte registra erros
controladamente e permite uma repetição apenas de ECONNRESET em GET/HEAD,
conforme a API Playwright; status HTTP e ações não são repetidos. Falha após
essa tentativa continua reprovando a execução. Nenhum código da PWA foi alterado.
O resultado inicial é preservado, junto das reexecuções, não convertido em PASS.

O headless shell padrão apresentou também falhas de sincronização após
navegação/recarga e não aplicou a preferência nativa de zoom: DPR observado 1,
quando o teste exige 2. A configuração de CI usa explicitamente Chromium
completo, pois a suíte exercita funcionalidades do navegador além de layout.
Essa escolha não equivale a comprovar funcionamento no headless shell.

Na retomada, foram ajustados auxiliares de QA para aguardar os recursos de
navegação/recarga e mudanças de URL antes de interagir com a página preparada.
Isso cobre também o contexto touch separado. Não certifica interação durante
hidratação incompleta ou com rede muito lenta. Um conflito de nome introduzido
no auxiliar do teste superadmin foi corrigido usando `loadPage`, preservando
seu `navigate` de navegação interna; os dois recortes de superadmin passaram
novamente (25 e 20 verificações em produção).

O diagnóstico da PWA mostrou que `context.setOffline(true)` no Chromium 145
entregava fallback inicialmente, mas permitia fetch do worker após reload:
o catálogo SSR voltava apesar da emulação. O QA passou a bloquear também a
rede das requisições do worker, registrando URL/método/origem do pedido.
Os diagnósticos `diagnose-pwa-retry*.cjs/.txt` mostram a diferença. Worker e
CacheStorage continuam reais; o teste não injeta HTML offline nem modifica a
PWA. Falhas agora guardam URL, texto e captura. Um recorte compartilhando o
servidor de outra execução encontrou fallback após esse servidor encerrar
(04:31:18 UTC; falha registrada às 04:32:25); não foi contado como PASS.

Tentativas intermediárias e recortes permanecem distintos. O executor final
inclui fontes, assets públicos, scripts de validação e locks no fingerprint;
se mudarem durante a execução, retorna FAIL. Assim, rodadas durante correções
não certificam o snapshot final, mesmo quando camadas individuais passam.
O resultado final usa uma rodada estável separada.

#### Reexecução estável do executor final

Desenvolvimento `2026-10-07T04-38-12.509Z-browser-RiArvP`, porta 3251,
passou as seis suítes (04:38:12–04:53:58 UTC): headers 160, perfil/ajuda 38,
zoom 11, superadmin 27, cadastro manual 20 e jornadas 75 grupos. Foram
122 auditorias, 101 ocorrências excetuadas de contraste público, 169 entradas
inconclusivas e 482 nós com evidência DOM; zero falhas fora da exceção e zero
erros JavaScript. As entradas inconclusivas continuam exigindo revisão humana.
Servidor encerrado e fingerprints de início/fim iguais ao registrado abaixo.

Na produção, `2026-10-07T04-38-23.289Z-production-xduB3P`, porta 3252,
passou as 19 suítes em Chromium 145.0.7632.6 completo. Início 04:38:23 UTC,
fim 04:49:06 UTC; servidor próprio encerrado pelo executor. Fingerprints de
início/fim iguais:
`0f7e1f56fe9554d8047e0d06afd5da16097a85506541eef615b9114b3bf522f7`.
Comparação adicional com o checkout encontrou apenas três comentários de
cabeçalho gerados pelo Orval: o build com 8.40.0 remove a menção `v8.23.0`.
Conteúdo executável, tipos e contratos são iguais; esses arquivos originais
foram preservados. O fingerprint do checkout é, portanto, diferente do snapshot,
sem ser apresentado como igualdade byte a byte. A comparação e os hashes estão
em `source-verification.json` nas evidências.
As jornadas passaram 70 grupos/110 auditorias, com 90 ocorrências excetuadas,
160 entradas inconclusivas e 473 nós registrados; sem falhas fora da exceção
ou erros JavaScript. PWA passou 15 grupos e lifecycle quatro. Foi usado o build novo da etapa 2,
`MBHQoC0b17PM3Sgz5Ck2Z`, sem alterações posteriores nas fontes da aplicação.

Comandos adicionais executados em Windows, no snapshot `stage2-patched`
(cada comando npm abaixo a partir de `frontend`):

```powershell
# Instalação do navegador, executada em validation/tools.
$qaTaskRoot=Join-Path $env:LOCALAPPDATA 'Temp/barberhub-final-d2c675ca6bfc46f09f375b92240fdec5'
$env:PLAYWRIGHT_BROWSERS_PATH=Join-Path $qaTaskRoot 'playwright-browsers'
npx playwright install chromium

# Os comandos npm seguintes foram executados em stage2-patched/frontend.
$env:TEST_SERVER='isolated'
$env:TEST_PUBLIC_HOST='localhost'
$env:TEST_BROWSER='chromium'
$env:PLAYWRIGHT_CHANNEL='chromium'
$env:NEXT_PUBLIC_API_MOCKING='disabled'
$env:NEXT_TELEMETRY_DISABLED='1'
$env:TEST_OUTPUT='../validation/qa-runs'
$env:TEST_ENV='development'
$env:TEST_PORT='3251'
npm run test:qa:browser
$env:TEST_ENV='production'
$env:TEST_PORT='3252'
npm run test:qa:production
```

O workflow usa portas 3210/3211 e instalação `--with-deps` em Ubuntu.
Esse provisionamento Linux não foi executado localmente. Os comandos de
desenvolvimento e produção acima foram lançados em processos separados,
com os mesmos arquivos de QA estáveis; não usam o servidor pessoal.

As rodadas finais acima são as selecionadas como comprovação local do executor.
O índice `intermediate-run-index.json` preserva os resultados das demais:
rodadas em 3247–3250 foram invalidadas por alterações de ferramentas durante
a execução; 3247 também falhou pelo conflito de nome corrigido e 3248/3250
pelo contexto touch ainda sem aguardar preparação. O PASS bruto de 3245
precede o guard de alteração de fontes e não certifica o executor final.
Recortes aprovados não transformam os agregados FAIL em PASS.

**Workflow não executado no GitHub; Ubuntu, provisionamento apt, cache,
upload e comportamento remoto permanecem sem validação real.**

Referências: [CI do Playwright](https://playwright.dev/docs/ci-intro),
[limite de repetição do transporte](https://playwright.dev/docs/api/class-route#route-fetch-option-max-retries),
[checkout](https://github.com/actions/checkout/releases/tag/v7.0.1),
[setup-node](https://github.com/actions/setup-node/releases/tag/v6.4.0) e
[upload-artifact](https://github.com/actions/upload-artifact/releases/tag/v7.0.1).

### Pendências efetivas

- Decisão explícita sobre contraste dos botões públicos; manter o visual
  aprovado não significa aprovação WCAG AA.
- Leitor de tela real e revisão humana de anúncios/ordem de leitura, todos os
  estados inconclusivos e uso completo com zoom.
  Narrator existe no Windows, mas não houve sessão operável de UI/áudio para
  executar e conferir seus anúncios; presença do executável não é teste realizado.
- Android/iPhone físicos; Firefox, WebKit/Safari e validação entre engines.
- TLS/DNS/domínio publicado e instalação manual humana. Edge standalone
  apresentou timeout local e requer nova verificação quando disponível.
- Cinco alertas altos das ferramentas de lint, sem correção compatível publicada.
- Primeira execução real do workflow no GitHub; nenhum resultado remoto alegado.
- O ambiente pessoal ainda contém dependências/build anteriores por preservação.
  Para adotar o lock corrigido, será necessário `npm ci` e reinício posterior
  desse ambiente, em momento escolhido pelo usuário. Não foi reiniciado nesta rodada.

Não há autenticação, autorização, integração, disponibilidade ou persistência
real certificada por estes testes. As limitações históricas permanecem válidas
quando não foram expressamente reexecutadas aqui.

<a id="acompanhamento"></a>

## Acompanhamento — 2026-10-07

**Registro posterior:** [FRONTEND_PENDING_REVIEW.md](VALIDATION_HISTORY.md#revisao-final)
documenta as novas correções de foco, revisão dos inconclusivos, nova produção
local 19/19 e abertura standalone real no Edge. As tentativas e limitações
descritas abaixo são o estado histórico deste acompanhamento.

Complementa o [registro inicial](VALIDATION_HISTORY.md#consolidacao-inicial), sem substituir
seus resultados históricos. O usuário solicitou adoção do lock, execução real
do CI, decisão visual de contraste e correção documental. A disponibilidade
informada continua sendo somente o ambiente local.

| Etapa solicitada | Estado final deste acompanhamento |
| --- | --- |
| 1. QA e acessibilidade | Complemento local PASS, incluindo contraste aprovado e Firefox; verificações humanas/externas abaixo permanecem pendentes. |
| 2. Instalação/build/produção | PASS em ambiente isolado, 19 suítes; ambiente pessoal adotou o lock e foi reiniciado. |
| 3. GitHub Actions | PASS real no Ubuntu no commit final de código, dois jobs, Chromium e upload confirmados. |

### Ambiente pessoal

`npm ci --no-audit`, em `frontend`, instalou 476 pacotes em 50 segundos,
com exit 0. Next instalado passou de 16.3.0 para 16.3.8 e Axios de 1.19.0
para 1.20.0. O SHA256 do lock permaneceu igual; arquivos de ambiente foram
conferidos por hash e preservados. npm registrou aviso de três scripts de
instalação não cobertos por `allowScripts`; não houve aprovação global desses
scripts nem alteração da configuração pessoal do npm.

Foi encerrada apenas a árvore Next do projeto, identificada por caminho e
parentesco: launcher PID 15348, servidor PID 15056. O npm/terminal pai não
foi encerrado por nome. O novo launcher PID 19864 iniciou:

```powershell
node node_modules/next/dist/bin/next dev --port 3000
```

Processo em segundo plano com janela oculta e logs próprios. Servidor PID
14488, catálogo `http://localhost:3000/barbearias` respondeu 200; pronto em
9,4 segundos. Foi usada a CLI Next diretamente, sem refazer a geração da API
no checkout pessoal. O código e os tipos existentes continuam compatíveis
com o OpenAPI vazio. O build novo deste acompanhamento ocorreu em worktree
próprio, não substituiu o build de produção pessoal.

Lint, TypeScript e `npm run test:rules` passaram, com dez suítes e zero falhas.
Evidências novas em
`validation/qa-runs/environment-followup-2026-10-07-5aa60d89/`, incluindo
`environment-update.json`, logs do servidor, comandos e auditorias.

### Contraste aprovado

Resposta explícita do usuário: **manter sky-500 e usar texto escuro**.
Aplicado `#07111C` da paleta existente no `catalogActionClass`, nos três CTAs
da landing e no botão do fallback offline. Tipografia, tamanho, espaçamento,
superfícies, hover sem alteração de azul, foco e movimento reduzido foram
preservados. AGENTS.md, guia visual e sistema de interface registram a decisão.

A exceção automática de contraste foi removida de `qa-journeys.mjs`.
Auditorias futuras reprovam quaisquer violações, inclusive se o padrão branco
for reintroduzido. Os resultados brutos anteriores com exceções continuam
históricos; não foram convertidos em conformidade.

O cache PWA passou de v1 para v2 para distribuir o novo HTML offline.
Instalação/ativação mantêm espera por fechamento das abas, sem `skipWaiting`,
`claim`, recarga forçada, novo armazenamento privado ou alteração de escopo.
Testes cobrem limpeza de v0/v1 e preservação dos caches externos; lifecycle
continua exercitando o upgrade v1 → v2. O fallback recebe auditoria axe real,
com inconclusivos preservados e sem exceção de contraste.

A revisão adicional de cores inicialmente interpretou a representação CSS
`lab()` como RGB. O auxiliar foi corrigido para conversão sRGB por canvas;
essa falha de QA foi preservada separadamente, sem alterar a interface para
atender um cálculo incorreto. Resultados finais estão nos relatórios datados.

A revisão final em Edge 154.0.4258.53 passou em landing, catálogo, perfil,
introdução do agendamento, login e fallback offline: zero violações axe, sem
exceções; contraste calculado em sRGB de 7,017:1 nos botões Tailwind e 6,851:1
no fallback. Hover conserva o fundo; foco de teclado foi verificado. Capturas
mobile/desktop e inconclusivos estão em `contrast-review.json` e PNGs próprios.
Uma tentativa também selecionou controle desktop oculto no mobile; foi
corrigida para interagir com controle visível e preservada como falha do auxiliar.

### CI e ambiente de regressão

Worktree isolado na branch `codex/frontend-ci-validation`, originado do HEAD
`ee0fddfa13102b851c98d851bdb7e4296f8ddf28`, inclui o conjunto revisado.
Checkout pessoal permanece na branch `frontend/finalpatches`, sem reset ou
commit das alterações do usuário. A publicação de uma branch específica
permite o evento push, sem merge na main ou publicação do site.

Instalação própria passou e novo build Next 16.3.8 passou: build ID
`qpcxCJBsy4pcswj10HwdN`. Chromium completo verifica produção na porta 3253;
Firefox gerenciado 146.0.1 foi instalado em cache temporário próprio para
exercitar outra engine em desenvolvimento na porta 3254. Não representa
Firefox de dispositivo físico nem Safari/WebKit. A execução no GitHub será
registrada pelo run/commit efetivos, sem inferir sucesso pelo resultado local.

Produção local `2026-10-07T05-16-55.963Z-production-gWr7rj`: **19/19 suítes
PASS**, 70 grupos de jornadas, 110 auditorias, **zero violações e zero exceções**,
160 entradas inconclusivas e 473 nós registrados. PWA passou 15 grupos e
lifecycle quatro, incluindo o novo cache/fallback. Fingerprints de início/fim
iguais: `4efcf84d6ec161f26078a089a706ff250d0522afb75ef38121c8b2770bb2036b`.

No Firefox, navegações de QA concorrentes após clique foram sincronizadas;
o contexto touch omite `isMobile`, opção não suportada nessa engine. Os headers
passaram 160 verificações no recorte corrigido. Zoom nativo por CDP não roda
no Firefox, e os cinco grupos do agregador não incluem essa camada.

O probe de Tab mostrou que Firefox headless mantém `activeElement` no último
controle quando Tab sai do documento; isso não comprova um trap do produto.
O QA agora aceita esse limite apenas se todos os controles visíveis/ativos
foram visitados e Shift+Tab retorna a outro controle. O recorte de login passou
com cinco controles e retorno confirmado. Ferramentas Next ficam temporariamente
inert durante o percurso e são restauradas: não são parte do produto auditado.
Esse contexto é registrado, sem certificar o teclado da interface do navegador
ou das ferramentas Next. Rodadas anteriores reprovadas continuam como FAIL.

Rodada Firefox final `2026-10-07T05-35-25.940Z-browser-aVoVqD`: **5/5 PASS**,
75 grupos, 122 auditorias, zero violações/exceções, 169 entradas inconclusivas
e 483 nós registrados. Tab/foco percorreu 23 rotas. Fingerprints início/fim
iguais: `4b62ed719af96c5f94ba2c960053daab9b23805214152b989f9fb6c0cf0cd0f9`.
Os nós inconclusivos se dividem em 98 de `aria-valid-attr-value` e 385 de
`color-contrast`; HTML, referências ARIA, cores computadas, visibilidade e
oclusão foram registrados para revisão, sem convertê-los em aprovação humana.
Executada no servidor pessoal já atualizado, porta 3000, `TEST_SERVER=prepared`;
o agregador não iniciou nem encerrou esse servidor. As duas rodadas amplas
anteriores com falhas do harness e o recorte que usou `isMobile` permanecem
reprovados no histórico. O ajuste final foi publicado no commit
`2d98b37efe7d185c03f0091c79f9e5b9e4c4fa9f`; a execução
[37577800497](https://github.com/T-J-Labs/barberhub/actions/runs/37577800497)
verificou esse último commit de código e terminou success.

Comandos principais desta rodada (em `frontend`, variáveis por processo,
cache de navegadores e `TEST_OUTPUT` em diretórios próprios):

```powershell
npm ci --no-audit
npm run lint
npm run typecheck
npm run test:rules
npm run build
# Produção isolada: TEST_SERVER=isolated, TEST_ENV=production,
# TEST_PORT=3253, TEST_BROWSER=chromium, PLAYWRIGHT_CHANNEL=chromium
npm run test:qa:production
# Firefox: TEST_SERVER=prepared, TEST_ENV=development,
# TEST_PORT=3000, TEST_BROWSER=firefox
npm run test:qa:browser
npm audit --omit=dev --json
npm audit --json
```

Ferramentas isoladas, em `validation/tools`: `npm ci --no-audit` e
`npx playwright install firefox` localmente; GitHub executa
`npx playwright install --with-deps chromium` no Ubuntu. Não copiar
`TEST_SERVER=prepared` para CI: ambos os servidores do workflow são próprios.
Resumo portável: `validation/frontend-followup-summary.json`; o resumo inicial
foi marcado histórico e aponta para ele, preservando resultados anteriores.

Lint foi reexecutado após o ajuste final de teclado e retornou exit 0.

Conferência de 286 arquivos entre checkout pessoal e branch publicada:
conteúdo executável/contratos iguais; apenas três comentários de versão do
gerador Orval diferem, preservados no checkout pessoal. Os arquivos de API
gerados no build isolado não foram incluídos nos commits. Registro em
`source-equivalence.json`. `final-preservation.json` confirma HEAD/branch
pessoais preservados, lock/ambiente com hashes iguais e nenhuma das portas
temporárias 3253/3254/3255/3256 em escuta. Servidor pessoal atualizado permanece
ativo na porta 3000; backend, banco, OpenAPI e domínios não foram alterados.

Primeira execução real:
[37576432180](https://github.com/T-J-Labs/barberhub/actions/runs/37576432180),
commit `3ccbc97a6836f861c8aab282616a79d49aa5a1dd`, evento push na branch própria.
Os dois jobs terminaram **success** no Ubuntu 24.04: instalação limpa,
lint/TypeScript/regras/build, instalação do Chromium com dependências,
desenvolvimento, novo build e produção/PWA. O upload também terminou success;
API do GitHub confirma artefato `frontend-qa-37576432180-1`, 196.332.685 bytes,
não expirado, retenção configurada de 14 dias. Metadados de run, jobs/steps e
artefatos estão no diretório `github/37576432180` das evidências. O download
autenticado dos logs/artefatos não foi realizado; a confirmação de publicação
vem do step e do inventário real do GitHub, não da validação local.

Execução final do código:
[37577800497](https://github.com/T-J-Labs/barberhub/actions/runs/37577800497),
commit `2d98b37efe7d185c03f0091c79f9e5b9e4c4fa9f`: **success** nos dois jobs.
Instalações, lint, TypeScript, regras, ambos os builds, instalação Chromium,
QA de desenvolvimento, regressão de produção/PWA e upload concluíram success.
Artefato `frontend-qa-37577800497-1`, 211.454.224 bytes, não expirado,
com expiração registrada para 2026-10-21. Metadados integrais preservados em
`github/37577800497`; não foram baixados os logs/artefatos autenticados.
Esta é a prova remota selecionada para o último código publicado. Documentação
e metadados finais no checkout pessoal registram o resultado após a execução;
não implicam merge, deploy, execução na main ou validação humana.

Worktree temporário arquivado pelo Codex após as verificações, com snapshot
recuperável; a lista de artefatos confirma `archived_worktree` e o diretório
original foi removido. A branch remota permanece publicada para revisão.
Logs/relatórios usados nesta documentação estão no checkout pessoal, fora do
worktree arquivado; build e node_modules isolados não foram preservados no
snapshot, pois são reproduzíveis pelos comandos registrados. Conferência final:
catálogo pessoal retorna 200, Next 16.3.8 e Axios 1.20.0 permanecem instalados.

### Dependências e documentação

Novas auditorias do ambiente atualizado: `npm audit --omit=dev --json` retorna
exit 0 e zero alertas; `npm audit --json` retorna exit 1 e cinco altos na cadeia
`braces → micromatch → fast-glob → @next/eslint-plugin-next → eslint-config-next`.
O [advisory de braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
continua sem versão corrigida publicada na consulta desta rodada.
Não aplicado downgrade major, override ou `audit fix --force`.

A seção 10.3 do roadmap foi corrigida: `.github/workflows/frontend.yml`
existe e cobre lint, TypeScript, regras, build e navegador/PWA; a primeira
execução remota passou conforme registro acima. Acompanhar atualizações publicadas e testar
a cadeia completa antes de alterar o lock. Não foi criada automação recorrente.

Leitor de tela e anúncios reais, revisão humana integral dos inconclusivos,
Android/iPhone físicos, Safari/WebKit, DNS/TLS publicado e instalação manual
humana continuam sem ambiente disponibilizado. Não se declara WCAG integral.
Instalação nativa do Edge foi registrada como nova tentativa independente.

Nova tentativa Edge em produção própria na porta 3255: versão 154.0.4258.53,
perfil temporário, headless/CDP. Critérios de instalação passaram, app instalado
e desinstalado; `PWA.launch` voltou a exceder o timeout. Janela standalone no
Edge permanece **não validada**, sem transformar exit 0 do coletor de limitações
em PASS de instalação. Servidor dessa tentativa foi encerrado pelo PID próprio.

<a id="revisao-final"></a>

## Revisão final — 2026-10-07

Continuação autorizada pelo usuário. Este registro complementa
[FRONTEND_FOLLOWUP.md](VALIDATION_HISTORY.md#acompanhamento); os resultados anteriores permanecem
históricos. Ambiente disponível: somente Windows local, Node 24.21.0,
Playwright 1.58.2, Edge 154.0.4258.62, Firefox gerenciado 146.0.1 e WebKit
gerenciado 26.0/build 2248. WebKit no Windows não é Safari nem um iPhone físico.

Evidências brutas em `validation/qa-runs/pending-resolution-2026-10-07/`.
Worktree próprio `codex/frontend-pending-resolution`, derivado do commit
`2d98b37efe7d185c03f0091c79f9e5b9e4c4fa9f`. Instalações limpas da aplicação
e de `validation/tools` passaram nesse checkout. Servidores de QA usam portas
próprias; o servidor pessoal na porta 3000 já estava desligado nesta retomada.
Nenhuma alteração em backend, banco, contratos, domínio ou regra de produto.

### 1. QA e acessibilidade

WebKit revelou uma falha de foco: seu Tab nativo pulava links do menu e podia
sair do diálogo. `MobileDrawer` agora percorre explicitamente os controles
visíveis. `DemoDialog` inclui os links no percurso e preserva a tabulação nativa
dos segmentos de data/hora. Modal nativo, fundo inerte, Escape, retorno ao gatilho,
destinos e aparência são preservados. As falhas originais estão registradas;
não são convertidas retroativamente em PASS.

Uma comparação textual do onboarding dependia de quebras de linha de
`innerText`. O diagnóstico em desenvolvimento confirmou uma quebra final
presente antes e ausente depois, além do aviso esperado de independência.
O conteúdo da amostra não mudou. A verificação normaliza espaços e confere
também valores, IDs e estado dos campos, sem mudar a feature.

O percurso das rotas estáticas também começa explicitamente no documento,
para não herdar o cursor sequencial de Tab da rota anterior no Firefox.
A tabulação continua nativa e a verificação do limite do documento exige
todos os controles visitados e retorno por Shift+Tab. O agregador passou a
registrar `timedOut`; mantém dez minutos por suíte Chromium/Firefox e vinte
para WebKit, cuja primeira repetição excedeu dez minutos no Windows.
Esse agregado permanece **FAIL**, com seus quatro primeiros grupos de suítes
aprovados e a jornada interrompida; a comparação textual também falhou antes
de aplicar `trim()`. A primeira repetição Firefox teve 69/70 grupos aprovados,
com falha no percurso de Ajuda admin; uma sondagem isolada confirmou todos os
controles alcançáveis e o retorno nativo. Esses resultados permanecem separados
das novas repetições, sem eliminar as evidências de falha.

A repetição Firefox confirmou que reiniciar o cursor não resolvia a causa.
Na sondagem móvel, os controles tinham sido visitados, mas a hidratação inseriu
um nó e deslocou seus índices no DOM. O coletor agora usa um Map por elemento,
mantém `documentIndex` apenas para diagnóstico e exige retorno a um controle
registrado por Shift+Tab. Não reduziu a lista de controles nem suprimiu a falha.

Resultados posteriores:

| Verificação local | Resultado observado |
| --- | --- |
| Headers WebKit / Firefox, desenvolvimento | 160 verificações em cada engine, sem falhas |
| Perfil/ajuda, superadmin e cadastro WebKit | Três suítes PASS após a correção de foco |
| Jornadas WebKit, desenvolvimento | 75/75 grupos, 122 auditorias, zero violações/exceções e erros JavaScript |
| Jornadas Firefox, produção local, coletor final | 70/70 grupos, 110 auditorias, zero violações/exceções e erros JavaScript |
| Teclado do coletor final, WebKit e Firefox, produção local 390×844 | 23/23 rotas em cada engine; fingerprints iguais no início/fim |

As 75 jornadas WebKit usaram o coletor anterior à troca de índices por
identidade; as 23 rotas afetadas foram repetidas no coletor final, commit
`97cee8d917084d255f4d8112cbf9b876c41c2978`. Não se afirma novo agregado WebKit
5/5: os quatro primeiros passaram no agregado e a jornada passou na repetição
direta. Diretórios `webkit-journeys-retry`, `firefox-journeys-stable-identities`,
`webkit-native-routes` e `firefox-native-routes` preservam essas evidências.

No WebKit gerenciado, Tab padrão exclui links de algumas páginas estáticas:
os relatórios registram apenas os controles efetivamente alcançados. O drawer
inclui explicitamente seus links no percurso. Isso não certifica teclado no
Safari real; não foram alteradas preferências do Windows ou do navegador pessoal.

Revisão técnica de **483 nós inconclusivos** em 122 auditorias anteriores do
Firefox (`axe-technical-review.json`):

- 98 referências `aria-controls` apontam para diálogos nativos existentes,
  fechados. O alvo não precisa estar aberto para a referência ser válida.
  Abertura, modalidade e foco são exercitados nas jornadas.
- 384 nós têm contraste calculado suficiente nas cores registradas.
  Cores CSS Lab foram convertidas por canvas para sRGB, com composição de alfa;
  números Lab não foram tratados como valores RGB. Título e descrição do diálogo,
  marcadores de FAQ, setas e checklist foram inspecionados em estados reais,
  com capturas dos sete casos e inspeção das pinturas dos ancestrais.
- Um nó permanece em **2,7059:1**: número branco “1” da seção “Como funciona”,
  sobre `sky-500`. O usuário escolheu **manter o visual e registrar a pendência**.
  Não é botão; os botões públicos preservam `#07111C` aprovado anteriormente.
  `aria-hidden` não foi usado para declarar o contraste conforme.

As entradas `incomplete` originais continuam nos relatórios. Revisão técnica
e inspeção visual por agente não equivalem a revisão humana integral nem a
declaração de WCAG integral.

As novas evidências também foram revisadas: WebKit, 482 nós (98 referências,
383 cores suficientes e o mesmo indicador baixo); Firefox final, 474 nós
(89 referências, 384 cores suficientes e o mesmo indicador). Relatórios
`axe-review-webkit.json` e `axe-review-firefox-final.json`; nenhuma nova classe
de problema foi encontrada. Capturas/ancestrais dos sete casos estão em
`axe-live-paints.json`; não havia imagem, filtro ou opacidade adicional nesses
casos representativos. Os rótulos condicionais dos relatórios são mantidos,
sem transformar o resultado do axe em aprovação automática.
Produção final Edge: 473 nós (89 referências, 383 cores suficientes e o mesmo
indicador); relatório `axe-review-production-final.json`.

Leitor de tela: a tentativa anterior com Narrador não permitiu verificar
anúncios, pois sua janela tinha integridade superior à do helper. Nesta retomada,
a revisão automática de aprovação rejeitou o comando de download e execução
do NVDA 2026.2 portátil, com motivo literal `blocked by policy`. Download e
execução não ocorreram. Não houve elevação nem mudança de segurança do Windows.
O [guia oficial do NVDA](https://download.nvaccess.org/releases/2026.2/documentation/userGuide.html)
foi consultado; isso não conta como teste de leitor de tela.

Android/iPhone físicos, Safari real, revisão por pessoa usuária de leitor de
tela e instalação manual humana continuam não executados. O usuário informou
que não disponibiliza aparelhos nem URL publicada nesta rodada.

### 2. Instalação e produção local

Após `npm ci --no-audit` nos dois pacotes, novo `npm run build` passou com
Next 16.3.8; build ID `NND6kNeSpwzvKCNhBcqCk`. `npm run lint` e
`npm run typecheck` passaram. Regressão do build: **19/19 suítes PASS** no Edge,
porta própria 3262, fingerprint de fontes igual no início/fim.
Transporte loopback com Host/HTTPS lógico não certifica DNS ou TLS publicado.

PWA Edge: **PASS de abertura standalone real**, em janela com interface,
perfil temporário próprio e build final na porta 3261. Critérios de instalação
sem erros, catálogo como início, `display-mode: standalone` real, nenhum painel
de instalação residual, cookie vazio e nenhum `localStorage`. App instalado
e desinstalado; perfil fechado. Relatório `edge-headed-final/install-results.json`.
A preferência standalone foi definida por CDP, sem emulação do display-mode.
Não se afirma instalação manual feita por uma pessoa.

O resultado 19/19 foi obtido depois das correções do produto e antes dos últimos
ajustes de normalização/início de foco do coletor. Esses ajustes só alteram QA;
o conteúdo executável do build permanece o mesmo. Não se apresenta esse resultado
como execução local do coletor posterior; a revisão posterior é identificada
por commit e por seus próprios relatórios.

**Repetição final com o coletor corrigido:** `production-stable-identities/
2026-10-07T15-20-43.112Z-production-HbV0z2`, commit
`97cee8d917084d255f4d8112cbf9b876c41c2978`: **19/19 PASS**, 70 grupos de jornadas,
110 auditorias, nenhum erro JavaScript e nenhum timeout. Fingerprints inicial
e final `37dc5b11d2fce6d1725601a0e6132ca78c556660f917636e58670bf8e9d4421c`
iguais. O servidor isolado foi encerrado pelo próprio agregador. Esse é o
resultado local selecionado para a revisão final, sem reutilizar o PASS anterior.

Comandos (PowerShell, executados no worktree próprio):

```powershell
cd frontend
npm ci --no-audit
cd ../validation/tools
npm ci --no-audit
cd ../../frontend
$env:BARBERHUB_PUBLIC_HOST='localhost'
$env:NEXT_PUBLIC_API_MOCKING='disabled'
$env:NEXT_TELEMETRY_DISABLED='1'
npm run lint
npm run typecheck
npm run build
$env:TEST_SERVER='isolated'
$env:TEST_ENV='production'
$env:TEST_PORT='3262'
$env:TEST_BROWSER='chromium'
$env:PLAYWRIGHT_CHANNEL='msedge'
$env:TEST_OUTPUT='<diretório absoluto de evidências da execução>'
npm run test:qa:production
```

WebKit foi instalado no cache temporário próprio, por `npx playwright install
webkit` em `validation/tools`, com `PLAYWRIGHT_BROWSERS_PATH` apontando para
esse cache. Primeira rodada ampla:

```powershell
$env:TEST_SERVER='isolated'
$env:TEST_ENV='development'
$env:TEST_PORT='3263'
$env:TEST_BROWSER='webkit'
Remove-Item Env:PLAYWRIGHT_CHANNEL -ErrorAction SilentlyContinue
$env:PLAYWRIGHT_BROWSERS_PATH='<cache temporário próprio de WebKit>'
$env:TEST_OUTPUT='<diretório absoluto próprio>/webkit-final'
npm run test:qa:browser
```

Jornadas repetidas depois dos ajustes do coletor, em servidores próprios
preparados (saída criada explicitamente antes do comando):

```powershell
$env:TEST_ENV='development'
$env:TEST_PORT='3263'
$env:TEST_BROWSER='webkit'
$env:QA_SUITE_OUTPUT='<diretório absoluto próprio>/webkit-journeys-retry'
New-Item -ItemType Directory -Path $env:QA_SUITE_OUTPUT -Force | Out-Null
node tests/qa-journeys.mjs
# Firefox: TEST_ENV=production, TEST_PORT=3261, TEST_BROWSER=firefox;
# cache próprio do Firefox e saída distinta firefox-journeys-retry.
```

Firefox também passou **160 verificações de headers** em desenvolvimento na
porta 3263, com `node ../validation/headers-browser.cjs 3263` e saída distinta
`firefox-headers`. O WebKit passou as mesmas 160 verificações no agregado,
mais perfil/ajuda, superadmin e cadastro. Zoom nativo 200% é Chromium/CDP;
não foi contabilizado como testado no Firefox ou WebKit.

Uma tentativa direta anterior do Firefox parou por falta do diretório de saída;
isso foi corrigido no comando, sem mudança do produto. Duas sondagens auxiliares
foram corrigidas por seletores ambíguos/estado de origem; não contam como PASS de QA.

Instalação adicional, com servidor próprio de produção já preparado na 3261:

```powershell
cd ..
$env:PWA_HEADLESS='false'
$env:PWA_REQUIRE_SUCCESS='true'
$env:PLAYWRIGHT_CHANNEL='msedge'
$env:PLAYWRIGHT_MODULE='./tools/node_modules/playwright'
$env:QA_SUITE_OUTPUT='<diretório absoluto próprio>/edge-headed-final'
node validation/pwa-install.cjs 3261
```

O coletor respeita `QA_SUITE_OUTPUT`; com `PWA_REQUIRE_SUCCESS=true`, limitações
de instalação retornam falha. Assim, exit 0 do coletor legado não é usado como
evidência de sucesso quando houver timeout.

### 3. CI e dependências

O workflow `.github/workflows/frontend.yml` existe. A implementação anterior
tem execução real bem-sucedida no Ubuntu 24.04:
[37577800497](https://github.com/T-J-Labs/barberhub/actions/runs/37577800497),
commit `2d98b37efe7d185c03f0091c79f9e5b9e4c4fa9f`, dois jobs e artefato publicado.
Isso valida aquela revisão; alterações posteriores precisam de execução própria.
O workflow mantém Chromium completo como gate; Firefox e WebKit locais ampliam
a cobertura, sem alegar execução desses navegadores no GitHub.

**Execução real da revisão final:**
[37642914180](https://github.com/T-J-Labs/barberhub/actions/runs/37642914180),
push na branch própria `codex/frontend-pending-resolution`, commit
`97cee8d917084d255f4d8112cbf9b876c41c2978`: **success nos dois jobs** Ubuntu
24.04. Instalações limpas, lint, TypeScript, dez suítes de regras, builds,
instalação do Chromium com dependências, jornadas de desenvolvimento,
regressão de produção/PWA e upload terminaram success. A resposta individual
do job confirmou todos os steps concluídos; a primeira listagem ainda trazia
o step de upload em progresso e foi preservada separadamente.

Artefato confirmado no inventário real: `frontend-qa-37642914180-1`,
ID `11494405661`, **211.578.187 bytes**, não expirado, com expiração em
2026-10-21T15:32:10Z. Metadados em `github/37642914180`; logs e conteúdo do
artefato autenticado não foram baixados. Publicação foi confirmada pelo step
terminal e pelo inventário, não por inferência da execução local. Não houve
merge, deploy ou execução declarada na branch principal.

Auditorias repetidas: `npm audit --omit=dev --json` retornou exit 0 e zero
alertas; `npm audit --json` retornou exit 1 e **cinco altos** em
`braces → micromatch → fast-glob → @next/eslint-plugin-next → eslint-config-next`.
Não há correção publicada de braces na consulta desta rodada ao
[advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
Um adaptador local de glob foi experimentado somente no checkout isolado e
rejeitado: o lock não reproduzia `npm ci` e a resolução do pacote local falhou
com ENOENT. Manifesto/lock originais foram restaurados, instalação limpa passou
novamente e nenhuma substituição foi aplicada ao checkout pessoal.
Nenhum downgrade, `audit fix --force` ou override ficou no projeto.

### Pendências que continuam dependentes de disponibilidade ou decisão

- Contraste do indicador “1”, mantido por decisão explícita do usuário.
- Anúncios reais de leitor de tela e revisão humana integral dos inconclusivos.
- Android/iPhone físicos, Safari real e instalação manual humana.
- DNS/TLS do endereço publicado, não disponibilizado.
- Cinco alertas altos da cadeia de lint, aguardando correção compatível publicada.

Manter essas limitações não declara os itens conformes nem impede os testes
locais efetivamente disponíveis. Os relatórios FAIL das tentativas e os resultados
PASS posteriores são preservados separadamente.

### Preservação e entrega

As seis fontes alteradas foram copiadas para o checkout pessoal somente após
comparar sua versão anterior com a revisão publicada. Nenhum arquivo pessoal
divergente foi sobrescrito. Conferidos 286 arquivos da aplicação/ferramentas:
conteúdo executável e contratos equivalentes; diferenças restritas a três
comentários do Orval e finais de linha. Arquivos gerados de API no build isolado
não foram copiados nem incluídos nos commits.

`personal-preservation-final.json` confirma HEAD pessoal
`ee0fddfa13102b851c98d851bdb7e4296f8ddf28`, branch `frontend/finalpatches`,
lock e arquivos de ambiente preservados, Next 16.3.8/Axios 1.20.0 instalados,
backend/OpenAPI sem alterações e portas 3261/3262/3263 encerradas. A porta 3000
permanece desligada, conforme o estado encontrado. A branch remota contém as
correções para revisão; a documentação pessoal registra os resultados posteriores.
Resumo em `validation/frontend-pending-review-summary.json`.

O checkout temporário foi arquivado pelo Codex com snapshot recuperável;
`archived_worktree` confirmado na lista de artefatos e diretório removido.
Logs, relatórios e capturas permanecem no checkout pessoal. Build/dependências
isolados não foram preservados, pois podem ser reproduzidos com os comandos
registrados. Commit remoto documental `d3f105ba5e9c6c5ed38aa2301140c09ae8e6974b`
contém somente documentação; o código executável validado no CI permanece o
da revisão `97cee8d917084d255f4d8112cbf9b876c41c2978`. Os metadados do arquivo
do worktree foram registrados depois, no checkout pessoal.
