# Onboarding demonstrativo do proprietário

Implementado em 2026-10-06 conforme plano específico aprovado. Essa decisão é
mais recente que as referências anteriores a planejamento condicionado.
A skill `interface-design`, o sistema existente e a paleta pública aprovada
orientam uma jornada de abertura com etapa principal, percurso numerado e
checklist textual. Não há reformulação dos headers ou CRUDs administrativos.

## Regras de produto aprovadas

- Configuração mínima: nome/localização válidos; subdomínio com formato válido
  sem conflito na amostra; serviço ativo com duração/preço válidos; profissional
  associado ao serviço; ao menos um intervalo suficiente dentro do funcionamento.
- Liberação para publicação exige configuração mínima **e** (compra confirmada
  **ou** liberação explícita pelo superadmin). Completar o checklist não publica.
- O proprietário pode ensaiar a configuração pela entrada de cadastro ou pela
  apresentação de convite do superadmin. Esta entrega não define a implementação
  da identidade/vínculo real do responsável.
- Logo opcional. A demonstração não recebe upload e apresenta somente texto.

## Efeitos que continuam fictícios

Origem escolhida, responsável, convite, aceite, compra confirmada e liberação
explícita são apresentação local. Não são identidade validada, autenticação,
autorização, pagamento ou convite enviado. Nenhum tenant, conta, vínculo, acesso,
compra, publicação ou endereço acessível é criado. Não há reserva de subdomínio,
planos, condições comerciais ou botões de compra/concessão real.

OpenAPI continua com `paths: {}`. Não foram criados endpoints, DTOs, tokens,
sessões ou integrações. Backend, banco, contrato e arquivos gerados não fazem
parte desta alteração. O ensaio não modifica fixtures públicas, administrativas,
Google ou rascunhos; usa apenas memória React, sem localStorage, cache privado,
sincronização ou retomada. Sair/recarregar desmonta o fluxo e descarta os dados.

## Rotas e três entradas

| Entrada | Destino/comportamento |
| --- | --- |
| Cadastro com perfil Barbearia | **Experimentar configuração** → `/onboarding/barbearia?origem=cadastro`; Google continua desabilitado. |
| Detalhes de rascunho do superadmin | **Ver demonstração do onboarding** → `/onboarding/barbearia?origem=superadmin`; não leva ID ou dados do rascunho. |
| Acesso direto | `/onboarding/barbearia`; escolha entre os mesmos dois exemplos. |

Origem aceita somente `cadastro` e `superadmin`. Valores desconhecidos/repetidos
abrem a introdução sem seleção. É intenção de apresentação, nunca papel ou
permissão. A rota Server Component usa `getPlatformNavigation`: domínio principal
validado; subdomínio confiável redireciona à mesma rota principal e preserva só a
origem validada. Host externo, IP ou encaminhado não ativa o wizard.
Retorno de login/cadastro, domínios operacionais, proxy e resolução dos perfis
públicos permanecem com seus comportamentos existentes.

**Horizonte:** origem cadastro, profissional Alex Exemplo, dados fictícios próprios.
**Pátio:** origem superadmin, responsável Marina Exemplo na prévia de convite e
profissional Rafa Modelo. **Experimentar demonstração do aceite** apenas inicia o
ensaio. O exemplo nunca é o rascunho criado pelo superadmin. Sair da área descarta
aquele rascunho conforme seu provider existente; não há transferência ou retomada.

Os dois exemplos começam preenchidos para exploração e podem ser editados ou
esvaziados. Seguem o mesmo wizard e as mesmas regras.

## Etapas e validações

| Etapa | Campos e limites locais |
| --- | --- |
| Estabelecimento | Nome 120, endereço fictício 160, cidade/bairro 80 caracteres cada. |
| Endereço público pretendido | 63 caracteres; trim/minúsculas; `isPublicSubdomain`; conflitos contra os seis exemplos públicos e proteção local de rotas do superadmin, mais `onboarding`. |
| Serviço inicial | Nome 80 caracteres; duração inteira de 1 a 480 minutos; preço de R$ 0 a R$ 9.999,99, até duas casas decimais; ativo. |
| Profissional inicial | Nome fictício 80 caracteres e associação ao serviço atual; alterar nome do serviço pede nova conferência. |
| Funcionamento | Sete dias, um intervalo por dia em cada agenda; horários 00:00–23:59, início anterior ao fim, sem atravessar meia-noite. |
| Revisão | Resumo de todos os dados, horários, checklist, pendências acionáveis e cenário fictício de liberação. |

