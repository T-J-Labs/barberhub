# BarberHub

Acompanhamento de 2026-10-07: ambiente pessoal atualizado para o lock aprovado;
botões públicos mantêm `sky-500` com texto escuro, conforme decisão explícita.
[Execuções de CI, regressões e pendências atuais](docs/frontend/VALIDATION_HISTORY.md#acompanhamento).

SaaS multi-tenant para gestão e agendamento de barbearias.

O BarberHub foi concebido para ajudar pequenas e médias barbearias a divulgar
seus serviços, organizar a agenda dos profissionais e receber agendamentos
online. A aplicação prioriza dispositivos móveis, baixo custo operacional e o
isolamento seguro dos dados de cada estabelecimento.

> [!IMPORTANT]
> O projeto está em desenvolvimento. O contrato da API ainda não possui
> endpoints aprovados, portanto parte das funcionalidades descritas neste
> documento representa o escopo planejado para o MVP.

## Problema e proposta

### Estado atual do frontend — 2026-10-07

As seis entregas iniciais estão implementadas como demonstrações locais:
agendamento, meus agendamentos, área do barbeiro, perfil/ajuda, superadmin básico
e PWA. Também existem Minhas barbearias, onboarding do proprietário, ajuda e
cadastro manual do superadmin. Landing, catálogo, perfis públicos e interfaces
administrativas estão disponíveis. [Entregas e limites](docs/frontend/FRONTEND_ROADMAP.md).

Google, sessão, autorização, persistência, disponibilidade e reservas reais
continuam dependentes de contratos e backend. Simulações não criam vínculos,
contas, tenants ou publicação. O vínculo real exige primeiro agendamento real
confirmado; liberação do estabelecimento exige configuração mínima e compra
confirmada ou liberação explícita. [ADR](docs/architecture/ADR.md),
[onboarding](docs/frontend/OWNER_ONBOARDING.md) e
[superadmin](docs/frontend/SUPERADMIN_DEMO.md).

Headers seguem a landing, com drawer compartilhado e sidebar desktop admin
preservada. [Navegação e revisão](docs/frontend/HEADERS_REVIEW.md).
Ambiente pessoal: Next 16.3.8/Axios 1.20.0. Instalação limpa isolada, build e
produção local passaram; CI da revisão de código
`97cee8d917084d255f4d8112cbf9b876c41c2978` aprovado nos dois jobs:
[run 37642914180](https://github.com/T-J-Labs/barberhub/actions/runs/37642914180).
Testes locais Chromium/Firefox/WebKit e Edge standalone automatizado estão
comprovados nos recortes registrados. WebKit não equivale a Safari real.
[Estado técnico, auditorias e limites](docs/frontend/TECHNICAL_CLOSURE.md),
[QA humano pendente](docs/frontend/QA_ACCESSIBILITY.md) e
[histórico de execuções](docs/frontend/VALIDATION_HISTORY.md).

Por decisão de 2026-10-07, hospedagem na internet e validação pública ficam
para depois das integrações com o backend estarem funcionando e validadas
localmente. Esta ordem não autoriza iniciar integração ou publicar agora.

Muitas barbearias ainda controlam horários por papel ou por conversas dispersas
no WhatsApp. Isso dificulta a organização da equipe, aumenta a ocorrência de
conflitos e faltas e limita a presença digital do estabelecimento.

O BarberHub busca reunir em uma única plataforma:

- página institucional de cada barbearia;
- catálogo de serviços e profissionais;
- agendamento e controle de horários;
- acompanhamento de atendimentos e faltas;
- administração isolada de diferentes barbearias.

## Preço aprovado e configuração demonstrativa — 2026-10-07

A landing apresenta um único plano de **R$ 40/mês por barbearia**, com perfil
público, serviços, equipe, funcionamento, agenda e agendamentos identificados
como funcionalidades previstas para o MVP. **Contratação ainda indisponível**:
preço definido não significa MVP integrado, checkout ou assinatura disponível.
O menu **Preço** leva a `/#preco`. **Experimentar configuração** abre
`/onboarding/barbearia`, uma demonstração em memória que não contrata plano,
cria conta ou estabelecimento, concede acesso nem publica barbearia.
[Wireframes, implementação, verificações e limites](docs/design/README.md#preço-aprovado--2026-10-07).

## Landing institucional revisada — 2026-10-07

A landing institucional foi redesenhada em 2026-10-07 a partir da proposta v2
aprovada: hero com agenda real, apresentações distintas por seção e capturas
responsivas em WebP sem perda, com versões DPR 1/2. Catálogo, acesso e áreas
operacionais mantêm sua identidade. [Implementação, verificações e limites](docs/frontend/INSTITUTIONAL_LANDING.md).

## Funcionalidades planejadas para o MVP

- Catálogo público de barbearias com busca por nome, cidade ou bairro
- Conta única do cliente para agendar em diferentes estabelecimentos
- Área pessoal com os próprios agendamentos identificados por barbearia
- Site institucional personalizado para cada barbearia
- Cadastro de serviços e barbeiros
- Configuração de jornadas, folgas e bloqueios de horário
- Agendamento, reagendamento e cancelamento
- Prevenção de conflitos de agenda
- Registro de atendimentos, cancelamentos e faltas
- Indicadores de confiabilidade dos clientes
- Controle de acesso por papéis (RBAC)
- Links de WhatsApp com mensagens pré-preenchidas

## Tecnologias

### Frontend

- Next.js 16 com App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Orval para geração do cliente da API
- MSW para simulação da API

### Backend

- Java 25
- Spring Boot 4
- Spring Security
- Spring Data JPA
- PostgreSQL
- Maven Wrapper

## Arquitetura

O BarberHub utiliza uma arquitetura SaaS multi-tenant com banco de dados e
schema compartilhados. Os recursos pertencentes a uma barbearia são associados
a um `tenant_id`, que deve limitar as operações privadas de cada estabelecimento.
A identidade do cliente é global; seus perfis locais, agendamentos e reputação
permanecem isolados por barbearia. O cliente pode consultar suas próprias reservas
em diferentes estabelecimentos, sem permitir acesso cruzado entre barbearias.

O backend segue o modelo de monólito modular orientado a funcionalidades. O
frontend e o backend se comunicam exclusivamente por uma API REST, com rotas
versionadas pelo prefixo `/api/v1`.

Em rotas públicas de um estabelecimento, o tenant é identificado pelo header
`X-Tenant-Subdomain`. O catálogo público tem escopo global. Em rotas privadas
administrativas, o contexto do tenant deverá ser obtido a partir da identidade
autenticada. Em operações do cliente, o backend deve resolver o contexto dos
recursos e validar a titularidade; um tenant informado pela interface nunca
constitui autorização de acesso.

As decisões e restrições arquiteturais estão documentadas em
[docs/architecture/ADR.md](docs/architecture/ADR.md).

## Estrutura do projeto

```text
barberhub/
├── backend/                  # API Java com Spring Boot
├── frontend/                 # Aplicação Next.js e TypeScript
├── docs/
│   ├── api/                  # Contrato e processo OpenAPI
│   ├── architecture/         # Decisões arquiteturais
│   ├── design/               # Referências visuais
│   └── frontend/             # Jornadas, estado atual e histórico de validação
├── validation/               # Executores, ferramentas e evidências de QA
├── AGENTS.md                 # Orientações para agentes de IA
├── LICENSE
└── README.md
```

[Organização da validação e mapa das capturas compartilhadas](validation/README.md).

## Executando o frontend

### Pré-requisitos

- Node.js compatível com o Next.js 16
- npm

Ambiente pessoal conferido em 2026-10-07: Node 24.21.0, npm 11.19.0,
Next 16.3.8 e Axios 1.20.0. Novas auditorias: produção sem alertas;
cinco altos na cadeia de lint permanecem como pendência externa sem correção
compatível identificada. Pacotes e recomendações em
[TECHNICAL_CLOSURE.md](docs/frontend/TECHNICAL_CLOSURE.md).

### Instalação

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

O frontend estará disponível em [http://localhost:3000](http://localhost:3000).

### Comandos úteis

```bash
npm run dev           # Inicia o servidor de desenvolvimento
npm run lint          # Executa o ESLint
npm run typecheck     # Verifica os tipos TypeScript
npm run test:qa:local # Regras e HTTP; configurar TEST_SERVER/TEST_ENV/TEST_PORT
npm run test:qa:browser # Jornadas, headers, zoom e axe; ferramentas de QA separadas
npm run test:qa:production # Regressões e PWA; exige build e TEST_ENV=production
npm run test:routing  # Verifica resolução de hosts e geração de links
npm run test:routing:http # Verifica rotas com o servidor local ativo na porta 3000
npm run test:auth     # Verifica domínio, perfis e retorno seguro da autenticação
npm run test:auth:http # Verifica a interface com servidor local ativo na porta 3000
npm run test:booking  # Verifica seleções, conflito e fixtures demonstrativas
npm run test:booking:http -- 3000 # Verifica entradas e contexto do agendamento
npm run test:barbershops # Verifica vínculos fictícios, destinos e filtro combinado
npm run test:barbershops:http # Verifica SSR, filtro e domínios com servidor preparado
npm run test:onboarding # Valida configuração, checklist e transições em memória
npm run test:onboarding:http # Verifica entradas, domínio principal e avisos admin
npm run test:onboarding:browser # Recorte do agregador: regras, HTTP e jornada com axe
npm run test:appointments # Verifica busca, histórico e cancelamento da amostra
npm run test:appointments:http # Verifica página e domínio da área demonstrativa
npm run test:profiles # Verifica nomes demonstrativos e contexto seguro da ajuda
npm run test:profiles:browser # QA de interação (requer Playwright e navegador)
npm run test:headers:browser -- 3000 # QA de headers, drawers e navegação
npm run test:headers:zoom -- 3000 # Zoom nativo 200% em perfil temporário do Edge
npm run test:barber   # Verifica status, próximo atendimento e bloqueios da amostra
npm run test:superadmin # Verifica busca, resumo, estados e regras de cadastro local
npm run test:superadmin:help # Recorte de QA: HTTP, ajuda, regressões e zoom 200%
npm run test:superadmin:browser -- 3000 # QA de regressão (requer Playwright e navegador)
npm run test:superadmin:registration:browser -- 3000 # QA de cadastro e navegação em memória
npm run test:pwa       # Política de hosts, cache exclusivo e worker
npm run test:pwa:browser -- 3110 # QA PWA em produção local (Playwright/Edge)
npm run test:pwa:lifecycle -- 3110 # Atualização sem recarga e conflito de workers
npm run build         # Gera o build de produção
npm run api:generate  # Gera o cliente a partir do contrato OpenAPI
npm run api:watch     # Regenera o cliente quando o contrato é alterado
```

Os agregadores de QA usam ferramentas instaladas com
`npm ci --prefix ../validation/tools` a partir de `frontend`. Exigem escolha
explícita de servidor (`TEST_SERVER=isolated` ou `prepared`) e preservam logs,
capturas e diagnósticos em um diretório único por execução. Consulte os exemplos
completos e limites em [QA_ACCESSIBILITY.md](docs/frontend/QA_ACCESSIBILITY.md).
Host/HTTPS simulados em produção local não validam DNS/TLS publicado.

## Executando o backend

### Pré-requisitos

- JDK 25
- PostgreSQL

```bash
cd backend
./mvnw spring-boot:run
```

> [!NOTE]
> A configuração local do banco de dados ainda não está definida no
> repositório. Antes de iniciar a API, será necessário configurar a conexão com
> o PostgreSQL sem versionar credenciais.

## Variáveis de ambiente

O frontend usa as seguintes variáveis:

| Variável | Descrição | Valor de exemplo |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | URL base versionada da API | `http://localhost:8080/api/v1` |
| `NEXT_PUBLIC_API_MOCKING` | Controla o uso dos mocks da API | `disabled` |
| `BARBERHUB_PUBLIC_HOST` | Domínio-base público sem protocolo, porta ou caminho; padrão `localhost` em desenvolvimento e obrigatório para perfis em produção | `barberhub.example` |

Use [frontend/.env.example](frontend/.env.example) como referência e não
adicione senhas, tokens ou outras credenciais ao repositório.

O catálogo fica em `/barbearias` no domínio da plataforma. Cada perfil público
usa apenas a raiz do próprio subdomínio, como `http://demo-esquina.localhost:3000/`.
O caminho `/barbearias/[subdomain]` é interno: acessos diretos em hosts confiáveis
redirecionam para o subdomínio, preservando os parâmetros. Em produção, configure
`BARBERHUB_PUBLIC_HOST` no build e na execução e providencie DNS e TLS para os
subdomínios. Sem uma origem pública válida, os perfis ficam indisponíveis.
Consulte [a validação de domínios](docs/frontend/DOMAINS_VALIDATION.md).

Login e cadastro ficam em `/login` e `/cadastro` no domínio principal e usam
somente Google. O cadastro oferece Cliente, Barbeiro e Barbearia. A interface
preserva o retorno ao subdomínio do estabelecimento. O acesso real com Google
continua indisponível enquanto o contrato de autenticação não for aprovado;
o botão informa essa condição. A prévia opcional do header não cria uma sessão.
Consulte [a experiência de autenticação](docs/frontend/CLIENT_AUTH.md).

## Minhas barbearias

`/cliente/barbearias` mostra Esquina e Navalha vinculadas à mesma identidade
fictícia, com perfil canônico, introdução de agendamento e acesso a
`/cliente/agendamentos?barbearia=<identificador>`. O filtro combina com busca
e admite limpeza mantendo o texto. Valores desconhecidos/repetidos e hosts
inválidos recebem orientação sem selecionar outro estabelecimento.
O vínculo real nasce após o primeiro agendamento real confirmado; as fixtures
são vínculos prontos e independentes de wizard, cancelamento e superadmin.
[Arquivos, QA e integração pendente](docs/frontend/CLIENT_BARBERSHOPS.md).

## Perfil e ajuda demonstrativos

As telas `/cliente/perfil`, `/cliente/ajuda`, `/barbeiro/perfil` e
`/barbeiro/ajuda` estão disponíveis. Apenas o nome de exibição é editável, em
memória durante a navegação interna; recarga ou saída da área restaura o exemplo.
As ajudas explicam as tarefas de cada papel, sem autenticação ou reservas reais.
Implementação, arquivos e validação: [PROFILE_HELP.md](docs/frontend/PROFILE_HELP.md).

## PWA e acabamento transversal

A plataforma possui manifesto, ícones e instalação no domínio principal. Em
produção, o worker guarda somente `/pwa/offline.html` e `/pwa/icon-192.png`;
navegações sem conexão recebem uma orientação e “Tentar novamente”. Não há
reservas offline, cache de dados, filas, reenvio ou sessão criada pela instalação.
Desenvolvimento e hosts de tenants não registram esse worker; MSW permanece separado.

Validado em Windows/Edge 154 com produção local: política do cache, fallback,
atualização sem interromper edição, larguras 320/390/768/1440px e regressões.
Instalação nativa e abertura no catálogo foram verificadas em perfil temporário,
com a preferência standalone definida pelo QA no navegador. Android/iOS reais,
HTTPS publicado, instalação manual e leitor de tela continuam pendentes.
Lighthouse foi usado como diagnóstico histórico. O contraste dos botões públicos
foi corrigido com texto `#07111C` sobre `sky-500` (7,017:1; fallback 6,851:1).
O indicador “1” mantém contraste insuficiente de 2,7059:1 por decisão explícita;
uma correção futura exige nova aprovação, medição e regressão visual.
Não se declara conformidade integral de acessibilidade.
[Comandos, arquivos, métricas e limites](docs/frontend/PWA.md).

## Contrato da API

O arquivo [docs/api/openapi.yaml](docs/api/openapi.yaml) é a fonte de verdade
compartilhada entre frontend e backend. Novas operações devem ser acordadas e
adicionadas ao contrato antes da implementação.

O fluxo esperado é:

1. Frontend e backend definem o comportamento da operação.
2. A operação e seus schemas são registrados no OpenAPI.
3. O contrato é revisado pelas duas partes.
4. O frontend gera o cliente com `npm run api:generate`.
5. Frontend e backend implementam contra o mesmo contrato.

Enquanto `paths` estiver vazio, nenhum endpoint da aplicação deve ser
considerado aprovado. Consulte [docs/api/README.md](docs/api/README.md) para
conhecer o processo completo.

## Documentação

- [Decisões arquiteturais](docs/architecture/ADR.md)
- [Processo de evolução da API](docs/api/README.md)
- [Contrato OpenAPI](docs/api/openapi.yaml)
- [Minhas barbearias demonstrativas](docs/frontend/CLIENT_BARBERSHOPS.md)
- [Plano da experiência do cliente](docs/frontend/CLIENT_EXPERIENCE.md)
- [Próximas entregas do frontend sem backend](docs/frontend/FRONTEND_ROADMAP.md)
- [Interface de login/cadastro e limites de integração](docs/frontend/CLIENT_AUTH.md)
- [Perfil público da barbearia](docs/frontend/PUBLIC_BARBERSHOP.md)
- [Agendamento demonstrativo e validação](docs/frontend/CLIENT_BOOKING.md)
- [Meus agendamentos demonstrativos e validação](docs/frontend/CLIENT_APPOINTMENTS.md)
- [Perfil e ajuda demonstrativos e validação](docs/frontend/PROFILE_HELP.md)
- [Revisão dos headers, navegação e acessibilidade](docs/frontend/HEADERS_REVIEW.md)
- [Área do barbeiro demonstrativa e validação](docs/frontend/BARBER_DEMO.md)
- [Superadmin básico demonstrativo e validação](docs/frontend/SUPERADMIN_DEMO.md)
- [Ajuda do superadmin e revisão independente](docs/frontend/SUPERADMIN_DEMO.md#revisão-independente--2026-10-06)
- [Onboarding demonstrativo do proprietário e validação](docs/frontend/OWNER_ONBOARDING.md)
- [PWA, política offline e acabamento transversal](docs/frontend/PWA.md)
- [Consolidação de QA, acessibilidade e validação parcial](docs/frontend/QA_ACCESSIBILITY.md)
- [Consolidação técnica, auditoria de dependências e publicação pendente](docs/frontend/TECHNICAL_CLOSURE.md)

## Roadmap resumido

Os itens abaixo representam o **MVP integrado e sua evolução**, não uma lista
de telas ainda ausentes. O estado das apresentações e demonstrações já
implementadas está no [roadmap do frontend](docs/frontend/FRONTEND_ROADMAP.md).

- Catálogo público e página de cada barbearia
- Conta global do cliente e seus agendamentos entre estabelecimentos
- Autenticação e autorização com JWT
- Administração de tenants
- Catálogo de serviços e equipe
- Motor de disponibilidade
- Fluxo completo de agendamento
- Registro de faltas e reputação
- Integração com links do WhatsApp
- Painéis para administradores, barbeiros e clientes

O roadmap detalhado, incluindo itens pós-MVP, está disponível no
[ADR](docs/architecture/ADR.md#11-roadmap).

## Licença

Este projeto é distribuído sob a licença MIT. Consulte o arquivo
[LICENSE](LICENSE) para mais informações.
