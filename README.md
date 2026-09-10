# BarberHub

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

Muitas barbearias ainda controlam horários por papel ou por conversas dispersas
no WhatsApp. Isso dificulta a organização da equipe, aumenta a ocorrência de
conflitos e faltas e limita a presença digital do estabelecimento.

O BarberHub busca reunir em uma única plataforma:

- página institucional de cada barbearia;
- catálogo de serviços e profissionais;
- agendamento e controle de horários;
- acompanhamento de atendimentos e faltas;
- administração isolada de diferentes barbearias.

## Funcionalidades planejadas para o MVP

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
a um `tenant_id`, que deve ser aplicado em todas as operações privadas para
impedir o acesso aos dados de outro tenant.

O backend segue o modelo de monólito modular orientado a funcionalidades. O
frontend e o backend se comunicam exclusivamente por uma API REST, com rotas
versionadas pelo prefixo `/api/v1`.

Em rotas públicas, o tenant é identificado pelo header
`X-Tenant-Subdomain`. Em rotas privadas, o contexto do tenant deverá ser obtido
a partir da identidade autenticada, nunca aceito livremente do cliente.

As decisões e restrições arquiteturais estão documentadas em
[docs/architecture/ADR.md](docs/architecture/ADR.md).

## Estrutura do projeto

```text
barberhub/
├── backend/                  # API Java com Spring Boot
├── frontend/                 # Aplicação Next.js e TypeScript
├── docs/
│   ├── api/                  # Contrato e processo OpenAPI
│   └── architecture/         # Decisões arquiteturais
├── AGENTS.md                 # Orientações para agentes de IA
├── LICENSE
└── README.md
```

## Executando o frontend

### Pré-requisitos

- Node.js compatível com o Next.js 16
- npm

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
npm run build         # Gera o build de produção
npm run api:generate  # Gera o cliente a partir do contrato OpenAPI
npm run api:watch     # Regenera o cliente quando o contrato é alterado
```

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

Use [frontend/.env.example](frontend/.env.example) como referência e não
adicione senhas, tokens ou outras credenciais ao repositório.

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

## Roadmap resumido

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
