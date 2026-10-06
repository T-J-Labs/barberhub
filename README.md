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

O **Superadmin básico** está disponível como demonstração local em
`/super-admin`, `/super-admin/barbearias` e `/super-admin/barbearias/[id]`:
resumo da amostra, lista, busca por nome/cidade/bairro, detalhes e
suspensão/reativação em memória. Usa seis barbearias fictícias do catálogo;
nenhuma alteração é salva ou afeta publicação, acesso ou estabelecimento real.
Não há autenticação/autorização de superadmin. Contratos e regras reais continuam
pendentes enquanto o OpenAPI mantém `paths: {}`.
[Escopo, arquivos, testes e limitações](docs/frontend/SUPERADMIN_DEMO.md).

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
npm run test:routing  # Verifica resolução de hosts e geração de links
npm run test:routing:http # Verifica rotas com o servidor local ativo na porta 3000
npm run test:auth     # Verifica domínio, perfis e retorno seguro da autenticação
npm run test:auth:http # Verifica a interface com servidor local ativo na porta 3000
npm run test:booking  # Verifica seleções, conflito e fixtures demonstrativas
npm run test:booking:http -- 3000 # Verifica entradas e contexto do agendamento
npm run test:appointments # Verifica busca, histórico e cancelamento da amostra
npm run test:appointments:http # Verifica página e domínio da área demonstrativa
npm run test:profiles # Verifica nomes demonstrativos e contexto seguro da ajuda
npm run test:profiles:browser # QA de interação (requer Playwright e navegador)
npm run test:barber   # Verifica status, próximo atendimento e bloqueios da amostra
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

## Perfil e ajuda demonstrativos

As telas `/cliente/perfil`, `/cliente/ajuda`, `/barbeiro/perfil` e
`/barbeiro/ajuda` estão disponíveis. Apenas o nome de exibição é editável, em
memória durante a navegação interna; recarga ou saída da área restaura o exemplo.
As ajudas explicam as tarefas de cada papel, sem autenticação ou reservas reais.
Implementação, arquivos e validação: [PROFILE_HELP.md](docs/frontend/PROFILE_HELP.md).

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
- [Plano da experiência do cliente](docs/frontend/CLIENT_EXPERIENCE.md)
- [Próximas entregas do frontend sem backend](docs/frontend/FRONTEND_ROADMAP.md)
- [Interface de login/cadastro e limites de integração](docs/frontend/CLIENT_AUTH.md)
- [Perfil público da barbearia](docs/frontend/PUBLIC_BARBERSHOP.md)
- [Agendamento demonstrativo e validação](docs/frontend/CLIENT_BOOKING.md)
- [Meus agendamentos demonstrativos e validação](docs/frontend/CLIENT_APPOINTMENTS.md)
- [Perfil e ajuda demonstrativos e validação](docs/frontend/PROFILE_HELP.md)
- [Área do barbeiro demonstrativa e validação](docs/frontend/BARBER_DEMO.md)
- [Superadmin básico demonstrativo e validação](docs/frontend/SUPERADMIN_DEMO.md)

## Roadmap resumido

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