Texto vazio/espaços é rejeitado. Limites contam caracteres incluindo espaços;
subdomínio é normalizado só para validação/prévia. Duração/preço rejeitam valores
não finitos, negativos, notação científica, excesso e precisão incompatível.
Preço aceita ponto ou vírgula; zero é compatível com o CRUD existente.

Horários ativos inválidos geram pendência. O profissional só atende em dia aberto,
inteiramente dentro do intervalo da barbearia e por tempo suficiente para o
serviço. Desativar todos os intervalos impede completar. Alterar funcionamento,
duração, serviço ativo ou associação recalcula o checklist imediatamente. Os
validadores administrativos estavam embutidos nos componentes: critérios foram
preservados em funções locais, sem extrair/reconstruir os CRUDs. Limites de
registro e helper de sintaxe existentes são reutilizados diretamente.

O endereço é texto de prévia, sem link e sem perfil provisionado. A mensagem é
**Válido na demonstração**; conflito local não prova unicidade real ou contratação.
Não recebe os rascunhos transitórios de outra área. A política oficial de nomes
reservados e unicidade concorrente continua dependente de contrato.

## Navegação e estados

Continuar valida a etapa atual; erro preserva campos, mostra alerta e foca o
primeiro controle inválido. Percurso, checklist e pendências permitem voltar ou
ir à revisão sem perder dados do ensaio. Cabeçalho da etapa recebe foco ao mudar.
Não há marcação manual de checklist. Reiniciar limpa dados/cenário, retorna à
introdução com origem escolhida e recria uma cópia do exemplo ao iniciar.

1. **Configuração incompleta:** pendências orientam as etapas de correção;
   escolher cenário fictício não contorna a validação.
2. **Configuração completa, liberação pendente:** checklist completo sem publicação;
   conclusão bloqueada até apresentar cenário fictício.
3. **Configuração e liberação demonstrativas completas:** prévia local após escolher
   compra confirmada fictícia ou liberação explícita fictícia. Concluir apenas
   mostra o resultado, sem executar efeitos.

Resultado exato:

> Simulação concluída — nenhum estabelecimento, acesso ou endereço público foi criado.

Oferece reinício e atalhos para `/admin/configuracoes`, `/admin/servicos` e
`/admin/barbeiros`, todos existentes. `?origem=onboarding-demo` exibe aviso na chegada
sobre demonstrações com dados independentes; parâmetro não concede acesso. Os
atalhos descartam o ensaio e não substituem fixtures ou CRUDs. Grupos privados e
headers continuam sem representar autorização real.

## Arquivos

- Rota: `frontend/src/app/(public)/onboarding/barbearia/page.tsx`.
- Feature: `types.ts`, `fixtures.ts`, `routing.ts`, `validation.ts`, `checklist.ts`,
  `transitions.ts` em `frontend/src/features/owner-onboarding`.
- Componentes: `OwnerOnboardingWizard`, `Introduction`, `StepFields`/`HoursStep`,
  `Checklist`, `Review`, `AdminDemoNotice`. Só o wizard precisa de `use client`;
  componentes interativos entram por essa fronteira. Aviso admin é server.
- Entradas: `AuthScreen.tsx`, `SuperadminDetails.tsx`.
- Avisos nas páginas Server de Configurações, Serviços e Barbeiros.
- QA: `validation/owner-onboarding-state.cjs`,
  `frontend/tests/owner-onboarding-http.test.mjs`, `owner-onboarding-journeys.mjs`;
  integração em `qa-runner.mjs`, `qa-journeys.mjs` e comandos em `package.json`.
