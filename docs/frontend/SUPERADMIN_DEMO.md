# Superadmin básico — demonstração local

Implementado em 2026-10-06, exclusivamente no frontend, conforme entrega 5 do
[roadmap](FRONTEND_ROADMAP.md). A skill `interface-design` e o sistema existente
em `.interface-design/system.md` orientaram a composição administrativa.
Ampliado por solicitação específica para cadastro manual demonstrativo de
rascunhos na mesma área e no mesmo provider. Veja a seção de cadastro abaixo.

## Diagnóstico e decisões

Antes da implementação, o código possuía somente o layout
`src/app/(private)/super-admin/layout.tsx`, `SuperAdminHeader` e a configuração
`super-admin-navigation.ts`, sem páginas e com todos os destinos desabilitados.
O proxy público não inclui estas rotas. Mantivemos a convenção existente de
caminhos da área privada, sem alterar proxy, domínio de admin ou header.
Grupo privado, subdomínio, identificador e header não concedem permissões.

Reutilizados sem alterar comportamento: `Container`, `NavigationItems`,
`SuperAdminHeader`, `AuthenticatedHeader` e `DemoDialog` (diálogo HTML modal).
Na entrega básica, somente Início e Barbearias receberam destinos. A ampliação
de Ajuda está registrada abaixo; Planos e assinaturas continuam indisponíveis.

A lista é o foco visual: nomes e localização lideram a leitura, com subdomínio
de apoio, estado explícito em texto e link para detalhes. Superfícies privadas,
Geist, bordas discretas e controles de pelo menos 44px preservam o sistema atual.
Não há gráficos, faturamento, planos, avaliações ou dados operacionais de tenants.

## Rotas e arquivos

| Rota | Comportamento |
| --- | --- |
| `/super-admin` | Total, rascunhos, ativas e suspensas calculados da mesma amostra em memória. |
| `/super-admin/barbearias?q=...` | Cadastro manual embutido, lista e busca por nome, cidade ou bairro, indiferente a caixa e acentos. |
| `/super-admin/barbearias/[id]?q=...` | Fixture ou rascunho do provider; motivo manual quando houver, estado demonstrativo e retorno com a busca. |
| `/super-admin/ajuda` | Guia estático de tarefas e FAQ, independente da coleção e dos cenários de QA. |

Busca tem limite de 120 caracteres, como no catálogo existente. Valores repetidos
de `q` usam busca vazia; o conteúdo nunca define um destino de redirecionamento.
`Next Link` e navegação do formulário preservam o provider da área. O retorno
explícito e o botão Voltar do navegador preservam a busca submetida.

Arquivos criados em `frontend/`:

- `src/app/(private)/super-admin/page.tsx`, `loading.tsx`, `error.tsx`.
- `src/app/(private)/super-admin/barbearias/page.tsx`.
- `src/app/(private)/super-admin/barbearias/[id]/page.tsx` e `not-found.tsx`.
- `src/features/superadmin-demo/mock-data.ts`, `presentation.ts`, `styles.ts`.
- Na pasta `src/features/superadmin-demo/components/`: `SuperadminProvider.tsx`,
  `SuperadminShell.tsx`, `SuperadminOverview.tsx`, `SuperadminList.tsx`,
  `SuperadminDetails.tsx`, `SuperadminState.tsx`, `ShopStatus.tsx` e `DemoScenarios.tsx`.

Arquivos alterados: layout existente de superadmin, configuração de navegação
do superadmin e `frontend/package.json` (comandos de teste). Documentação:
`README.md`, `FRONTEND_ROADMAP.md` e este documento. Testes criados:
`validation/superadmin-state.cjs` e `validation/superadmin-browser.cjs`.

Páginas, layout e shell permanecem Server Components. Provider, busca, resumo
reativo, detalhes/ação e seletor de QA usam Client Components porque precisam
de estado ou interação. O boundary de erro também é Client Component.
Metadados da área impedem indexação da demonstração.

## Fixtures e ações

Fonte: `src/features/barbershop-catalog/mock-data.ts` e seu modelo público:

| Identificador/subdomínio | Nome | Cidade | Bairro |
| --- | --- | --- | --- |
| `demo-esquina` | Barbearia da Esquina | Rio de Janeiro | Madureira |
| `demo-navalha` | Navalha & Pente | Rio de Janeiro | Méier |
| `demo-vila` | Barbearia Vila Nova | Nova Iguaçu | Centro |
| `demo-oficina` | Oficina do Corte | Duque de Caxias | Jardim 25 de Agosto |
| `demo-raizes` | Raízes Barbearia | Nova Iguaçu | Posse |
| `demo-bairro` | Barbearia do Bairro | Rio de Janeiro | Bangu |

O modelo local mantém identificador, subdomínio, nome, cidade, bairro e iniciais.
Os detalhes exibem nome, cidade, bairro e subdomínio; não completam dados ausentes
com contatos, proprietários, documentos, endereços ou dados privados inventados.
O estado `demoStatus` é uma projeção exclusiva desta entrega, não um DTO.
Todos os seis exemplos começam ativos na amostra: total 6, rascunhos 0,
ativas 6, suspensas 0.
Isso não descreve estado de publicação ou autorização real.

Suspender/reativar abre `DemoDialog`. Cancelar ou Escape mantém o estado.
Confirmar substitui somente o item da cópia React em memória. Lista, detalhe e
resumo refletem a mesma amostra; a fixture pública original não é mutada.
O foco retorna ao botão da ação e um `role="status"` anuncia que nada foi salvo
ou aplicado a uma barbearia real. O controle possui descrição associada com os
limites da ação. Recarregar ou sair da área restaura os exemplos.

Não há localStorage, sessionStorage, cookies, backend, mocks HTTP ou persistência.
Catálogo, publicação e acesso são independentes e não sofrem alteração.
Não há planos, cobrança, preços comerciais, reputação ou dados de clientes.

## Estados e reprodução

- `loading.tsx`: preparação da amostra durante navegação suspensa pelo App Router.
- `error.tsx`: falha de renderização com nova tentativa.
- Lista sem fixtures: mensagem específica; resumo usa zeros.
- Busca sem resultados: mensagem específica e link para limpar busca.
- Identificador desconhecido ou rascunho perdido: resolução no componente
  cliente, mensagem “Exemplo indisponível” e retorno à lista preservando `q`.
  A página Server Component não restringe IDs à fixture estática. Isso não
  constitui autorização nem garante um HTTP 404 para ausências locais.
  `not-found.tsx` permanece como fallback do App Router.

Somente em `next dev`, a seção recolhível **Cenários locais de QA** permite
selecionar carregamento, erro local ou lista vazia, sem requisições e sem
parâmetros de URL que acionem falhas em produção. Erro local permite tentar
novamente; voltar a Amostra disponível recupera o conteúdo. Cenários não
representam falhas de API. O boundary real de erro existe, mas não foi forçado
durante o QA; o erro verificado foi o cenário local.

## Validação da entrega básica original

Executada em Windows, Edge/Chromium headless via Playwright, localhost:3000 em
desenvolvimento e localhost:3106 com `next start`, sem publicação externa.
Comandos executados na pasta `frontend`:

```sh
npm run lint
npm run typecheck
npm run build
npm run test:superadmin
npm run test:routing
npm run test:superadmin:browser -- 3000
npm run test:superadmin:browser -- 3106
```

- ESLint, TypeScript e build: aprovados. O script prebuild existente executa
  Orval; arquivos gerados permaneceram sem alteração no diff. Uma execução
  simultânea de TypeScript e prebuild encontrou arquivos temporariamente
  removidos pelo gerador; a execução final sequencial de TypeScript passou.
- Testes de estado: 7 grupos aprovados (campos permitidos, busca, vazios,
  suspensão/reativação, resumo, imutabilidade, URLs e parâmetros).
- Regressão de roteamento: 3 testes existentes de host aprovados.
- Navegador: 27 verificações em desenvolvimento e 25 em produção local.
  Incluem busca, detalhes e retorno, Voltar, resumo, cancelamento, Escape,
  suspensão/reativação, recarga, saída, catálogo independente, ausência de
  armazenamento, ausência de chamadas `/api/` e de erros JavaScript.
- Desenvolvimento: carregamento, lista vazia, erro local e recuperação.
  Produção: seletor de QA ausente.
