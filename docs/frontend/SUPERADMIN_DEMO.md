# Superadmin básico — demonstração local

Implementado em 2026-10-06, exclusivamente no frontend, conforme entrega 5 do
[roadmap](FRONTEND_ROADMAP.md). A skill `interface-design` e o sistema existente
em `.interface-design/system.md` orientaram a composição administrativa.

## Diagnóstico e decisões

Antes da implementação, o código possuía somente o layout
`src/app/(private)/super-admin/layout.tsx`, `SuperAdminHeader` e a configuração
`super-admin-navigation.ts`, sem páginas e com todos os destinos desabilitados.
O proxy público não inclui estas rotas. Mantivemos a convenção existente de
caminhos da área privada, sem alterar proxy, domínio de admin ou header.
Grupo privado, subdomínio, identificador e header não concedem permissões.

Reutilizados sem alterar comportamento: `Container`, `NavigationItems`,
`SuperAdminHeader`, `AuthenticatedHeader` e `DemoDialog` (diálogo HTML modal).
Somente Início e Barbearias receberam destinos. Planos/assinaturas e Ajuda
continuam desabilitados porque suas páginas não existem.

A lista é o foco visual: nomes e localização lideram a leitura, com subdomínio
de apoio, estado explícito em texto e link para detalhes. Superfícies privadas,
Geist, bordas discretas e controles de pelo menos 44px preservam o sistema atual.
Não há gráficos, faturamento, planos, avaliações ou dados operacionais de tenants.

## Rotas e arquivos

| Rota | Comportamento |
| --- | --- |
| `/super-admin` | Total, ativas e suspensas calculados da mesma amostra em memória. |
| `/super-admin/barbearias?q=...` | Lista e busca por nome, cidade ou bairro, indiferente a caixa e acentos. |
| `/super-admin/barbearias/[id]?q=...` | Identidade pública, estado demonstrativo, confirmação e retorno com a busca. |

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
Todos os seis exemplos começam ativos na amostra: total 6, ativas 6, suspensas 0.
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
- Identificador desconhecido: `not-found.tsx`, mensagem e retorno à lista.

Somente em `next dev`, a seção recolhível **Cenários locais de QA** permite
selecionar carregamento, erro local ou lista vazia, sem requisições e sem
parâmetros de URL que acionem falhas em produção. Erro local permite tentar
novamente; voltar a Amostra disponível recupera o conteúdo. Cenários não
representam falhas de API. O boundary real de erro existe, mas não foi forçado
durante o QA; o erro verificado foi o cenário local.

## Validação executada

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