- Documentação: este arquivo, roadmap, CLIENT_AUTH, SUPERADMIN_DEMO, ADR e README;
  referências conflitantes de AGENTS e CLIENT_EXPERIENCE também atualizadas.

## QA e integração real

Testes de regras em `npm run test:onboarding`; HTTP em
`npm run test:onboarding:http` com `TEST_ENV`, `TEST_PORT` e `TEST_PUBLIC_HOST`.
Agregador local inclui regras/HTTP; navegador/produção usam a mesma jornada de
onboarding com o contexto, axe, capturas e coleta de erros existentes, sem duplicar
infraestrutura ou as regressões públicas. `npm run test:onboarding:browser` usa
o mesmo agregador e a mesma jornada, recortando as regras/HTTP/navegador desta
feature para revalidar alterações sem repetir suítes que já passaram.
Resultados efetivamente obtidos estão registrados abaixo.

Dispositivos Android/iPhone reais, Safari/Firefox/WebKit, leitor de tela real,
auditoria WCAG integral, DNS/TLS e implantação pública continuam pendentes.
A exceção de contraste dos botões públicos sky-500/branco permanece conforme
decisão vigente em QA_ACCESSIBILITY; não houve alteração de cor autorizada.

Integração real exige contratos aprovados: identidade Google e responsável,
autorização por papel/tenant, criação/vínculos, convites/aceite auditados,
persistência/concorrência, política de subdomínios, compra confirmada e liberação
auditada, provisionamento/publicação. O backend deverá aplicar regras e isolamento;
estado da interface ou query nunca autoriza essas operações.

### Execuções desta entrega — 2026-10-06

Windows, Node 24.21.0, Edge/Chromium headless 154.0.4258.53 via ferramentas
separadas de QA. Servidores criados/encerrados pelo executor, sem usar o dev
pessoal. Desenvolvimento: portas 3216 (local), 3217 (regressão ampla), 3219
(recorte final). Produção local: 3218 (regressão ampla), 3220 (recorte final).
Produção usa origem lógica HTTPS/Host interceptado sobre transporte loopback;
não certifica DNS/TLS. `BARBERHUB_PUBLIC_HOST=localhost` somente no processo.

Comandos executados na pasta `frontend`:

```powershell
node ../validation/owner-onboarding-state.cjs
npm run lint
npm run typecheck
# Build direto evita executar o prebuild/Orval e regenerar o cliente da API:
$env:BARBERHUB_PUBLIC_HOST="localhost"
node node_modules/next/dist/bin/next build

$env:TEST_SERVER="isolated"
$env:TEST_PUBLIC_HOST="localhost"
$env:PLAYWRIGHT_CHANNEL="msedge"
$env:TEST_ENV="development"
$env:TEST_PORT="3216"
npm run test:qa:local
$env:TEST_PORT="3217"
npm run test:qa:browser
$env:TEST_PORT="3219"
npm run test:onboarding:browser

$env:TEST_ENV="production"
$env:TEST_PORT="3218"
npm run test:qa:production
$env:TEST_PORT="3220"
npm run test:onboarding:browser
```

- ESLint, TypeScript e build final: **PASS**. Nenhuma alteração em arquivos gerados.
- Agregador local: **PASS**, incluindo as regras/HTTP novos e as regressões de
  catálogo, seis subdomínios, hosts, retorno Google indisponível, booking,
  agendamentos, vínculos fictícios, barbeiro, perfis, superadmin e política PWA.
- Recorte final de onboarding: **PASS em desenvolvimento e produção local**;
  nove grupos de regras, quatro testes HTTP e dez verificações de navegador por
  ambiente. Ambos usam exatamente a mesma jornada do agregador amplo.
- Navegador: três entradas, duas origens, convite/aceite fictícios independentes,
  avanço/retorno/edição, checklist atualizado, associação invalidada, intervalo
  insuficiente/fora do funcionamento, ausência de todos os intervalos com foco
  orientado, três estados, reinício/recarga/saída e três destinos administrativos
  preservando o conteúdo da amostra. Nenhuma requisição `/api/`, armazenamento
  do onboarding ou erro JavaScript observado.