- Teclado/DOM: rótulos, descrição do diálogo, controles de fundo fora do foco
  no modal nativo, Escape, foco retornado, foco visível e região de feedback.
- Responsividade: visão geral, lista, detalhes e diálogo em 320, 390, 768 e
  1440px, sem rolagem horizontal; limites do diálogo dentro da viewport.
  Capturas desktop/mobile também foram inspecionadas visualmente.

Evidências locais em `validation/superadmin/`: resultados JSON de desenvolvimento
e produção e capturas `overview-*`, `list-*`, `details-*`, `dialog-*`.
Para executar o teste de navegador, disponibilize o pacote `playwright` via
`PLAYWRIGHT_MODULE`; opcionalmente escolha `PLAYWRIGHT_CHANNEL=msedge`.
Foi usado o runtime de automação disponibilizado pelo ambiente, sem adicionar
dependências ao produto. O botão Sair foi acionado por teclado no QA, evitando
interferência do indicador de desenvolvimento do Next.js sobre o clique.

Limitações: não foi usado leitor de tela real; verificações de ARIA e mensagens
foram de DOM/teclado. Não houve auditoria integral WCAG, testes de DNS/TLS,
sessão, autorização, API ou isolamento real de banco. QA de navegador não
certifica controle de acesso. Não houve requisição a operações inexistentes.

## Integração real pendente

O OpenAPI continua com `paths: {}`. Antes de integrar, definir e aprovar:

- identidade, sessão e autorização global de superadmin, validadas pelo backend;
- projeção global permitida, schemas, consulta, busca e paginação de barbearias;
- operações e regras de suspensão/reativação, concorrência e tratamento de erros;
- efeitos sobre publicação, catálogo e acesso, atualmente pendentes no ADR;
- auditoria e persistência das mudanças conforme contrato aprovado.

Identificadores da interface não autorizam acesso nem selecionam livremente
um tenant em operações privadas. Não foram alterados backend, banco, migrações,
OpenAPI, cliente gerado ou regras de multi-tenancy. Nenhuma etapa de PWA ou outra
entrega do roadmap foi implementada.

## Cadastro manual demonstrativo — implementado em 2026-10-06

O botão **Cadastrar barbearia** abre um formulário acima da busca na própria
lista, seguindo o padrão administrativo. O título recebe foco ao abrir.
**Cancelar** desmonta o formulário, descarta seu preenchimento, retorna foco
ao botão e não adiciona item ou altera contagens. Não há wizard nem nova rota.

Campos obrigatórios e limites locais explícitos:

| Campo | Limite |
| --- | --- |
| Nome da barbearia | 120 caracteres, alinhado ao limite de busca existente |
| Cidade | 80 caracteres |
| Bairro | 80 caracteres |
| Subdomínio pretendido | 63 caracteres, conforme o helper de roteamento |
| Motivo do cadastro manual | 500 caracteres |

As regras em `registration.ts` removem espaços nas extremidades e rejeitam
vazio/espaços ou excesso de tamanho. Subdomínio é convertido para minúsculas e
validado por `isPublicSubdomain`, sem alterar esse helper: letras ASCII/números,
hífens internos; sem protocolo, porta, caminho, ponto ou acento. Dados de texto
preservam acentos e espaços internos. Formulário tem limites nativos e
validação no provider; erros usam `aria-invalid`/`aria-describedby`, preservam
o preenchimento e focam o primeiro campo inválido.

**Pendência identificada antes de implementar:** não existia lista ou política
de subdomínios reservados em código/documentação. Não atribuímos ao roteamento
uma restrição que ele não tem. A guarda local `demoReservedSubdomains` deriva os
segmentos principais dos quatro configs de navegação e acrescenta os caminhos
existentes de acesso/booking/compatibilidade e o prefixo do OpenAPI. Atualmente:
`admin`, `barbeiro`, `cliente`, `super-admin`, `barbearias`, `login`, `cadastro`,
`register`, `agendar`, `agendamento`, `api`. É uma proteção do cadastro de amostra;
a política oficial, inclusive outros nomes de infraestrutura, exige definição
e contrato. Não altera resolução de Host ou subdomínio público e não mantém
uma segunda lista concorrente com o roteamento (que não possuía lista).

