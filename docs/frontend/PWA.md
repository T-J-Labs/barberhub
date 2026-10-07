# PWA e acabamento transversal

Estado atual confirmado em 2026-10-07: cache **v2**, botões com texto `#07111C`
e abertura standalone real Edge automatizada comprovada. CI da revisão final
`97cee8d917084d255f4d8112cbf9b876c41c2978` aprovado no
[run 37642914180](https://github.com/T-J-Labs/barberhub/actions/runs/37642914180).
Testes locais Chromium, Firefox e WebKit possuem recortes distintos registrados
na revisão final; não certificam Safari real. O indicador “1” mantém 2,7059:1
por decisão explícita, exigindo nova aprovação, medição e regressão visual para
correção futura. Publicação/QA público **adiados para a etapa final**, por decisão
de 2026-10-07, após as integrações com o backend estarem funcionando e validadas
localmente. Ainda não há domínio ou site publicado. QA humano permanece pendente.
[Evidências conferidas, auditoria e dados necessários](TECHNICAL_CLOSURE.md).

Atualização em 2026-10-07: texto escuro sobre sky-500 aprovado pelo usuário,
fallback atualizado e cache v2; nova regressão local de produção passou 19/19
suítes, incluindo axe do fallback sem exceções. CI real Ubuntu passou e publicou
artefato. A repetição posterior no Edge 154.0.4258.62, com janela real e perfil
temporário, passou instalação, abertura standalone no catálogo e desinstalação.
[Comandos e limitações atuais](VALIDATION_HISTORY.md#revisao-final).
As medições e exceções de branco/sky-500 abaixo são registros históricos.

Implementação em 2026-10-06. O catálogo, as contas e as áreas operacionais
continuam demonstrações locais. OpenAPI mantém `paths: {}`; backend, banco,
autenticação e contratos não foram alterados.

## Instalação e identidade

`src/app/manifest.ts` usa `MetadataRoute.Manifest`, `id: "/"`, nome e nome curto
BarberHub, `pt-BR`, `start_url: "/barbearias"`, `scope: "/"` e
`display: "standalone"`. Fundo e tema usam `#07111C`. Não há atalhos, escolha de
papel ou início automático de prévia autenticada.

O manifesto valida o Host contra `BARBERHUB_PUBLIC_HOST`. Outros hosts e tenants
recebem `{}`, sem identidade instalável. O link automático do App Router ainda
existe nesses documentos, mas não fornece um manifesto instalável. Fora de
localhost, somente a porta HTTPS padrão é aceita. Localhost explicitamente
configurado permite portas de QA. X-Forwarded-Host não participa da decisão.

Os PNGs de 192, 512 e Apple 180px derivam do lettering BARBER/HUB em Geist, nas
cores existentes, dividido em duas linhas para o formato quadrado. Não foi
criado símbolo novo. A variante maskable de 512px mantém todo o lettering dentro
do círculo seguro central de 80% do diâmetro. Ícones e tela offline foram
inspecionados visualmente, inclusive em 32/48/64px e máscara circular simulada;
o lettering completo fica pequeno em 32px. Acabamento em máscaras reais de
Android/iOS pendente.
`validation/pwa-icons.cjs` reproduz os PNGs usando a fonte carregada pelo app.

A chamada aparece no catálogo, antes do rodapé, quando `beforeinstallprompt`
está disponível. O prompt só é chamado por clique/teclado da pessoa. Sem evento,
há instruções expansíveis para Safari/iOS, Chromium e outros navegadores, sem
botão inoperante ou promessa de instalação. Standalone e `appinstalled` ocultam
esse bloco. Estado de instalação vive somente em memória.

## Worker, cache e offline

`/pwa-worker.js` é uma rota que gera um script pequeno com a origem autorizada
embutida. Responde 404 em desenvolvimento, com mocks habilitados ou em Host não
autorizado. O registro exige produção, contexto seguro e o domínio principal.
Não substitui um worker diferente já registrado no escopo `/`, incluindo
`public/mockServiceWorker.js` do MSW. Não remove registros de terceiros.

O único cache próprio atual é **`barberhub-pwa-v2`**, contendo exatamente:

| Recurso | Uso |
| --- | --- |
| `/pwa/offline.html` | Documento HTML estático com CSS, marca e ação de retry autossuficientes. |
| `/pwa/icon-192.png` | Favicon do documento offline. |

Não há precache de aplicação, fontes, bundles, páginas, respostas da API,
RSC/prefetch, fixtures, barbearias, agenda, perfil, autenticação ou dados privados.
Os ícones de instalação 512/maskable/Apple são servidos online; não entram nesse
cache. A preparação usa `cache: no-store`, credenciais omitidas e rejeita
redirecionamentos e respostas de erro. Falha de preparação não grava respostas
parciais de rede.

| Requisição | Política do worker |
| --- | --- |
| GET de navegação completa na plataforma | Rede com `cache: no-store`; somente rejeição da rede apresenta o HTML offline. |
| HTTP 403/500 | Status e conteúdo preservados; não viram tela sem conexão. |
| API, autenticação, métodos diferentes de GET | Passam ao navegador/rede sem interceptação, armazenamento, fila ou replay. |
| RSC, `_rsc`, headers de prefetch e `/_next` | Passam sem armazenamento e sem substituição por HTML. |
| Recursos externos/subdomínios | Passam sem interceptação ou cópia de respostas. |
| Recursos da lista offline | Rede; em falha, somente sua cópia previamente preparada. |

Não há IndexedDB, localStorage, mensagens de replay, push, Background Sync ou
repetição automática de operações. Ausência de cache no worker **não substitui
as futuras políticas HTTP para respostas privadas**, nem muda o cache HTTP do
navegador ou o estado transitório do App Router.

O fallback apresenta exatamente:

> Não foi possível conectar ao BarberHub. Agendamentos e alterações precisam de conexão. Nenhuma ação foi enviada.

“Tentar novamente” recarrega apenas a URL atual, preservando busca e contexto.
Não consulta disponibilidade e não reenvia formulário/POST. Páginas de
autenticação não recebem esse fallback. A demonstração não ganha reservas offline.

O aviso de conexão acompanha eventos online/offline, pode ser fechado e não
recarrega nem envia dados. Voltar a ficar online é um sinal do navegador, não
uma garantia do servidor. Um boundary geral oferece recuperação explícita de
carregamento; os boundaries específicos existentes continuam em funcionamento.
Na transição interna de busca efetivamente testada, o Next tentou o RSC,
falhou e fez navegação completa, que recebeu o fallback. O RSC não recebeu HTML.
Não foi forçado um erro real de renderização do boundary geral.

## Ciclo de vida

Sem `skipWaiting`, `clients.claim`, recarga por `controllerchange` ou botão de
atualização forçada. A primeira instalação prepara os recursos; **uma nova
navegação** passa a ser controlada. Uma versão nova fica aguardando as páginas
controladas serem fechadas. Na ativação, remove somente caches antigos com
prefixo `barberhub-pwa-`; não remove caches de MSW ou outros workers.

Para alterar conteúdo offline ou ícones do cache, incrementar
`pwaCacheVersion` em `src/features/pwa/worker.ts`. Nunca ampliar a lista para
dados ou operações. Fechar abas pode descartar edições da aplicação como já
ocorre hoje; o worker não força essa ação.

## Verificação histórica executada — 2026-10-06

Windows, Node 24.21.0, Next 16.3.0 e Microsoft Edge **154.0.4258.53**.
Produção local HTTP em `localhost:3110`, com `BARBERHUB_PUBLIC_HOST=localhost`.
Isso usa a exceção segura do navegador para localhost; não certifica DNS/TLS de
um ambiente publicado. Desenvolvimento existente em `localhost:3000` também
foi usado nas regressões de perfil/ajuda e no bloqueio do worker.

| Grupo | Resultado observado |
| --- | --- |
| Política | 12 grupos: Host/portas, lista exclusiva, exclusão por prefixo, API/POST/RSC/prefetch, falha de preparação, 403/500, ausência de sync/replay. |
| PWA no navegador | 15 grupos: manifesto/ícones, critérios reais de instalação sem erros reportados pelo Edge, hosts recusados, UI de instalação, standalone emulado, rascunho preservado, fallback, primeiro acesso sem preparação, POST/RSC falhando sem fallback, transição de busca, responsividade, modal e zoom/foco. |
| Instalação nativa | Edge aceitou `PWA.install` em perfil temporário e foi desinstalado no final. A API de automação abriu inicialmente em aba; após definir a preferência de apresentação do navegador como standalone no QA, a janela real abriu `/barbearias`, com `display-mode: standalone`, sem chamada de instalação, cookies ou localStorage. Não houve emulação de mídia nessa janela. Aceitar o diálogo nativo manualmente pelo botão continua pendente. |
| Ciclo de vida real | 4 grupos em servidor HTTP isolado: primeira ativação sem claim; versão nova waiting sem recarga ou perda de rascunho; ativação após fechar página limpando somente o prefixo; runtime real preservando outro worker raiz. Usa fonte real do worker, formulário sintético e proxy do app de produção. |
| Regressões de estado | Roteamento (3), autenticação/retorno (62), agendamento (39), meus agendamentos (8 grupos), barbeiro (12), perfil/ajuda (7), superadmin/cadastro (12). |
| Regressões HTTP de produção | Roteamento (15), auth (48), booking (22), appointments (smoke completo), metadados de perfil/ajuda (4). Auth/booking/appointments usam Host `localhost` sem porta, conforme regra existente de produção. A tentativa com Host contendo `:3110` foi rejeitada por essa regra; não é suporte novo a portas nas áreas de conta. |
| Regressões no navegador | Perfil/ajuda: 38 em desenvolvimento; superadmin: 25 e cadastro manual: 20 em produção local. Busca, Voltar, retorno, foco, erros associados e estado em memória preservados. |
| Ferramentas | ESLint, TypeScript e build de produção passaram. |

Revalidação HTTP em 2026-10-06: os comandos originais passavam `3110` como
argumento a suítes que selecionavam a porta por `TEST_PORT`. Portanto, o registro
original de roteamento e metadados não comprovava execução em produção na porta
3110. Os comandos e a configuração foram corrigidos e essas duas suítes foram
reexecutadas: **15 testes de roteamento e 4 de metadados passaram em produção
na porta 3110**, com Host `localhost` e origem pública esperada `https://localhost`.
O servidor de QA foi reiniciado para carregar o build atual após respostas 500
na landing do processo anterior. Não houve alteração na implementação das telas.
O transporte de metadados passou a usar `node:http`, pois o `fetch` deste Node
não enviava o Host sobrescrito na execução local. A configuração tem 4 testes,
incluindo envio efetivo do Host. Registros em `validation/pwa/http-production.tap`.
As combinações incorretas produção/3000 e desenvolvimento/3110 foram recusadas;
registro em `validation/pwa/http-environment-guards.txt`.
Em desenvolvimento na porta 3000, os mesmos 19 testes HTTP passaram;
registro em `validation/pwa/http-development.tap`. ESLint passou nos quatro
arquivos de teste alterados/criados. Esta revisão modifica somente testes,
comandos e documentação; não reexecuta as demais auditorias da entrega.

As 20 rotas de catálogo/cliente/barbeiro/admin/superadmin abriram sem overflow
horizontal em 320/390/768/1440px e com um `main` e um `h1`. No localhost de
produção com porta, as telas que validam conta exibem corretamente o estado
indisponível; suas jornadas completas foram complementadas pelos testes HTTP
sem porta e pelas regressões em desenvolvimento. Navegação entre plataforma e
tenants, query, acesso direto e Voltar foram cobertos pelas regressões existentes.

Evidências novas ficam em `validation/pwa/`, incluindo resultados, oito capturas
de instalação/offline, prévia de ícones reduzidos e resumos de regressão. Testes de interação com
`beforeinstallprompt` e standalone emulado estão identificados como controlados;
não são apresentados como instalação real. A indisponibilidade no primeiro
acesso offline sem preparação foi reproduzida: erro do navegador, sem fallback.

## Acessibilidade e desempenho — medições históricas de 2026-10-06

Correções dirigidas, sem reformulação do Header:

- Nome acessível dos links do catálogo agora inclui “Conhecer barbearia” e o
  estabelecimento, acompanhando o texto visível.
- Drawer da conta usa `dialog` modal nativo com o mesmo layout. Teclado, Tab,
  Escape e retorno ao gatilho foram conferidos.
- Foco global visível em controles. Nova interface possui labels, status,
  headings e áreas de toque; zoom 200% foi conferido em viewport desktop de
  1440px, além das larguras mobile normais. Movimento reduzido mantém o hover
  sem ampliação. Inspeção visual de ícones/telas realizada.
- Geist Mono era pré-carregada e não utilizada: removida. A fonte Geist já
  prevista no design agora é aplicada no body. As imagens públicas já são SVGs
  locais; não foi introduzida biblioteca de PWA ou precache de bundles.

**Leitor de tela real não utilizado.** A inspeção foi DOM/teclado e Lighthouse.
O diagnóstico de contraste permanece: o padrão exigido `sky-500` com texto
branco não atinge o contraste esperado pelo Lighthouse para os botões. As cores
foram preservadas conforme instrução explícita; não alegar conformidade WCAG.

Linha de base medida antes de editar/otimizar, em produção local. Lighthouse
mobile, Edge headless, simulação padrão da ferramenta. Uma execução de linha de
base e três medições após revisões; a tabela e o relatório after mantêm a última:

| Medida | Antes | Depois |
| --- | --- | --- |
| Performance | 96 | 92 |
| Acessibilidade | 96 | 96 |
| FCP | 0,8 s | 0,8 s |
| LCP | 2,6 s | 2,3 s |
| Total Blocking Time | 100 ms | 310 ms |
| CLS | 0 | 0 |
| Speed Index | 2,4 s | 0,9 s |

Não houve ganho consistente de pontuação/CPU nessa amostra; uma pontuação não
certifica aprovação. O diagnóstico de nome acessível foi resolvido; contraste
permanece. Relatórios completos: `validation/pwa-lighthouse-before.json` e
`validation/pwa-lighthouse-after.json`.

Também foram medidos três contextos frios de Edge a 390px, sem throttling e com
SW bloqueado para comparação: transferência mediana **227.145 → 213.061 bytes**;
JS **151.428 → 154.651 bytes**; fontes de duas para uma (remoção de 23.408 bytes
transferidos da Mono). FCP mediano **176 → 384 ms**, sujeito a variação local.
O código interativo da PWA adiciona JS; redução total de transferência não
significa redução de todas as métricas. Resultados em
`validation/pwa-performance-{before,after}.json`. Nenhum SLO foi certificado.

## Comandos reproduzíveis

Na pasta `frontend`, PowerShell:

```powershell
$env:BARBERHUB_PUBLIC_HOST="localhost"
$env:NEXT_PUBLIC_API_MOCKING="disabled"
npm run build
npm run start -- --port 3110
```

Em outro terminal na mesma pasta:

```powershell
npm run lint
npm run typecheck
npm run test:pwa
npm run test:routing
npm run test:auth
npm run test:booking
npm run test:appointments
npm run test:barber
npm run test:profiles
npm run test:superadmin
# Estas duas suítes usam variáveis de ambiente, não argumentos posicionais.
$env:TEST_ENV="production"
$env:TEST_PORT="3110"
$env:TEST_PUBLIC_HOST="localhost"
$env:TEST_PROTOCOL="https:"
npm run test:routing:http
node --test tests/profile-help-metadata-http.test.mjs
# Os scripts abaixo aceitam porta e Host como argumentos posicionais.
npm run test:auth:http -- 3110 localhost
npm run test:booking:http -- 3110 localhost
npm run test:appointments:http -- 3110 localhost
```

`TEST_PORT` seleciona a conexão HTTP em `127.0.0.1`. `TEST_ENV` distingue
desenvolvimento de produção: desenvolvimento envia Host `localhost:3000` e
espera links HTTP; produção envia Host `localhost` e espera links HTTPS, sem
confundir a porta local de QA com a autoridade pública. Isso não valida TLS.
As duas suítes verificam `/pwa-worker.js` antes dos casos: 404 em desenvolvimento,
JavaScript com status 200 em produção, exigindo domínio configurado e mocks
desabilitados. Porta errada ou configuração incompatível interrompe a suíte.
Para repetir essas suítes no servidor de desenvolvimento, use:

```powershell
$env:TEST_ENV="development"
$env:TEST_PORT="3000"
$env:TEST_PUBLIC_HOST="localhost"
$env:TEST_PROTOCOL="http:"
npm run test:routing:http
node --test tests/profile-help-metadata-http.test.mjs
```

Os scripts de navegador requerem Playwright acessível e Edge instalado. No
ambiente Codex testado, o módulo veio do runtime fornecido pela aplicação,
sem alteração de dependências do produto. Configure `PLAYWRIGHT_MODULE` com o
caminho absoluto do módulo, ou disponibilize `playwright` no ambiente Node.

```powershell
$env:PLAYWRIGHT_MODULE="C:\Users\Felipe Tajima\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\playwright"
$env:PLAYWRIGHT_CHANNEL="msedge"
npm run test:pwa:browser -- 3110
npm run test:pwa:lifecycle -- 3110
$env:PWA_HEADLESS="false"
node ../validation/pwa-install.cjs 3110
node ../validation/pwa-performance.cjs 3110 after
node ../validation/pwa-icons.cjs 3110
npm run test:superadmin:browser -- 3110
npm run test:superadmin:registration:browser -- 3110
# Perfil/ajuda completo: servidor de desenvolvimento já ativo na porta 3000
npm run test:profiles:browser
$env:CHROME_PATH="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
npx --yes lighthouse http://localhost:3110/barbearias --output=json --output-path=../validation/pwa-lighthouse-after.json --chrome-flags="--headless --no-first-run" --only-categories=performance,accessibility --quiet
```

A execução nativa abre um navegador de QA minimizado com perfil temporário e
desinstala o app desse perfil ao terminar. Perfis temporários de automação não
são versionados. O runtime é específico desta máquina; adapte o caminho para
outro ambiente. A geração de ícones não faz parte do build normal.

## Limitações da rodada histórica de 2026-10-06

- Sem validação em Android/iOS reais, Safari/Firefox, domínio HTTPS publicado,
  leitor de tela real ou instalação manual pela UI nativa do navegador.
- Sem preparação online anterior, cache removido/evicto ou worker indisponível,
  não é garantida a tela offline. Um worker conflitante não é substituído.
- A nova fronteira de erro geral não foi provocada por erro real de renderização.
- Diagnóstico de contraste mantém a exceção explícita dos botões aprovados.
- Os dados e ações continuam demonstrativos e transitórios; instalar não cria
  sessão, reserva, permissão, persistência ou disponibilidade real.

## Arquivos da entrega

Criados:

- `frontend/src/app/manifest.ts`, `pwa-worker.js/route.ts` e `error.tsx`.
- `frontend/src/features/pwa/policy.ts`, `worker.ts`,
  `components/PwaRuntime.tsx` e `components/LoadRecovery.tsx`.
- `frontend/public/pwa/offline.html`, `icon-192.png`, `icon-512.png`,
  `maskable-512.png` e `apple-180.png`.
- `validation/pwa-{policy,browser,lifecycle,install,performance,icons}.cjs`,
  os relatórios before/after e `validation/pwa/` com resultados/capturas.
- Este `docs/frontend/PWA.md`.

Alterados: `frontend/src/app/layout.tsx`, `globals.css`,
`features/barbershop-catalog/components/{CatalogView,BarbershopCard}.tsx`,
`features/navigation/components/authenticated/AuthenticatedMobileMenu.tsx`,
`frontend/package.json`, `README.md` e `docs/frontend/FRONTEND_ROADMAP.md`.

Referências de implementação:
[manifesto no App Router](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest),
[instalação após ação da pessoa](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeinstallprompt_event)
e [ciclo de vida do worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

## Regressão histórica — 2026-10-06 e início de 2026-10-07

Instalação limpa isolada e novo build Next 16.3.8 passaram. `test:qa:production`
na porta própria 3240 passou as 19 suítes, incluindo 15 grupos de PWA e quatro
de lifecycle. Worker real em perfil temporário localhost; navegação/domínios
com Host lógico sobre loopback não certificam publicação/TLS/DNS.

Instalação adicional por CDP em perfis temporários: Chrome 154.0.8037.98 passou
instalação, abertura real standalone em `/barbearias`, ausência de sessão/dados
locais e desinstalação. Preferência standalone foi definida pelo QA. Edge
154.0.4258.53 instalou/desinstalou, mas a abertura excedeu o timeout; não se
alega janela standalone validada nesse navegador nesta rodada. Nenhum destes
testes representa instalação manual humana ou teste Android/iOS.

O CI inclui a regressão de worker/lifecycle no Chromium gerenciado; instalação
nativa CDP fica fora do gate pelas limitações observadas. Workflow GitHub ainda
não executado. Evidências, comandos e pendências em
[FRONTEND_CONSOLIDATION.md](VALIDATION_HISTORY.md#consolidacao-inicial), preservando resultados
históricos deste documento.

Na reexecução estável com o executor final, Chromium gerenciado 145.0.7632.6
completo passou novamente 15 grupos de PWA e quatro de lifecycle na porta
3252, usando o mesmo build novo. O diagnóstico encontrou limitação da emulação
`context.setOffline`: fetch do worker após reload ainda alcançava o servidor.
O teste complementa a emulação bloqueando essas requisições de rede e registra
URL/método/origem. Worker e cache são reais; nenhum HTML offline é injetado e
nenhuma fonte da PWA foi modificada. Isso continua sendo emulação local de rede,
sem certificar desconexão física ou instalação manual humana.
