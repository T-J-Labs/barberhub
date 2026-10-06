# Revisão de headers — 2026-10-06

Implementada após pedido explícito, orientada pela skill `interface-design`, ADR,
roadmap e regras de autenticação existentes. A landing institucional é a decisão
visual vigente e substitui a referência anterior ao header do barbeiro. Backend,
banco, contratos, proxy, domínios e helpers de retorno não foram alterados.

## Diagnóstico inicial e evidências

Inspeção de código e reprodução no Edge antes de editar, no servidor de
desenvolvimento já ativo em `localhost:3000`. Capturas em
`validation/headers/before/`; medições e interações em `before/results.json`.

| Contexto | Estado reproduzido | Decisão |
| --- | --- | --- |
| Landing | Header de 81px com marca centralizada, menu mobile esquerdo, drawer, âncoras e ações. Abrir/Escape funcionavam. | Preservar aparência e conteúdo; extrair estrutura acessível. |
| Catálogo/perfil/agendamento | Usam ClientHeader visitante. Header de 121px em 320px: marca numa linha, acesso na seguinte. Sem overflow, mas diferente da landing; Entrar tinha outro estilo. | Grade mobile da landing; acesso no rodapé do drawer. |
| Login/cadastro | Mesmo header visitante, com destino da marca intencionalmente diferente (landing) e contexto de acesso. | Manter um header e os destinos; aplicar estrutura pública. |
| Cliente em prévia | Dropdown `details`, sem comportamento modal. Prévia → saída → reinício funcionava. | Drawer modal com quatro destinos existentes, identificação demonstrativa e saída local. |
| Barbeiro/superadmin | Header de 65px; menu encolhia para 24px de largura em 320px e encostava na marca. Drawer com outro backdrop, bordas e densidade. | Controles fixos de 44px, marca responsiva e estrutura comum. |
| Admin | Controles já tinham 44px e marca menor em 320px; sidebar desktop e breakpoint 1200px eram variações intencionais. | Harmonizar controles/drawer e preservar sidebar, rotas e posicionamento estático. |

Screenshots complementam as medições; a interação inicial foi executada por
mouse/teclado (abrir, Escape e ciclo da prévia). Não foram usados como prova
isolada de funcionamento. O script `headers-baseline.cjs` registra a composição
anterior; seu trecho de dropdown corresponde ao código antes desta revisão.

## Implementação e compatibilidade

- `frontend/src/features/navigation/components/MobileDrawer.tsx`: diálogo nativo
  em top layer, fundo inerte, foco inicial no fechar, ciclo Tab/Shift+Tab, Escape,
  backdrop e restauração de foco/overflow no fechamento e desmontagem. Mudança
  de pathname fecha o menu; links fecham explicitamente, inclusive a marca quando
  o destino já está aberto. Drawer esquerdo de 85%, máximo 384px, borda sutil,
  backdrop da landing, conteúdo rolável e rodapé alcançável em pouca altura.
- `navigation/components/styles.ts`: controles de 44px, superfície/borda e grade
  pública. A cor original do controle de fechar da landing também foi preservada.
- `HeaderBrand.tsx`: destino configurável, foco visível e callback de navegação.
- `public/PublicHeader.tsx` e `PublicMobileMenu.tsx`: mesma aparência da landing,
  âncoras, estados ativos, sticky, container e ações. Apenas controle/modal extraídos.
- `authenticated/ClientHeader.tsx`: visitante mantém Entrar/Criar conta no desktop
  com `publicLoginClass`/`catalogActionClass`; abaixo de 1024px ficam no drawer.
  A prévia mantém Barbearias, Meus agendamentos, Perfil e Ajuda, nome completo no
  drawer, indicação de demonstração e saída local. Após o ajuste posterior,
  a barra usa os mesmos controles de Notificações/Perfil do barbeiro.
  Estados visitante/cliente/saindo e restauração de perfil
  foram preservados; o mobile retorna foco ao menu e o desktop a Entrar após sair.
- `authenticated/AuthenticatedHeader.tsx` e `AuthenticatedMobileMenu.tsx`:
  barbeiro, admin e superadmin conservam composições, contexto, Perfil,
  Notificações demonstrativas e saída para a landing. Sem novas funcionalidades.
  Menu/Perfil/Notificações têm 44px. Marca usa tamanho responsivo para conservar
  os controles operacionais em 320px. Admin não recebe sticky.
- `authenticated/NavigationItems.tsx`: aparência do drawer optativa; a aparência
  padrão da sidebar foi mantida. `AdminSidebar.tsx`, configurações por papel,
  `BarberHeader`, `AdminHeader` e `SuperAdminHeader` não precisaram de alterações.
- `AuthScreen` e layouts não precisaram de alterações: já compunham um único
  header. Destinos da logo continuam landing no acesso, catálogo no contexto
  público/cliente e destino operacional anterior nas demais áreas. O drawer
  usa o mesmo destino da composição.

