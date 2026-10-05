# Documento de Arquitetura de Software (ADR)

## Sistema SaaS para Gestão e Agendamento de Barbearias

---

## 1. Visão Geral do Projeto

* **Objetivo do Produto:** Desenvolver um sistema web para pequenas e médias barbearias que funcione como site institucional e plataforma completa de gerenciamento de clientes, barbeiros e agendamentos.
* **Problema que Resolve:** Desorganização das filas de espera presenciais, alto índice de faltas (no-shows) sem rastreabilidade e falta de presença digital profissional e atrativa para os estabelecimentos.
* **Público-Alvo:** Pequenas e médias barbearias, com foco inicial em bairros populares e comunidades da região metropolitana do Rio de Janeiro. Usuários finais (clientes) utilizam majoritariamente smartphones de baixo custo.
* **Proposta de Valor:** Entregar um sistema simples, barato, fácil de utilizar e mobile-first, permitindo agendamentos online sem fricção, melhorando a organização do salão e atraindo novos clientes via SEO institucional.

---

## 2. Contexto de Negócio

* **Motivação:** A maioria das barbearias de bairro ainda utiliza papel, caneta ou mensagens desorganizadas no WhatsApp para gerenciar horários, gerando perda de tempo e receita.
* **Modelo de Negócio:** O sistema é concebido nativamente como um **SaaS (Software as a Service) Multi-tenant**. O proprietário do software (Super Administrador) comercializará assinaturas para diferentes barbearias.
* **Visão de Longo Prazo:** Evoluir de um simples agendador para o sistema operacional central da barbearia, englobando pagamentos, programa de fidelidade, inteligência artificial para previsão de horários e gestão financeira.

---

## 3. Decisões Arquiteturais (ADRs)

### ADR 01: Arquitetura Multi-tenant (Isolamento de Dados)

* **Contexto:** O sistema hospedará várias barbearias simultaneamente. É vital garantir que os dados não se misturem e o custo permaneça baixo.
* **Alternativas:** (A) Banco de dados por Tenant (Alto custo); (B) Schema por Tenant (Manutenção complexa).
* **Decisão:** **Shared Schema (Tabelas Compartilhadas)** utilizando uma coluna `tenant_id` obrigatória nos recursos pertencentes a uma barbearia. Recursos globais, como a identidade do cliente definida no ADR 08, têm escopo próprio.
* **Justificativa:** Menor custo de infraestrutura inicial e facilidade de aplicação de migrações. O filtro de segurança será garantido via framework (Hibernate/Spring Boot).
* **Impactos/Limitações:** Exige rigor na escrita das queries e configuração de segurança no backend para evitar vazamento de dados (IDOR).

### ADR 02: Estilo Arquitetural do Backend

* **Contexto:** Necessidade de construir e escalar o backend rapidamente sem elevar custos.
* **Alternativas:** Microsserviços vs. Monolito Modular.
* **Decisão:** **Monolito Modular (Feature-based)**.
* **Justificativa:** Evita a complexidade e o custo de orquestrar múltiplos servidores no MVP. A separação lógica por módulos facilita uma futura extração para microsserviços.

### ADR 03: Stack Tecnológica do Backend

* **Contexto:** O backend precisa ser seguro, maduro para SaaS e rodar em infraestrutura de baixo custo (R$ 10 a R$ 20/mês).
* **Alternativas:** Go (Golang) vs. Java (Spring Boot).
* **Decisão:** **Java 21+ com Spring Boot**.
* **Justificativa:** Embora Go ofereça menor consumo de memória nativamente, Java/Spring Boot possui um ecossistema mais maduro para aplicações corporativas e suporte nativo robusto a Multi-tenancy (via Hibernate) e segurança (Spring Security). O custo de memória será mitigado alocando limites na JVM e, se necessário, adotando GraalVM (Spring Native).

### ADR 04: Estratégia de Agendamentos e Filas

