# Validação do BarberHub

Este diretório reúne executores reutilizáveis e evidências de QA. Não é parte
do bundle da aplicação. Os comandos de entrada ficam no
[package.json do frontend](../frontend/package.json); configuração, preparação
de servidor e limites estão em [QA_ACCESSIBILITY.md](../docs/frontend/QA_ACCESSIBILITY.md).

| Grupo | Responsabilidade |
| --- | --- |
| `*-state.cjs`, `client-auth-routing.cjs`, `pwa-policy.cjs` | Regras e políticas; reutilizados por `npm run test:rules` |
| `*-http.cjs` | Verificação HTTP com servidor explicitamente preparado |
| `*-browser.cjs`, `headers-zoom.cjs`, `pwa-lifecycle.cjs` | Interação, teclado, responsividade, zoom e PWA |
| `qa-{browser,http,navigation,output}.cjs` | Auxiliares compartilhados; não são relatórios duplicados |
| `pwa-install.cjs`, `pwa-performance.cjs`, `pwa-icons.cjs` | Instalação automatizada, diagnóstico de desempenho e geração/inspeção de ícones |
| `headers-visual.cjs` | Comparação dos arquivos históricos de referência; não exige servidor |
| `tools/` | Playwright e axe com manifesto/lock próprios, separados das dependências do produto |
| `qa-runs/` | Saída local ignorada pelo Git, por execução; preservar falhas, capturas e logs |
| `frontend-*-summary.json` e demais JSON/TAP/capturas | Evidências históricas datadas; não são estado atual nem testes executáveis |

[Estado técnico atual](../docs/frontend/TECHNICAL_CLOSURE.md) e
[histórico reunido](../docs/frontend/VALIDATION_HISTORY.md) distinguem automação
local, CI remoto, QA humano e validação publicada. Publicação fica para depois
das integrações com o backend estarem funcionando e validadas localmente.

## Capturas compartilhadas

Na revisão de estrutura de 2026-10-07, foram removidas **68 cópias PNG idênticas
byte a byte**, economizando 4.346.962 bytes. [evidence-aliases.json](evidence-aliases.json)
preserva caminho original, arquivo canônico existente, SHA256 e tamanho de cada
cópia. Quando um caminho antigo de captura não existir, consulte esse mapa.
Nenhum conteúdo visual único foi removido. Os dez arquivos usados como entradas
de `headers-visual.cjs` foram preservados, mesmo quando idênticos.

Relatórios JSON iguais de execuções diferentes foram mantidos para preservar
contexto/proveniência; os relatórios brutos de `qa-runs/` não foram reescritos.
Executores futuros podem gerar novamente caminhos de saída antigos; o mapa
descreve a consolidação desta revisão, não redireciona gravações dos testes.

## Revisão de estrutura — 2026-10-07

Inventariados 746 arquivos do projeto e 10.132 arquivos de evidências locais,
fora de `.git`, dependências e builds. Hashes e análise de referências estão em
`qa-runs/structure-review-2026-10-07/`. Nenhum módulo TypeScript interno sem
referências foi encontrado; entradas Next por convenção foram preservadas.

Removidos: duas features vazias (`public-auth`/`public-booking`), coletor obsoleto
da composição anterior de headers e requisição manual experimental fora do
prefixo `/api/v1`.
Os três relatos sequenciais de consolidação foram reunidos no histórico, sem
perder seus resultados. API-First foi condensado no [guia do contrato](../docs/api/README.md).

Mantidos: configurações Postman/IDE/agentes, wrappers Maven de ambos os sistemas,
fontes Java e teste Spring, mocks/cliente gerado OpenAPI, assets públicos, mockups
de design, lockfiles, dependências instaladas e build pessoal. Ausência de import
direto não torna esses arquivos descartáveis. Divergências contratuais do backend
exigem tarefa própria; esta revisão não altera controllers ou integrações.

Conferência final: hashes iguais nos 277 arquivos de fontes/testes/assets,
manifestos/locks e contrato selecionados; 19 fontes Java revisadas sem classes
órfãs identificadas. Links e âncoras locais Markdown conferidos sem falhas.
Lint, TypeScript, dez suítes de regras e comparação visual histórica dos headers
passaram. Não houve novo build ou execução das jornadas de navegador nesta limpeza.
[Resumo da revisão e arquivos removidos](structure-review-summary.json).

O diretório antigo `frontend/.next-qa-cdd979c4-58f3-454e-9a25-7a3b2a27d3a8`
foi identificado como artefato local de QA, mas sua exclusão recursiva foi
rejeitada pela revisão automática de aprovação com motivo `blocked by policy`.
Foi preservado; não se declara esse item removido.
