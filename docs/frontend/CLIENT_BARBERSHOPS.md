# Minhas barbearias — demonstração local

Implementação solicitada em 2026-10-06. Rota `/cliente/barbearias` no domínio
principal, com layout do cliente e ClientHeader existentes. A página é pública
demonstrativa, com `noindex, nofollow`; grupos de rotas, header e Host não
autenticam nem autorizam acesso.

## Regra de produto aprovada

**O vínculo real nasce após o primeiro agendamento real confirmado na
barbearia.** A decisão complementa o ADR 08 e substitui a pendência anterior
do roadmap. Não depende do primeiro atendimento concluído ou de uma ação de
favoritar/vincular na interface. Modelagem física, transação de confirmação,
consulta limitada à identidade autenticada e demais efeitos do ciclo de vida
ainda precisam de contratos aprovados. Não foi implementada operação real.

## Fixtures e independência

Os dois vínculos prontos pertencem a `cliente-demonstracao`: `demo-esquina`
(Barbearia da Esquina, Madureira, Rio de Janeiro) e `demo-navalha` (Navalha &
Pente, Méier, Rio de Janeiro). Os dados vêm das fixtures públicas; não há imagem
de logo disponível, portanto o avatar usa as iniciais BE/NP, como o catálogo.
Nome de exibição não é identidade nem titularidade.

A feature `frontend/src/features/client-barbershops` separa tipos locais,
`demo-data.ts`, regras em `presentation.ts`, lista, card e estados. Lista e
cards são Server Components; apenas o seletor de cenários de desenvolvimento
e o boundary de erro precisam de interação cliente. Não há backend, banco,
HTTP de dados, DTO, token, sessão, cookies fictícios, localStorage ou cache
de dados privados. OpenAPI conferido: `paths: {}`.

Cancelar um agendamento local não remove vínculo. Concluir o wizard não
adiciona vínculo ou reserva à área global. Suspender uma fixture no provider
do superadmin não muda esta lista. A indisponibilidade de demonstração mantém
o card e a consulta de agendamentos, removendo perfil e agendamento públicos;
nenhum motivo ou remoção automática é inventado.

## Navegação e apresentação

Menu principal da prévia de cliente: Explorar barbearias → `/barbearias`,
Minhas barbearias → `/cliente/barbearias`, Meus agendamentos →
`/cliente/agendamentos`. Perfil, Ajuda, saída, visitante e ações do header
conservam seus comportamentos. Acesso direto não ativa prévia ou sessão.

Cada card oferece Ver barbearia (raiz canônica via `publicBarbershopHref`),
Agendar horário (introdução de `/agendar` via `publicBookingHref`, com os avisos
existentes) e Ver meus agendamentos (`?barbearia=<identificador>`).
Os layouts redirecionam as duas áreas globais de subdomínios conhecidos para a
plataforma antes do streaming. O proxy sobrescreve o header interno
`x-barberhub-client-search` com a query do request; ela é preservada no redirect
server, sem normalização de localhost dos redirects do proxy. O header não
seleciona domínio, barbearia ou permissões. Host desconhecido,
externo ou inválido não escolhe outra fixture; forwarded Host não autoriza.

Interface orientada por `interface-design`, com continuidade da conta:
Geist, paleta pública, bordas discretas, base de 4px, nomes em destaque,
avatar/localização juntos, lista com duas colunas somente em desktop e ações
de pelo menos 44px. Primário reutiliza `catalogActionClass`, sky-500/branco,
hover sem mudar o azul e movimento reduzido respeitado.

Estados vazio, carregamento e erro têm orientação própria; vazio explica a
regra e oferece Explorar barbearias. `loading.tsx`/`error.tsx` são boundaries
reais. Em desenvolvimento, abra Cenários de demonstração e escolha Lista
vazia, Carregamento, Falha ao carregar ou Barbearia indisponível (Navalha).
Esses controles não aparecem em produção e não usam parâmetros arbitrários.

## Filtro de agendamentos

`client-appointments/filters.ts` valida todos os identificadores públicos
conhecidos em `barbershopsMock`. `partitionAppointments` combina esse recorte
com a busca normalizada existente por barbearia, serviço e profissional.
Valores desconhecidos, vazios ou repetidos (inclusive iguais) não selecionam
uma barbearia, mostram `role="alert"` e ocultam resultados até a correção.
Fixture conhecida sem agendamentos admite resultado vazio.

`barbearia` é apenas apresentação: nunca autorização, tenant_id ou entrada
privada. A URL guarda `q` e `barbearia`; `useSearchParams` reflete navegação e
Voltar. Digitar usa History replaceState integrado ao Next, sem uma entrada
por tecla; remover barbearia usa pushState, preserva busca e retorna foco ao
input. Limpar busca mantém barbearia; restaurar exemplos também mantém esse
recorte. Repetições inválidas são preservadas durante a busca para não
normalizar silenciosamente. Não há redirecionamento arbitrário.

## QA e integração pendente