* **Contexto:** O gerenciamento de filas presenciais (ordem de chegada) conflita com horários agendados.
* **Decisão:** **O sistema operará exclusivamente via agendamentos**.
* **Justificativa:** Elimina complexidade algorítmica e de regras de negócio no MVP. Clientes walk-in (que chegam sem hora) deverão ser registrados na agenda do sistema antes do atendimento.

### ADR 05: Tratamento de Faltas (No-Show)

* **Contexto:** Clientes frequentemente faltam, gerando prejuízo.
* **Alternativas:** Bloqueio automático (Blacklist) vs. Sistema de Reputação.
* **Decisão:** **Sistema de Reputação (Métricas de confiabilidade)**.
* **Justificativa:** Bloquear clientes reduz o faturamento potencial. Fornecer dados (Frequência vs. Faltas) permite que o barbeiro decida como proceder (ex: exigir pagamento antecipado futuramente).

### ADR 06: Comunicação com Clientes (WhatsApp)

* **Contexto:** Necessidade de notificar o cliente final em uma área onde o WhatsApp é a principal via de comunicação.
* **Alternativas:** API Oficial do Meta (Paga) vs. Links Dinâmicos.
* **Decisão:** **Geração de links dinâmicos (`wa.me`) pré-preenchidos**.
* **Justificativa:** Reduz custos transacionais a zero no MVP. A automação total via API Oficial fica no roadmap para fases posteriores.

### ADR 07: Armazenamento de Arquivos

* **Contexto:** Upload de imagens pode encarecer a hospedagem e complicar a infraestrutura.
* **Decisão:** No MVP, será permitido **apenas o upload da logomarca (avatar) da barbearia**, utilizando um serviço externo gratuito (Cloudinary ou Supabase Storage).
* **Justificativa:** Mantém a infraestrutura enxuta e barata, mas deixa a arquitetura pronta para futura expansão (galerias).

### ADR 08: Conta Única do Cliente e Catálogo Público de Barbearias

* **Contexto:** Um cliente pode frequentar várias barbearias. Cadastros separados por estabelecimento dificultam o acesso e o acompanhamento de suas reservas.
* **Decisão:** O cliente terá **identidade e credenciais globais**, podendo agendar em diferentes barbearias com uma única conta. A plataforma oferecerá um **catálogo público simples**, com busca por nome, cidade ou bairro e acesso à página de cada estabelecimento.
* **Isolamento:** Perfil do cliente no estabelecimento, agendamentos, histórico de atendimento e reputação continuam vinculados ao `tenant_id`. Uma barbearia não pode consultar os dados do cliente em outra. Admins e barbeiros mantêm permissões restritas aos seus respectivos tenants.
* **Visão do Cliente:** O cliente poderá consultar seus próprios agendamentos em diferentes barbearias, identificadas na interface. O backend deve limitar essa consulta à identidade autenticada e validar a titularidade de cada reserva em consultas e alterações.
* **Descoberta Pública:** O catálogo expõe somente informações autorizadas para publicação de estabelecimentos ativos. O acesso direto pelo subdomínio permanece disponível. A consulta global ao catálogo não exige um tenant selecionado; a consulta pública de uma barbearia específica resolve seu contexto.
* **Autorização:** Selecionar uma barbearia na interface não concede acesso aos seus dados privados. O backend resolve e valida o contexto de cada operação. Em operações administrativas, o tenant vem do contexto autenticado; em operações do cliente, a identidade global, os recursos envolvidos e a titularidade determinam o acesso.
* **Escopo Inicial:** Catálogo, página da barbearia, login/cadastro do cliente, agendamento e meus agendamentos. Geolocalização, avaliações, rankings e favoritos ficam para uma etapa posterior.
* **Impactos/Pendências:** Esta decisão substitui o cadastro de cliente com e-mail único por tenant. A modelagem física de identidade e vínculos, o ciclo de vida do perfil local e os contratos de autenticação e agendamento devem ser acordados com o backend antes da integração. O OpenAPI permanece como fonte de verdade das operações aprovadas.

---

## 4. Requisitos Funcionais (RFs)