`SuperadminProvider.createDraft` valida contra a coleção atual, incluindo
rascunhos, e gera `manual-<UUID>` uma única vez por criação. A referência interna
é atualizada sincronicamente antes do próximo render, evitando duplicidade em
chamadas consecutivas; o formulário também bloqueia cliques repetidos com uma
ref e desabilita ações após sucesso. O ID não depende de nome/subdomínio.

A criação guarda um item com `demoStatus: "draft"` e `manualReason`, informa o
ID criado ao provider e navega via Next para os detalhes com a busca atual.
Ali o título recebe foco, o motivo aparece e a região de feedback exibe exatamente:

> Barbearia adicionada à amostra — nenhum estabelecimento real foi criado. Subdomínio, acesso e publicação não foram provisionados.

O estado **Rascunho na amostra** tem rótulo explícito. Não há botões ou diálogo
de suspensão/reativação para rascunhos; a regra de alteração de estado também
os ignora. Os seis exemplos originais continuam aceitando as duas ações.
Total inclui todos os itens; rascunhos, ativas e suspensas contam separadamente
os estados da mesma coleção. Navegação interna mantém IDs e dados no layout.
Recarga/saída desmonta o provider: o rascunho desaparece e seus detalhes passam
a **Exemplo indisponível**, com retorno seguro à lista e busca preservada.

O item não entra no catálogo público ou nas fixtures originais, não cria perfil
acessível por Host e não recebe serviços, equipe ou agendamentos. Não há dados
do responsável, Google, e-mail, senha, convite, compra ou cobrança. A interface
informa que disponibilidade na amostra não garante disponibilidade real.

### Arquivos desta ampliação

- Novos: `src/features/superadmin-demo/registration.ts` e
  `components/ManualRegistrationForm.tsx`.
- Alterados na feature: `mock-data.ts`, `presentation.ts`,
  `SuperadminProvider`, `SuperadminList`, `SuperadminDetails`, `SuperadminOverview`,
  `ShopStatus`, `SuperadminState`, `SuperadminShell`.
- Página Server Component alterada: `src/app/(private)/super-admin/barbearias/[id]/page.tsx`.
- Testes de estado e regressão de navegador ampliados; novo
  `validation/superadmin-registration-browser.cjs`, com comando em `frontend/package.json`.
- Documentação: este arquivo, roadmap e comandos/resumo do README.

### Validação desta ampliação

Execuções em Windows com Edge/Chromium headless via Playwright. Desenvolvimento
em localhost:3000; build e `next start` em localhost:3106 com
`BARBERHUB_PUBLIC_HOST=localhost` configurado somente no processo local, permitindo
verificar o Host pretendido sem alterar arquivos de configuração, DNS ou TLS.

```sh
npm run lint
npm run typecheck
npm run test:superadmin
npm run test:routing
npm run test:routing:http
npm run build
npm run test:superadmin:registration:browser -- 3000
npm run test:superadmin:registration:browser -- 3106
npm run test:superadmin:browser -- 3000
npm run test:superadmin:browser -- 3106
```

- ESLint, TypeScript e build aprovados. Nenhuma mudança em arquivos gerados.
- 12 grupos de regras aprovados: campos/limites, normalização, sintaxe,
  reservados locais, duplicados em fixtures/rascunhos, busca, resumo,
  imutabilidade, URLs e rejeição de alteração de estado de rascunho.
- 20 verificações de cadastro no navegador em desenvolvimento e 20 em produção:
  abrir/cancelar por teclado, foco, valores preservados e correção de erros,
  envio repetido (dois cliques DOM síncronos), ID estável, feedback exato,
  detalhes/motivo, busca e retorno, resumo, duplicidade após navegação,
  recarga, saída, ID desconhecido, ausência de persistência/API/erros JavaScript.
- Regressão do superadmin: 27 verificações em desenvolvimento e 25 em produção,
  incluindo suspensão/reativação dos exemplos existentes, resumo e estados.
- Regressão de hosts: 3 testes unitários e 15 HTTP aprovados em desenvolvimento,
  incluindo todos os seis subdomínios, Host inválido, encaminhados e retornos.
- Catálogo e Host pretendido conferidos enquanto o provider continha rascunho,
  em outro tab: rascunho ausente do catálogo e subdomínio não encontrado.