Regras em `validation/client-barbershops-state.cjs`; HTTP em
`frontend/tests/client-barbershops-http.test.mjs`; jornadas ampliadas em
`frontend/tests/qa-journeys.mjs`, sem duplicar suítes de booking, menus ou PWA.
Os três agregadores de QA incluem as verificações aplicáveis. Comandos
específicos: `npm run test:barbershops` e `npm run test:barbershops:http`.
Preparação e variáveis em [QA_ACCESSIBILITY.md](QA_ACCESSIBILITY.md).

Verificações executadas em Windows, Node 24.21.0 e Edge 154.0.4258.53:
ESLint, `npm run typecheck`, `npm --ignore-scripts run build` (Turbopack) e
`test:qa:local` na porta 3211 passaram. O prebuild Orval foi dispensado para
preservar os arquivos gerados do contrato sem operações. Os resultados finais
de navegador/produção estão registrados na seção seguinte.
Leitor de tela real, Android/iOS físicos, Safari/Firefox e DNS/TLS publicado
permanecem pendentes. Cenários locais não forçam os boundaries reais a falhar.
Contraste sky-500/branco segue a exceção aprovada já registrada no QA.
Redirecionamentos entre hosts em produção local são verificados por HTTP;
o navegador usa origem HTTPS/Host interceptada sem TLS publicado. O percurso
real entre hosts `.localhost` é verificado no navegador em desenvolvimento.

Integração exige Google/sessão, consulta global dos vínculos da identidade
autenticada, confirmação real que cria vínculo, regras de publicação e efeitos
do ciclo de vida, erros e isolamento no backend. Aprovar OpenAPI antes de
gerar o cliente Orval; fixtures não certificam titularidade ou isolamento real.

## Arquivos alterados

- Rota `frontend/src/app/(private)/cliente/barbearias`: page, layout, loading e error.
- Feature `frontend/src/features/client-barbershops`: types, demo-data, presentation,
  server-domain, ClientBarbershopsList, ClientBarbershopCard, ClientBarbershopsState
  e ClientBarbershopsScenarios.
- `client-appointments/filters.ts`, presentation e ClientAppointmentsView; layout
  de `/cliente/agendamentos`, `src/proxy.ts`, config client-navigation e RoleHelpPage.
- `frontend/package.json`, tests/qa-runner, qa-journeys, client-barbershops-http;
  validation/client-barbershops-state e headers-browser (mesma suíte ampliada).
- AGENTS, README, ADR, FRONTEND_ROADMAP, CLIENT_EXPERIENCE, CLIENT_AUTH,
  CLIENT_APPOINTMENTS, PROFILE_HELP, HEADERS_REVIEW, QA_ACCESSIBILITY, referência
  de navegação em `.interface-design/system.md` e este documento.

Backend, banco, OpenAPI, arquivos gerados, navegação de outros papéis e regras
de autenticação permanecem como antes.

## Resultados finais executados em 2026-10-06

Comandos na pasta `frontend`, com servidores isolados encerrados pelo executor:

```powershell
npm run test:barbershops
npm run lint
npm run typecheck
$env:BARBERHUB_PUBLIC_HOST='localhost'
$env:NEXT_PUBLIC_API_MOCKING='disabled'
npm --ignore-scripts run build

$env:TEST_SERVER='isolated'
$env:TEST_ENV='development'
$env:TEST_PORT='3211'
npm run test:qa:local

$env:TEST_PORT='3212'
$env:PLAYWRIGHT_CHANNEL='msedge'
npm run test:qa:browser

$env:TEST_ENV='production'
$env:TEST_PORT='3214'
npm run test:qa:production
```

| Verificação | Resultado efetivamente obtido |
| --- | --- |
| ESLint, TypeScript e build | Aprovados; build inclui `/cliente/barbearias` como rota dinâmica. |
| Regras da entrega | 7 grupos aprovados: mesma identidade, dados públicos, URLs canônicas, indisponibilidade, validação, busca combinada, limpeza e cancelamento independente. |
| HTTP compartilhado | 22 testes aprovados, incluindo 3 novos grupos de vínculos, SSR do filtro e hosts/redirects; repetições/encoding preservados e header interno forjado sobrescrito. |
| QA local | Todas as suítes de regras e HTTP aprovadas: roteamento/executor, auth, booking, agendamentos, vínculos, barbeiro, perfil/ajuda, superadmin e política da PWA. |
| Navegador em desenvolvimento | 160 verificações de headers, 10 de zoom nativo 200%, 38 de perfil/ajuda, 27 de superadmin, 20 de cadastro e 53 de jornadas aprovadas. |
| Produção local | Regras/HTTP aprovados; 25 verificações de superadmin, 20 de cadastro, 49 de jornadas, 15 da PWA e 4 de lifecycle aprovadas. |
| Acessibilidade automatizada | 35 auditorias de jornada em desenvolvimento e 23 em produção sem falhas fora da exceção documentada sky-500/branco. Sem erros JavaScript de página nas jornadas. |