### Módulo de Identidade e Acesso (IAM)

* **RF01:** Cadastro/login de Cliente, Barbeiro e proprietário de Barbearia usam somente Google, conforme decisão de 2026-10-04. O cadastro permite escolher esses três perfis. A integração do provedor, criação/vinculação de conta e emissão/transporte da sessão dependem de contrato aprovado; escolher um perfil não concede permissões. Login e cadastro ficam no domínio principal; perfis públicos continuam nos subdomínios.
* **RF02:** O sistema deve suportar controle de acesso baseado em papéis (RBAC).
* **RF03:** O usuário pode editar seu próprio perfil. A recuperação de acesso é realizada pelo Google; o BarberHub não oferece senha local ou redefinição de senha.

### Módulo SaaS (Tenant)

* **RF04:** O sistema deve prover acesso à barbearia através de subdomínio dinâmico.
* **RF05:** O Super Admin pode cadastrar, suspender e gerenciar Tenants.
* **RF06:** O Admin pode configurar dados institucionais (logo, contato, endereço, horários).

### Módulo de Catálogo e Equipe

* **RF07:** O Admin pode realizar CRUD de serviços (nome, descrição, preço, duração).
* **RF08:** O Admin pode gerenciar o cadastro de barbeiros do seu estabelecimento.
* **RF09:** O Barbeiro/Admin pode configurar sua jornada de trabalho semanal e folgas.

### Módulo Core (Agendamentos)

* **RF10:** O sistema deve calcular slots de horários disponíveis baseados na jornada do barbeiro e duração do serviço, subtraindo horários já agendados.
* **RF11:** O Cliente pode agendar, reagendar ou cancelar horários futuros.
* **RF12:** O sistema deve prevenir agendamentos duplos (concorrência).
* **RF13:** O Barbeiro pode bloquear horários manuais em sua própria agenda.

### Módulo Operacional e Reputação

* **RF14:** O Barbeiro/Admin pode alterar o status do agendamento (Concluído, Falta, Cancelado).
* **RF15:** O sistema deve rastrear e exibir a reputação do cliente (Total de agendamentos vs. Faltas).
* **RF16:** O sistema deve gerar links de WhatsApp para compartilhamento manual de status.

### Módulo de Descoberta e Conta do Cliente

* **RF17:** O visitante pode consultar um catálogo público de barbearias e buscar por nome, cidade ou bairro.
* **RF18:** O cliente pode utilizar uma única conta para agendar em diferentes barbearias, preservando o isolamento dos dados de cada estabelecimento.
* **RF19:** O cliente pode consultar seus próprios agendamentos em diferentes barbearias, identificando o estabelecimento de cada reserva.

---

## 5. Requisitos Não Funcionais (RNFs)

* **RNF01 - Custos (Obrigatório):** A infraestrutura de produção do MVP deve operar no intervalo de R$ 10,00 a R$ 20,00 mensais (usando Free Tiers e VPS de entrada).
* **RNF02 - Desempenho e SEO:** O frontend institucional (páginas públicas) deve utilizar Server-Side Rendering (SSR) / Static Site Generation (SSG) no Next.js para carregar em menos de 2 segundos.
* **RNF03 - Usabilidade:** Interface 100% Mobile-First. O frontend deve ser um Progressive Web App (PWA) para instalação na tela inicial.
* **RNF04 - Isolamento de Dados:** Dados privados de um `tenant_id` jamais podem ser expostos para outro tenant. A visão pessoal do cliente pode reunir suas próprias reservas, conforme o ADR 08, sem conceder acesso cruzado aos estabelecimentos.
* **RNF05 - Escalabilidade:** O backend deve ser Stateless (sem estado local de sessão) para permitir escalabilidade horizontal futura. A identidade Google deve ser validada pelo backend conforme contrato aprovado; o BarberHub não armazena senhas locais. Emissão, transporte e revogação da sessão dependem dos contratos de IAM.

---

## 6. Papéis e Permissões (RBAC)