Páginas e composições de papel continuam Server Components onde já eram;
interação fica nos headers/drawer Client Components. Não existe componente com
condicionais para todos os papéis. Nenhum destino indisponível do superadmin foi
transformado em link; Minhas barbearias não foi adicionado.

## QA executado

Windows, Node 24.21.0, Next 16.3.0, Edge 154.0.4258.53, Playwright do runtime
disponível (sem instalar dependência de produto). Navegador headless, servidor
de desenvolvimento local na porta 3000, tenants `demo-esquina.localhost` e testes
HTTP também com Host simulado. Build de produção gerado, sem QA desta revisão
num servidor de produção. Não foi publicado.

| Verificação | Resultado |
| --- | --- |
| ESLint, TypeScript e build Turbopack | Passaram, sem avisos de ESLint; 29 páginas geradas. |
| `test:routing` / `test:auth` / `test:profiles` | 7 testes, 62 verificações e 7 grupos passaram. |
| `test:routing:http` / `test:auth:http` / `test:booking:http` | 15, 48 e 22 verificações passaram. |
| `test:appointments:http` | SSR, amostras, avisos, redirecionamentos e Host seguro passaram. |
| `test:profiles:browser` | 38 grupos passaram; teste adaptado ao drawer, incluindo nome longo, estado local e perfil/ajuda por papel. |
| `test:superadmin:browser` | 27 verificações passaram: busca, navegação, suspensão local, diálogos, teclado e responsividade. |
| `test:headers:browser` | 158 verificações passaram; nenhum erro JavaScript. |
| `test:headers:zoom` | Dez famílias passaram em zoom nativo 200%. |
| `test:headers:visual` | Zero diferença de pixels no header fechado da landing (81px) em 320/390/768/1440px e no painel do drawer aberto por mouse. |

Matriz de header: landing, catálogo, perfil público, agendamento, login, cadastro,
cliente visitante, barbeiro, admin e superadmin em 320/390/768/1440px, mais
639/640, 1023/1024 e 1199/1200px. Cada família teve verificações de tamanho mínimo,
ausência de sobreposição/overflow, menu por mouse/teclado, foco contido, tentativa
de focar o fundo, Escape, backdrop, fechar, restauração do overflow anterior,
altura 240px, resize e destino da logo no header e drawer. Admin devolve foco à
sidebar quando seu menu deixa de ser necessário; cliente/barbeiro/superadmin
mantêm o drawer operacional no desktop.

Também executados: toque emulado, movimento reduzido, âncoras ativas por clique e
scroll, subdomínio → acesso → escolha dos três perfis → retorno canônico,
Google desabilitado, quatro destinos do cliente, edição de nome com 300
caracteres em todas as larguras, voltar do navegador com menu aberto,
saída/reinício/recarga da prévia, todos os destinos operacionais e opções
indisponíveis sem links. Ausência de cookies/sessão e localStorage verificada
nas regressões da demonstração. O QA identificou e corrigiu o menu que permanecia
aberto ao clicar na marca para a própria rota; ajustes nos seletores/esperas
dos testes também foram necessários. Os resultados finais refletem a execução
completa aprovada, não as tentativas parciais.

