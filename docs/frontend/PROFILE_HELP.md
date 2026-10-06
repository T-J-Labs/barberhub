# Perfil e ajuda demonstrativos

Entrega implementada e validada localmente em 2026-10-05, conforme seção 7 de
[FRONTEND_ROADMAP.md](FRONTEND_ROADMAP.md). As quatro telas são demonstrações
públicas; layouts e headers não autenticam nem autorizam usuários.

## Rotas e apresentação

| Papel | Perfil | Ajuda | Visual |
| --- | --- | --- | --- |
| Cliente | `/cliente/perfil` | `/cliente/ajuda` | ClientHeader e paleta pública, ação `sky-500` com texto branco. |
| Barbeiro | `/barbeiro/perfil` | `/barbeiro/ajuda` | BarberHeader e paleta operacional existente. |

Os menus têm destinos de Perfil e Ajuda. No barbeiro, o controle Perfil abre
diretamente a página. No cliente, o menu continua aparecendo somente quando a
prévia do header já estiver ativa; acesso direto ao perfil não ativa essa prévia.

As quatro páginas possuem títulos específicos por papel e `robots: noindex,
nofollow`, sem alterar a indexação da landing ou do catálogo. Essa política
orienta buscadores; não substitui autenticação ou autorização.

O único campo editável é nome de exibição. O formulário separa rascunho e valor
aplicado, aceita acentos e espaços internos, remove espaços nas extremidades e
rejeita vazio/espaços. Erros têm `role="alert"`, associação ao input e foco no
campo, preservando rascunho e último nome aplicado. Aplicar, cancelar e restaurar
produzem mensagens em região de status. Nomes longos quebram linha na apresentação.

Cada layout de área possui seu próprio provider React. Navegação interna conserva
o valor aplicado e descarta rascunhos não aplicados ao deixar o formulário.
Recarga ou saída da área restaura o nome inicial; não há armazenamento persistente.
Sair da prévia do header do cliente também restaura seu exemplo local. Se a prévia
já estiver ativa, seu header exibe o nome aplicado. No barbeiro, início, agenda,
histórico e detalhes usam o nome somente como apresentação: IDs, titularidade,
profissional da fixture e estados de atendimentos não são alterados pelo perfil.

## Ajuda por tarefa

- Cliente: catálogo, perfil público e wizard no subdomínio, próximas visitas,
  detalhes e histórico; cancelamento local e prévia de reagendamento. Explica que
  wizard e lista global usam dados independentes.
- Barbeiro: início, agenda e histórico; detalhes, simulação de conclusão/falta,
  bloqueio/desbloqueio e restauração dos exemplos. Explica o profissional fictício
  e a ausência de autorização real.
- Ambos: edição/restauração do nome, perda das alterações, Google indisponível e
  recuperação pelo próprio Google, sem senha local ou canais de suporte inventados.

A ajuda do cliente aceita `barbearia` somente como contexto de navegação de uma
fixture pública conhecida, com Host confiável. Exemplo de desenvolvimento:
`/cliente/ajuda?barbearia=demo-esquina`. Reutiliza helpers de perfil público,
booking e autenticação; retorno de login/cadastro é a raiz canônica do subdomínio.
Ausência, repetição, chave desconhecida ou URL arbitrária levam ao catálogo.
Host inválido não gera links de acesso ou de subdomínio; cabeçalhos encaminhados
não autorizam contexto. Isso não seleciona tenant privado ou concede permissões.

## Arquivos da entrega

- Quatro `page.tsx` em `frontend/src/app/(private)/{cliente,barbeiro}/{perfil,ajuda}`.
- `frontend/src/features/demo-profile/name.ts` e componentes
  `DemoProfileProvider`, `DemoProfileForm`, `DemoProfilePage`, `AppliedDemoName`.
- `frontend/src/features/role-help/navigation.ts` e `components/RoleHelpPage.tsx`.
- Layouts de cliente/barbeiro, configs `client-navigation`/`barber-navigation`,
  `ClientHeader`, `BarberHeader` e prop opcional `profileHref` de
  `AuthenticatedHeader`, mantendo o comportamento administrativo padrão.