As jornadas conferiram cards/destinos, filtro combinado com busca, limpeza,
retorno de foco, Voltar, valores inválidos, hosts desconhecidos e ações públicas
das duas fixtures. Em desenvolvimento, vazio/carregamento/erro/indisponibilidade
foram conferidos nas quatro larguras, inclusive consulta de agendamentos da
Navalha indisponível. Cancelamento local, wizard concluído e suspensão no
superadmin mantiveram os dois vínculos; wizard também não acrescentou reservas.
Capturas de 320/390/768/1440px foram geradas, com inspeção visual de mobile,
desktop e indisponibilidade. Teclado, rótulos, foco e avisos foram verificados
por DOM/axe, sem leitor de tela real.

Evidências das execuções aprovadas:

- [QA local — relatório e logs](../../validation/qa-runs/2026-10-06T18-39-34.163Z-local-TTQ8fD/run.json).
- [QA navegador — relatório, capturas e trace](../../validation/qa-runs/2026-10-06T18-41-13.225Z-browser-cjHBQJ/run.json).
- [QA produção — relatório, capturas, PWA e trace](../../validation/qa-runs/2026-10-06T18-43-54.470Z-production-wBsng3/run.json).

As rodadas iniciais que detectaram problemas de redirect/streaming e esperas
do teste de navegação ficaram preservadas com FAIL nos próprios diretórios;
não são contadas como verificações aprovadas. A rodada final de produção contém
as verificações HTTP e regras ampliadas; os relatórios guardam a revisão Git,
alterações e fingerprint inicial da execução. Ajustes finais nas esperas de QA
não alteraram o código do produto já validado pelo build.

Pendências mantidas: leitor de tela, dispositivos reais, Safari/Firefox,
instalação manual e ambiente HTTPS/DNS/TLS publicado. Prompts/standalone têm
emulação controlada nos testes da PWA; não são nova validação manual de instalação.
OAuth, autorização, titularidade, concorrência e vínculo real continuam ausentes.

## Revisão independente — 2026-10-06

Nova verificação solicitada após a implementação, sem alterações no código.
**Conclusão: entrega concluída no escopo demonstrativo, sem erros bloqueadores
ou ajustes obrigatórios identificados nesta rodada.** Isso não certifica a
integração real nem encerra as pendências de QA externo.

Executados novamente na pasta `frontend`:

```powershell
npm run lint
npm run typecheck
$env:TEST_SERVER='isolated'
$env:TEST_ENV='development'
$env:TEST_PUBLIC_HOST='localhost'
$env:TEST_PORT='3221'
npm run test:qa:local

$env:TEST_PORT='3222'
$env:PLAYWRIGHT_CHANNEL='msedge'
npm run test:qa:browser
```

- ESLint e TypeScript aprovados.
- QA local: 13 suítes aprovadas, incluindo 7 grupos de vínculos e filtros,
  22 testes HTTP compartilhados e regressões de autenticação, roteamento,
  booking, agendamentos, barbeiro, perfil/ajuda, superadmin e política da PWA.
- QA navegador: 6 suítes aprovadas em Edge 154.0.4258.53 no Windows;
  160 verificações de headers, 38 de perfil/ajuda, 10 de zoom nativo 200%,
  27 de superadmin, 20 de cadastro e 53 de jornadas, sem falhas.
- Jornadas: 35 auditorias axe sem falhas fora da exceção de contraste
  sky-500/branco já documentada; zero erros JavaScript de página.
  Resultados `incomplete` continuam exigindo avaliação humana.
- Conferidos vínculos das duas fixtures, destinos públicos, filtro combinado
  com busca, limpeza, Voltar, valores inválidos, hosts desconhecidos e
  redirecionamentos. Cancelamento, conclusão do wizard e suspensão no superadmin
  preservaram a independência das demonstrações.
- Estados vazio, carregamento, erro, recuperação e indisponibilidade verificados
  em 320/390/768/1440px. Capturas de mobile, desktop e indisponibilidade também
  foram inspecionadas visualmente, sem cortes identificados.

Build e QA de produção **não foram reexecutados nesta rodada**. Foi conferido
o relatório anterior de produção aprovado, cujo fingerprint de `frontend/src`
e `frontend/tests` coincide com o desta revisão. Essa comparação não abrange
todos os arquivos de configuração ou ferramentas e não substitui um novo build.

Os servidores próprios nas portas 3221/3222 foram encerrados pelo executor;
o servidor existente na porta 3000 foi preservado. Evidências locais:

- [Revisão QA local — relatório e logs](../../validation/qa-runs/2026-10-06T21-55-40.703Z-local-86PrPZ/run.json).
- [Revisão QA navegador — relatório, capturas e trace](../../validation/qa-runs/2026-10-06T21-55-55.862Z-browser-2oKvVH/run.json).

Mantidas as pendências de leitor de tela real, dispositivos físicos, outros
navegadores, instalação manual e HTTPS/DNS/TLS publicado, além da exceção de
contraste. A revisão permite avançar ao planejamento da próxima entrega,
sem autorizar sua implementação automaticamente.