Zoom 200% configurado nas preferências de um perfil temporário do navegador,
sem `style.zoom`, em janela de 1440px: viewport CSS observado de 707px, DPR 2,
visualViewport.scale 1. O teste exige essas medidas antes de avaliar a interface.
A preferência de zoom usa o [modelo de zoom do Chromium](https://chromium.googlesource.com/chromium/src/+/lkgr/chrome/browser/ui/zoom/chrome_zoom_level_prefs.cc).

Artefatos desta revisão ficam em `validation/headers/`: `before`, `after`,
`zoom`, `profile-regression`, `superadmin-regression` e
`landing-visual-results.json`. Artefatos históricos fora desse diretório foram
preservados. Capturas abertas e fechadas foram inspecionadas visualmente, além
das verificações de interação/DOM.

## Reproduzir

Com o servidor de desenvolvimento ativo em 3000, na pasta `frontend`:

```powershell
# Playwright resolvível normalmente ou apontado ao runtime instalado:
$env:PLAYWRIGHT_MODULE='<caminho-do-modulo-playwright>'
$env:PLAYWRIGHT_CHANNEL='msedge'
$env:PROFILE_QA_OUTPUT='../validation/headers/profile-regression'
npm run lint
npm run typecheck
npm run test:routing
npm run test:auth
npm run test:profiles
npm run test:routing:http
npm run test:auth:http
npm run test:booking:http -- 3000
npm run test:appointments:http
npm run test:profiles:browser -- 3000
npm run test:superadmin:browser -- 3000
npm run test:headers:browser -- 3000
npm run test:headers:zoom -- 3000
npm run test:headers:visual
npm run build
```

`headers:visual` compara com as capturas iniciais desta revisão; depende de
dimensões e renderização de fonte equivalentes. `headers:zoom` usa perfil
temporário, sem mudar as preferências do navegador pessoal. A instalação
nativa de PWA não é revalidada por estes comandos.

## Limitações e documentação

Não executados: leitor de tela real, dispositivos Android/iOS, Safari/Firefox,
DNS/TLS/HTTPS publicado ou fluxo Google real. Toque é emulado; resultados locais
não certificam todos os browsers/dispositivos nem conformidade WCAG. O contraste
azul/branco previamente registrado permanece, conforme padrão aprovado.
OAuth, sessão, autorização, logout, notificações, reservas e persistência reais
continuam pendentes de contratos; OpenAPI mantém `paths: {}`.

Roadmap seção 10, README, AGENTS, CLIENT_EXPERIENCE, CLIENT_AUTH, PROFILE_HELP,
BARBER_DEMO e docs/design/README foram alinhados; os padrões foram registrados
em `.interface-design/system.md`. Não foram sobrescritas as demais alterações
documentais que já existiam no workspace.

## Ajuste posterior — header do cliente e catálogo visitante

Por solicitação específica, a barra da prévia do cliente agora usa o mesmo
layout do barbeiro, inclusive Notificações e Perfil à direita em mobile e
desktop. `HeaderAccountActions` reutiliza os controles e o painel vazio já
existentes no barbeiro; cada composição fornece seu destino de Perfil. Cliente
abre `/cliente/perfil`; o sino informa que é uma demonstração sem sessão.
O nome e a identificação da prévia permanecem no drawer. Saída e estado local
continuam preservados; não há notificações, login ou autorização reais.

Somente `/barbearias` em estado visitante centraliza Entrar/Criar conta na área
disponível do drawer mobile. `PublicHeaderRoute` sinaliza esse contexto ao
`ClientHeader`, que aplica a opção visual `footerPlacement="center"` ao
`MobileDrawer` apenas quando visitante. A prévia no mesmo catálogo mantém o
rodapé, assim como login, cadastro, perfil público, agendamento e área do cliente.
As ações de acesso desktop permanecem na posição anterior.

Arquivos desse ajuste: `HeaderAccountActions.tsx`, `ClientHeader.tsx`,
`AuthenticatedHeader.tsx`, `navigation/components/styles.ts`, `PublicHeaderRoute.tsx`
e `MobileDrawer.tsx`; regressões em `headers-browser.cjs` e
`profile-help-browser.cjs`. A extração preserva conteúdo/comportamento do
barbeiro, admin e superadmin. Documentação de autenticação, perfil, roadmap e
padrões compartilhados foi alinhada. Evidências novas ficam separadas em
`validation/headers/client-adjustment/`, preservando os resultados anteriores.

Validação deste ajuste em Windows/Edge 154 e desenvolvimento local na porta
3000: lint, TypeScript e build passaram; 62 verificações de autenticação/retorno,
7 de roteamento, 160 de headers no navegador e 38 de perfil/ajuda passaram.
O teste compara dimensões/posições dos controles do cliente e barbeiro em
320/390/768/1440px, verifica abrir Notificações por teclado, Escape/retorno de
foco, navegação pelo atalho Perfil e saída local. Confirma acesso centralizado
somente no catálogo visitante, rodapé nos demais contextos e na prévia do
próprio catálogo. Os testes de prévia foram ajustados para selecionar Perfil
no drawer, pois agora também existe o atalho na barra. Sem erros JavaScript.
Leitor de tela, aparelhos reais e novas execuções de zoom nativo/produção não
foram realizados neste ajuste; os resultados anteriores continuam históricos.

Para reproduzir preservando as evidências anteriores, na pasta `frontend`,
com o mesmo Playwright/Edge e servidor configurados acima:

```powershell
$env:HEADER_QA_OUTPUT='../validation/headers/client-adjustment'
$env:PROFILE_QA_OUTPUT='../validation/headers/client-adjustment/profile-regression'
npm run test:headers:browser -- 3000
npm run test:profiles:browser -- 3000
```

### Correção da separação de Perfil e Ajuda

O drawer do cliente mantém Barbearias e Meus agendamentos no bloco principal.
Perfil e Ajuda ficam no rodapé com divisor, acima da saída local, seguindo o
menu do barbeiro. Destinos, atalhos da barra e a centralização exclusiva do
catálogo visitante permanecem preservados. A regressão existente em
`headers-browser.cjs` passa a conferir os dois grupos separadamente.

Nesta correção, lint e TypeScript passaram. Uma verificação dirigida no
Edge 154, em desenvolvimento local na porta 3000, passou em nove cenários:
grupos, divisor, rolagem e Escape/retorno de foco em 320×568, 390×844, 768×844,
1440×900 e 320×240; navegação por Perfil e Ajuda; e posição de acesso visitante
no catálogo e login. Não houve erros JavaScript. Evidências em
`validation/headers/client-grouping/`. Build e suíte completa não foram
reexecutados nesta correção; as execuções acima são históricas.