- `BarberDemoShell` e `BarberDemoView`: nome aplicado somente na apresentação.
- Compartilhados: `SettingsShell`, `SettingsSection`, `SettingsField`, `HelpShell`
  e `HelpDestination`. Variante pública usa variáveis CSS herdadas; valores
  administrativos padrão e componentes de página administrativos foram preservados.
- `frontend/package.json`, `validation/profile-help-state.cjs`,
  `validation/profile-help-browser.cjs`, resultados JSON e capturas `profile-*`/`help-*`.
- README, FRONTEND_ROADMAP, CLIENT_EXPERIENCE, CLIENT_AUTH e este registro.

## Comandos e resultados executados

Na pasta `frontend`, com o servidor de desenvolvimento existente em `localhost:3000`:

```powershell
npm run test:profiles
npm run test:profiles:browser
npm run test:routing
npm run test:auth
npm run test:booking
npm run test:appointments
npm run test:barber
npm run test:routing:http
npm run test:auth:http
npm run test:booking:http -- 3000
npm run test:appointments:http
npm run lint
npm run typecheck
npm --ignore-scripts run build
```

O teste de navegador requer Playwright instalado e navegador disponível. Nesta
máquina foi usada a dependência empacotada, sem instalar pacotes no projeto:

```powershell
$env:PLAYWRIGHT_MODULE='C:/Users/Felipe Tajima/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
$env:PLAYWRIGHT_CHANNEL='msedge'
npm run test:profiles:browser
```

- 7 grupos de regras de nome/contexto aprovados.
- 38 grupos de interação/DOM no Edge headless aprovados, sem erros de página:
  quatro telas, apply/cancel/restore, vazio/espaços/acentos/nomes longos,
  navegação interna, recarga, saída, independência, visitante direto, prévia ativa,
  nome na agenda, perguntas e atalhos por mouse/teclado, subdomínio e acesso com
  contexto validado, Host inválido e contexto repetido, e defaults administrativos.
- Regressões de estado: 3 testes de host, 62 verificações de auth, 39 de booking,
  8 grupos de agendamentos e 12 de barbeiro aprovados.
- Regressões HTTP: 15 testes de roteamento, 48 de auth, 22 de booking e o grupo
  de agendamentos aprovados.
- ESLint, TypeScript e build Turbopack aprovados. `--ignore-scripts` evita o
  prebuild de Orval para não regravar arquivos gerados nesta entrega.

Evidências: `validation/profile-help-browser-results.json`, capturas das quatro
telas em 320, 390, 768 e 1440px e perfis com nome normal em 390px. Inspeção visual
das imagens e inspeção de DOM confirmaram hierarquia, textos legíveis, nomes
aplicados sem truncamento e ausência de rolagem horizontal. Erros associados,
foco e regiões de anúncio foram inspecionados no DOM. **Leitor de tela real não
foi utilizado.** Os testes locais não certificam DNS/TLS públicos ou autorização.

## Verificação do acabamento de metadados

Após o ajuste dos títulos e da política de indexação, passaram os quatro testes
HTTP de `node --test tests/profile-help-metadata-http.test.mjs` (na pasta
`frontend`, com servidor ativo na porta 3000), os 7 grupos de `test:profiles`,
ESLint e TypeScript. Os testes HTTP verificam título renderizado, aplicação
única do sufixo BarberHub e `noindex, nofollow` nas quatro rotas.

## Integração pendente

OpenAPI permanece com `paths: {}`. Não há OAuth, sessão, edição de conta Google,
consulta/edição persistida de perfil, vínculos profissionais, autorização ou
reservas reais. Antes da integração, acordar contratos de identidade autenticada,
perfil, vínculos, permissões, validação e erros. Backend, banco e contrato não
foram alterados nesta entrega; fixtures de agenda/agendamentos mantêm identidade
e titularidade próprias. Registros anteriores de QA permanecem históricos.