1. **Super Administrador:** Dono do SaaS. Visão global da infraestrutura. Gerencia os tenants (barbearias), planos e assinaturas.
2. **Administrador da Barbearia:** Dono/Gerente do estabelecimento. Controla exclusivamente o seu `tenant_id`. Pode cadastrar barbeiros, configurar catálogo, ver métricas gerais e administrar informações públicas.
3. **Barbeiro:** Colaborador. Acesso restrito à sua própria agenda, perfil e métricas de reputação de clientes que ele atenderá. Pode bloquear próprios horários e registrar no-shows.
4. **Cliente:** Usuário final com conta global. Pode descobrir barbearias, visualizar horários livres e realizar agendamentos, reagendamentos e cancelamentos de sua titularidade. Sua área pessoal reúne suas próprias reservas em diferentes estabelecimentos; os dados operacionais e a reputação permanecem isolados por tenant.

---

## 7. Arquitetura da Solução

* **Frontend (Apresentação e Roteamento):** Desenvolvido em React / Next.js (App Router), TypeScript e TailwindCSS. Hospedado na **Vercel** (Free Tier). Catálogo e conta do cliente têm escopo global. O roteamento identifica o tenant pela URL nas páginas de estabelecimentos, preservando o acesso por subdomínio.
* **Backend (API e Regras de Negócio):** Desenvolvido em Java 21+ e Spring Boot 3+. Hospedado em provedor VPS Linux de baixo custo via contêiner **Docker**.
* **Banco de Dados:** PostgreSQL relacional hospedado na **Neon.tech** ou **Supabase** (Serverless, Free Tier).
* **Comunicação Frontend-Backend:** Exclusivamente via APIs RESTful sobre HTTPS, com payloads JSON.
* **Autenticação/Autorização:** Stateless via **JSON Web Tokens (JWT)**.
* **Armazenamento de Arquivos:** Imagens enviadas via frontend para serviço externo (Cloudinary), gravando apenas a URL gerada no PostgreSQL.

---

## 8. Modelo SaaS e Multi-tenancy

* **Isolamento:** A arquitetura adota a estratégia de *Shared Database, Shared Schema*.
* **Resolução de Inquilino:**
* *Rotas Públicas de uma Barbearia:* O Next.js envia o header HTTP `X-Tenant-Subdomain` baseado na URL acessada. O catálogo público global não depende desse header; suas operações ainda precisam ser definidas no OpenAPI.
* *Rotas Privadas Administrativas:* O backend obtém o tenant do contexto autenticado validado pelo Spring Security. Claims do JWT devem ter sua assinatura validada; o cliente não fornece livremente um `tenant_id` como autorização.
* *Rotas Privadas do Cliente:* A conta tem identidade global. O backend resolve a barbearia dos recursos envolvidos e valida o acesso e a titularidade. A listagem pessoal entre tenants é limitada ao cliente autenticado; a seleção de estabelecimento não amplia suas permissões.


* **Recursos Globais:** Tenants (barbearias), identidade e credenciais do cliente, projeção pública do catálogo.
* **Recursos Inquilinos (Tenant-bound):** Vínculos e permissões da equipe, `services`, `barber_schedules`, `appointments`, `client_profiles`. A conta global não torna esses recursos públicos.

---

## 9. Banco de Dados (Entidades e Relacionamentos)

A tabela abaixo representa o modelo conceitual. Após o ADR 08, a estrutura física de IAM e os vínculos da identidade global do cliente precisam ser revisados com o backend; os nomes e relacionamentos finais ainda não estão definidos.