- Formulário com erros e detalhes do rascunho em 320/390/768/1440px, sem rolagem
  horizontal. Resumo com quatro contagens também conferido nessas larguras.
  Capturas desktop/mobile foram inspecionadas visualmente.

Evidências: `validation/superadmin-registration/results-development.json`,
`results-production.json`, `form-errors-*.png`, `draft-*.png`; regressões em
`validation/superadmin/`. Os comandos de navegador usam `PLAYWRIGHT_MODULE` e
opcionalmente `PLAYWRIGHT_CHANNEL=msedge`, conforme a validação básica.
Não houve leitor de tela real ou auditoria completa WCAG: rótulos, associações,
foco e regiões de anúncio foram verificados via DOM/teclado. Não foi forçado o
boundary de erro real; falhas de API não existem neste escopo. Testes locais
não certificam DNS/TLS, provisionamento, sessão ou autorização real.

### Pendências específicas do cadastro real

Definir autorização exclusiva de superadmin; identidade Google validada e vínculo
do responsável; contratos e auditoria da liberação explícita sem compra; separação entre cadastro,
acesso, publicação e cobrança; auditoria; provisionamento e unicidade concorrente
do subdomínio; política oficial de nomes reservados e contratos aprovados no
OpenAPI. Nada disso está implementado por esta demonstração.

## Entrada do onboarding do proprietário — 2026-10-06

Detalhes de um rascunho oferecem **Ver demonstração do onboarding** →
`/onboarding/barbearia?origem=superadmin`. O exemplo Pátio é independente:
nenhum identificador, nome, subdomínio ou outro dado do rascunho é transferido.
Sair da área descarta o rascunho conforme o provider atual; não há sincronização
ou retomada entre demonstrações. Exemplos ativos/suspensos não recebem essa ação.

A introdução apresenta convite e responsável fictícios, com **Experimentar
demonstração do aceite**. Nada é enviado; identidade e autenticação não são
validadas. O percurso e os dois exemplos usam a mesma feature `owner-onboarding`.

Decisão de produto aprovada pelo plano mais recente: liberação para publicação
requer configuração mínima e compra confirmada ou liberação explícita pelo
superadmin. Isso substitui a pendência de regra de liberação sem compra;
contratos, autorização, auditoria, persistência e efeitos continuam pendentes.
O cadastro manual segue criando apenas rascunhos, sem mudar seus CRUDs, fixtures,
catálogo ou hosts. [Regras aprovadas e efeitos fictícios](OWNER_ONBOARDING.md).

## Ajuda do superadmin — 2026-10-06

Implementada por solicitação específica em `/super-admin/ajuda`. Página e
`SuperadminHelpPage` são Server Components, com título/descrição próprios e
`noindex, nofollow`. Reutilizam `HelpShell`, `HelpDestination` e o único `main`
do layout. A skill `interface-design` e `.interface-design/system.md` orientam
superfícies administrativas, hierarquia de leitura e foco. Nenhum componente
compartilhado, header, domínio, autenticação ou permissão foi reformulado.
Ajuda foi habilitada no menu existente; Planos e assinaturas seguem indisponíveis.

Três blocos: aviso de dados fictícios sem autenticação/autorização/alteração real;
caminhos por tarefa; dúvidas frequentes com 13 `details` nativos. Cinco atalhos:

- Visão geral → `/super-admin`, com explicação dos totais da coleção atual.
- Busca e detalhes → `/super-admin/barbearias`, por nome, cidade ou bairro.
- Cadastro manual → mesma lista; orienta abrir **Cadastrar barbearia** e preencher
  os cinco campos obrigatórios. Não abre o formulário automaticamente.
- Suspensão/reativação → mesma lista; orienta abrir um exemplo e confirmar nos
  detalhes. Não cria links para identificadores transitórios.
- Onboarding → `/onboarding/barbearia?origem=superadmin`, com aviso junto ao link:
  sair descarta rascunhos e alterações locais; nenhum dado é transferido ao
  proprietário. O exemplo continua independente, sem sincronização/retomada.

As perguntas cobrem indicadores, busca/detalhes, cadastro/motivo/subdomínio,
restrição dos rascunhos, suspensão, duração da memória, recarga/saída,
rascunho indisponível, onboarding, compra/liberação e planos indisponíveis.
Distinguem explicitamente comportamento implementado em memória, regra aprovada
de publicação futura (configuração mínima e compra confirmada ou liberação
explícita) e integração ausente: pagamento, convite, vínculo do responsável,
autorização, provisionamento e publicação reais.