- Introdução, todas as etapas, revisão incompleta/pendente/completa e resultado
  nas larguras 320/390/768/1440px, sem rolagem horizontal. Capturas desktop/mobile
  inspecionadas; horários empilhados abaixo de 390px para preservar leitura.
  Rótulos, required/ARIA, Tab, foco inicial/erro/retorno e avisos conferidos no DOM
  e teclado. Axe: 77 auditorias por recorte, zero falhas fora da exceção vigente
  de contraste sky-500/branco. Não equivale a leitor de tela ou auditoria WCAG.

As execuções amplas de navegador/produção tiveram **uma falha no teste novo**:
o teste lia o conteúdo do superadmin imediatamente após clicar no link, antes
de terminar a navegação do App Router. Corrigido com espera pelo botão de aceite
na introdução; revalidado nos dois recortes finais acima. Essas execuções amplas
permanecem registradas como FAIL, sem ocultar o resultado. As outras 62/58
verificações das jornadas amplas passaram, assim como as suítes de headers,
zoom 200%, perfil/ajuda, superadmin/cadastro e PWA (esta em produção local).
Não foram repetidas suítes aprovadas sem relação com as correções finais.
Após os recortes, um ajuste somente de texto removeu a referência a iniciais na
nota de logo opcional; ESLint e build (incluindo TypeScript) foram reexecutados e
passaram. Não houve mudança de fluxo ou validação após os recortes aprovados.

Evidências preservadas em `validation/qa-runs/`:

- `2026-10-06T22-25-14.139Z-local-gEset7`: agregador local aprovado.
- `2026-10-06T22-26-28.373Z-browser-PY7vYG`: regressão ampla e falha de espera inicial.
- `2026-10-06T22-27-41.569Z-production-nU42cv`: regressão ampla de produção e mesma falha inicial.
- `2026-10-06T22-30-53.080Z-onboarding-e7q0ZO`: recorte final de desenvolvimento aprovado.
- `2026-10-06T22-33-01.675Z-onboarding-04lp9C`: recorte final de produção aprovado.
- `owner-onboarding-final-checks`: logs finais de lint, TypeScript e build.

Cada execução do agregador guarda `run.json`, logs, `results.json`, `axe.json`,
capturas e trace. Limitações de ambiente e integração real permanecem as listadas
acima; nenhum resultado declara tenant, autenticação, autorização ou publicação real.

### Revisão independente — 2026-10-06

Revisão realizada após a implementação e registrada nesta consolidação documental.
Não é uma reexecução do onboarding durante a revisão posterior da Ajuda.
Entrega aprovada como demonstração local, sem bloqueadores identificados.

- ESLint e TypeScript: **PASS**.
- `test:onboarding:browser`, servidores isolados em desenvolvimento (3223) e
  produção local (3224): **PASS** em ambos. Por ambiente: nove grupos de regras,
  quatro testes HTTP, dez grupos de navegador e 77 auditorias axe.
- Percurso, edição/invalidação, configuração mínima, liberação fictícia,
  três estados, reinício, recarga/saída e atalhos administrativos revalidados.
  Nenhuma chamada de API, armazenamento do onboarding ou erro JavaScript observado.
- Inspeção visual de funcionamento em 320px, prévia em 390px e início em 1440px;
  testes de geometria também cobriram 768px. Sem corte/overflow detectado.
- `test:qa:local` com servidor preparado na porta 3000: **PASS nas 14 suítes**.
  Produção usou o build existente; não foi executado novo build nesta revisão.

Evidências em `validation/qa-runs/`:

- `2026-10-06T22-37-03.852Z-onboarding-MbvKix`: desenvolvimento.
- `2026-10-06T22-37-55.407Z-onboarding-WzGz6Z`: produção local.
- `2026-10-06T22-38-28.132Z-local-v40Eia`: regressão local daquela revisão.

As auditorias axe mantêm a exceção vigente de contraste dos botões públicos;
não certificam WCAG nem uso com leitor de tela. Equipamentos físicos, outros
navegadores e DNS/TLS publicado continuam pendentes. Nenhuma alteração de código,
backend ou banco foi realizada durante a revisão.