| Tabela | Chave Primária | Relacionamentos (FK) | Descrição |
| --- | --- | --- | --- |
| `tenants` | `id` (UUID) | N/A | Centraliza os dados corporativos da barbearia (subdomain, logo_url). |
| `users` (IAM a revisar) | `id` (UUID) | A definir na revisão de IAM | Identidade do cliente e unicidade de seu e-mail são globais. Permissões de Admin e Barber são vinculadas ao tenant; SuperAdmin tem escopo global. A estrutura física deve refletir esses escopos. |
| `client_profiles` | `id` (UUID) | `tenant_id`, referência à identidade global do cliente | Perfil e métricas de reputação (total_appointments, total_no_shows) exclusivos da relação entre cliente e barbearia. |
| `services` | `id` (UUID) | `tenant_id` | Catálogo do estabelecimento (price, duration_minutes). |
| `barber_schedules` | `id` (UUID) | `tenant_id`, `barber_id` | Jornada de trabalho (dia da semana, início, fim). |
| `appointments` | `id` (UUID) | `tenant_id`, `client_id`, `barber_id`, `service_id` | O Core. Contém data, início, fim e status do agendamento. |

---

## 10. Fluxos da Aplicação

* **Fluxo Institucional:** Visitante acessa `subdominio.sistema.com`. Middleware carrega informações do Tenant. Site exibe logo, serviços e equipe.
* **Fluxo de Descoberta:** Visitante consulta o catálogo global, busca por nome, cidade ou bairro e acessa a página pública de uma barbearia. O link direto ao estabelecimento também permite iniciar o fluxo.
* **Fluxo de Agendamento (Wizard):** O cliente não logado clica em agendar $\rightarrow$ Redireciona para Cadastro/Login da conta global $\rightarrow$ Retorna à barbearia escolhida $\rightarrow$ Seleciona Serviço $\rightarrow$ Seleciona Barbeiro $\rightarrow$ Escolhe Data $\rightarrow$ API devolve lista de slots (horários) livres $\rightarrow$ Revisão e Confirmação. Clientes já autenticados seguem diretamente para a seleção.
* **Fluxo Pessoal do Cliente:** Cliente autenticado consulta seus agendamentos, identificados por barbearia, e pode cancelar ou reagendar reservas futuras de sua titularidade, conforme as regras acordadas com o backend.
* **Fluxo de Atendimento/No-Show:** Barbeiro visualiza agenda do dia $\rightarrow$ Cliente chega (clica Concluído) OU Cliente falta (clica No-Show) $\rightarrow$ Banco atualiza `status` do agendamento e incrementa contadores na `client_profiles`.

---

## 11. Roadmap

### 11.1. Pré-MVP (1 a 2 semanas)

Fase atual. Focada no desenho paralelo orientando a produtividade da equipe:

1. Alinhamento de escopo (Frontend + Backend).
2. Desenho do banco de dados (DER).
3. **Definição estrita dos Contratos de API (Swagger/OpenAPI).**
4. Criação de Mock Servers e Wireframes.
5. Setup de Infraestrutura, Repositórios e CI/CD base.

### 11.2. MVP (Go-To-Market)

1. Motor de disponibilidade e concorrência de agendamentos.
2. Controle de acesso (JWT) e separação multitenant.
3. Painéis de visualização (Dashboard Barbeiro/Admin).
4. Sistema de reputação (Faltas).
5. Botões integrados `wa.me` para avisos no WhatsApp.
6. Catálogo público de barbearias e conta única do cliente, conforme ADR 08.

A próxima sequência de trabalho do frontend é: catálogo público → página da barbearia → conta do cliente → agendamento → meus agendamentos → agenda do barbeiro. O plano está em [docs/frontend/CLIENT_EXPERIENCE.md](../frontend/CLIENT_EXPERIENCE.md).

### 11.3. Pós-MVP (Fase 1 - Engajamento)

1. Integração com a API Oficial do WhatsApp para automação de lembretes.
2. Programa de fidelidade digital.
3. NPS / Avaliação do barbeiro por estrelas.

### 11.4. Funcionalidades Futuras (Fases 2 e 3)

1. Integração de Pagamentos (Pix, Cartão de Crédito) via Stripe/Mercado Pago.
2. Painel financeiro de comissionamento interno.
3. Suporte a Multiunidades (Redes de barbearias).
4. Aplicativo Nativo (iOS/Android).

---

## 12. Decisões Pendentes