### Estado e arquivos desta entrega

O layout e `SuperadminProvider` não foram alterados. Navegação interna por Next
Link entre lista, detalhes, visão geral e Ajuda preserva rascunhos e suspensões.
Recarga restaura os exemplos; sair para onboarding/outra área descarta a memória,
inclusive ao voltar pelo navegador. Ajuda não consulta a coleção e continua
disponível com vazio/erro demonstrativo. Não há novo provider, fetch, estado de
dados, efeitos, armazenamento, endpoints ou alteração de backend/banco/OpenAPI.

Arquivos em `frontend/`:

- Novos: `src/app/(private)/super-admin/ajuda/page.tsx`,
  `src/features/superadmin-demo/components/SuperadminHelpPage.tsx`,
  `tests/superadmin-help-http.test.mjs`, `tests/superadmin-help-journeys.mjs`.
- Alterados: `src/features/navigation/config/super-admin-navigation.ts`,
  `tests/qa-runner.mjs`, `tests/qa-journeys.mjs`, `package.json`.
- Fora de `frontend/`: `validation/headers-zoom.cjs`, este documento,
  `FRONTEND_ROADMAP.md` e `README.md`.

HTTP foi integrado ao agregador local/produção; a mesma jornada é chamada pelo
agregador de navegador/produção. `test:superadmin:help` recorta esses testes,
reutiliza regressões de superadmin/cadastro e o zoom existente, sem duplicar
infraestrutura ou definições de cobertura.

### Validação e limites

Windows, Node 24.21.0, Edge/Chromium 154.0.4258.53 e ferramentas separadas de QA.
Servidores próprios iniciados/encerrados pelo agregador. Desenvolvimento final:
porta 3224. Produção local final: porta 3225, com origem lógica HTTPS interceptada
sobre transporte loopback na jornada; regressões legadas e zoom usam HTTP local.
Isso não verifica DNS/TLS publicado.

Comandos executados em `frontend`:

```powershell
npm run lint
npm run typecheck
npm run test:routing
# Build direto, sem prebuild/Orval ou regeneração do cliente:
$env:BARBERHUB_PUBLIC_HOST="localhost"
node node_modules/next/dist/bin/next build

$env:TEST_SERVER="isolated"
$env:TEST_PUBLIC_HOST="localhost"
$env:PLAYWRIGHT_CHANNEL="msedge"
$env:TEST_ENV="development"
$env:TEST_PORT="3224"
npm run test:superadmin:help
$env:TEST_ENV="production"
$env:TEST_PORT="3225"
npm run test:superadmin:help
```

ESLint, TypeScript, build e sete testes de roteamento/configuração: **PASS**.
Nenhum arquivo gerado da API foi alterado. Desenvolvimento final: **PASS**, incluindo 12 grupos de regras, um teste HTTP,
27 verificações de regressão do superadmin, 20 de cadastro, sete grupos da nova
jornada e zoom nativo 200%. Rascunho/motivo e suspensão foram preservados ao
visitar Ajuda e voltar; recarga/saída restauraram a amostra. Lista vazia e erro
foram verificados pelos cenários locais de desenvolvimento, sem forçar o boundary
real. Atalhos e todas as perguntas foram percorridos com mouse/teclado; foco,
ordem de leitura e único main/h1 conferidos. Larguras 320/390/768/1440px e FAQ
expandido no zoom 200% sem rolagem horizontal. Capturas mobile/desktop foram
inspecionadas. Nenhuma chamada `/api/`, armazenamento da amostra ou erro JavaScript
observado. Quatro auditorias axe da ajuda expandida: zero violações detectadas.

Produção local final: **PASS**, incluindo os mesmos 12 grupos de regras e teste
HTTP, 25 verificações do superadmin, 20 de cadastro, seis grupos da ajuda e zoom
nativo 200%. Cenários de vazio/erro são exclusivos de desenvolvimento e não
foram acionados em produção. As quatro larguras, preservação/recarga/saída,
destinos e ausência de API/armazenamento/erros foram revalidados; mais quatro
auditorias axe sem violações detectadas. O build inclui a ajuda como rota estática.

Há resultados `incomplete` do axe (referência ARIA do controle de menu existente
e contraste dos sinais decorativos de expansão). Permanecem pendentes conferência
manual integral de contraste, leitor de tela real, dispositivos físicos,
Safari/Firefox/WebKit, auditoria WCAG integral e ambiente publicado. A verificação
DOM/teclado e o axe não certificam acessibilidade integral ou autorização.

Rodadas intermediárias ficaram registradas como **FAIL**: a primeira execução
concorreu indevidamente com build, que removeu artefatos do servidor de QA; as
seguintes identificaram problemas no teste novo (SSR em chunks, leitura antes da
navegação terminar, título do rascunho também presente na lista e alternância de
`details` já aberto). Corrigidas as verificações e repetido o recorte final;
nenhuma mudança de produto foi necessária para contornar essas falhas.

Evidências em `validation/qa-runs/`:

- `2026-10-06T23-00-31.422Z-superadmin-help-8no57j`: desenvolvimento final aprovado.
- `2026-10-06T23-02-30.202Z-superadmin-help-5wmcuP`: produção local final aprovada.
- `2026-10-06T22-51-49.798Z-superadmin-help-aM5irD`,
  `2026-10-06T22-53-56.301Z-superadmin-help-ehaq0Q` e
  `2026-10-06T22-57-01.196Z-superadmin-help-g6XaiK`: execuções intermediárias com falhas.

Cada recorte guarda `run.json`, logs, resultados, axe, capturas e trace.

### Revisão independente — 2026-10-06

Ajuda aprovada no escopo demonstrativo, sem bloqueadores identificados na
leitura do código e nas verificações abaixo. Nenhuma alteração de produto foi
feita nesta revisão; a documentação existente da entrega foi preservada.

- `npm run lint` e `npm run typecheck`: **PASS**.
- `test:superadmin:help`, desenvolvimento isolado na porta 3225: **PASS**;
  12 grupos de regras, um teste HTTP, 27 verificações do superadmin, 20 de
  cadastro, sete grupos da ajuda, quatro auditorias axe e zoom nativo 200%.
- Mesmo recorte em produção local isolada na porta 3226: **PASS**;
  12 grupos de regras, um teste HTTP, 25 verificações do superadmin, 20 de
  cadastro, seis grupos da ajuda, quatro auditorias axe e zoom nativo 200%.
- `test:qa:local` em desenvolvimento no servidor preparado da porta 3000:
  **PASS nas 14 suítes**, incluindo autenticação/retorno, domínios, booking,
  agendamentos, Minhas barbearias, barbeiro, perfis, superadmin, onboarding e
  política PWA. O servidor preparado não foi encerrado pelo executor.
- Inspeção visual das capturas da ajuda em 320px e 1440px: hierarquia, textos,
  identidade administrativa e FAQ expandido coerentes com os shells existentes.
  Aplicada a skill `interface-design` com `.interface-design/system.md` para
  revisar reutilização, hierarquia e foco, sem reformulação visual.
- Rascunho e suspensão preservados na navegação interna; recarga/saída restauram
  a amostra. Atalhos, teclado, foco e larguras 320/390/768/1440px aprovados.
  Nenhuma chamada de API, armazenamento da amostra ou erro JavaScript detectado.

Evidências em `validation/qa-runs/`:

- `2026-10-06T23-06-58.199Z-superadmin-help-ouLzy7`: desenvolvimento.
- `2026-10-06T23-07-49.305Z-superadmin-help-CVrwIe`: produção local.
- `2026-10-06T23-08-00.867Z-local-JS2r3d`: regressão local.

Não foi executado novo build: a produção reutilizou o build existente da entrega.
O fingerprint de `frontend/src` e `frontend/tests` coincide com o recorte de
produção aprovado anteriormente (`2026-10-06T23-02-30.202Z-superadmin-help-5wmcuP`);
isso não é verificação de equivalência de toda a configuração ou dependências.
As oito auditorias axe não detectaram violações, mas conservaram resultados
`incomplete` para revisão humana. Mantidas as pendências de leitor de tela,
contraste integral, aparelhos/navegadores reais e publicação descritas acima.