* **Provedor Definitivo de VPS:** Validar a aprovação da Oracle Cloud (Free Tier) versus a contratação de uma VPS paga (Hostinger/Hetzner) antes do deploy de produção.
* **GraalVM (Spring Native):** Validar se a compilação nativa será estritamente necessária no dia 1, dependendo dos testes de estresse de memória (RAM) no provedor escolhido.
* **Gestão de Domínios:** Como o mapeamento de domínios customizados (CNAME) será tratado tecnicamente se os tenants quiserem usar domínios próprios (ex: `[www.barbeariadoze.com](https://www.barbeariadoze.com).br`) no futuro.
* **Identidade Global do Cliente:** Definir com o backend a modelagem física de IAM, vínculos locais, ciclo de vida do perfil por barbearia, armazenamento do JWT e contratos de autenticação, descoberta e reservas, incluindo a consulta pessoal entre tenants.
* **Publicação no Catálogo:** Definir quais dados são públicos e os critérios de publicação, suspensão e retirada de um estabelecimento do catálogo.

---

## 13. Histórico de Decisões

* **Interação 1:** Estabelecimento de regras gerais, stack de base (Next.js + Spring Boot) e solicitação de processo focado em arquitetura.
* **Interação 2:** Definição do escopo multi-tenant desde o Dia 1. Exclusão de filas físicas (foco 100% em agendamentos online). Definição da comunicação via WhatsApp e hierarquia de usuários.
* **Interação 3:** Mudança de sistema de Blacklist para Sistema de Reputação. Imposição do orçamento estrito de infraestrutura (R$ 10 - R$ 20).
* **Interação 4:** Desenho da arquitetura (Vercel + VPS + Cloudinary + Neon.tech).
* **Interação 5:** Avaliação Java vs Go. Reafirmação do Java + Spring Boot devido ao suporte nativo de Hibernate para SaaS e maturidade. Restrição de uploads de mídia apenas para a Logomarca.
* **Interação 6 & 7:** Modelagem de Banco de Dados, Contratos de API e Navegação do Frontend aprovadas.
* **Interação 8 & 9:** Estrutura de pastas baseada em Features. Definição estrita do escopo MVP (corte de automações pagas e sistemas financeiros).
* **Interação 10:** Definição do Roadmap de evolução longo prazo e metodologia de trabalho Pré-MVP (API-First e trabalho em paralelo da dupla Frontend/Backend).
* **Interação 11 (2026-10-01):** Aprovação de catálogo público de barbearias e conta global do cliente, preservando perfis, reputação, agendamentos e permissões operacionais por tenant. Prioridade do frontend passa a ser a jornada de descoberta e agendamento do cliente.

---

## 14. Premissas Arquiteturais

1. **API-First:** Frontend e Backend devem evoluir de forma independente, utilizando contratos de API previamente acordados via Swagger/Postman e a criação de mocks durante o desenvolvimento.
2. **Mobile-First e UX Simplificada:** Toda decisão visual ou fluxo deve priorizar dispositivos móveis e baixa latência cognitiva.
3. **Lean Startup (Sustentabilidade Financeira):** Nenhuma tecnologia ou integração de alto custo será incorporada sem que o sistema gere faturamento que a justifique.
4. **Stateless API:** O servidor não guarda estado local. Toda autenticação e contexto multi-tenant trafegam e são validados a cada request (JWT).

---

## 15. Convenções do Projeto

* **Padrão de Rotas (Next.js):** Uso de *App Router* e agrupamento lógico via pastas `(public)`, `(private)`, `(auth)`.
* **Padrão de Estrutura (Spring Boot):** Modularização orientada a Domínio (Feature-based). Camadas (domain, dto, repository, service, controller) encapsuladas dentro da pasta do respectivo módulo de negócio (ex: `modules/scheduling/`).
* **Versionamento de API:** Rotas backend prefixadas com versão (ex: `/api/v1/`).
* **Soft Deletes:** Entidades críticas (Serviços, Usuários) não serão fisicamente deletadas, mas inativadas logicamente (`is_active = false`) para garantir integridade do histórico.
