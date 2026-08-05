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
* **Decisão:** **Shared Schema (Tabelas Compartilhadas)** utilizando uma coluna `tenant_id` obrigatória.
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

---

## 4. Requisitos Funcionais (RFs)

### Módulo de Identidade e Acesso (IAM)

* **RF01:** O sistema deve autenticar usuários via E-mail e Senha gerando token JWT.
* **RF02:** O sistema deve suportar controle de acesso baseado em papéis (RBAC).
* **RF03:** O usuário pode editar seu próprio perfil e redefinir senha.

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

---

## 5. Requisitos Não Funcionais (RNFs)

* **RNF01 - Custos (Obrigatório):** A infraestrutura de produção do MVP deve operar no intervalo de R$ 10,00 a R$ 20,00 mensais (usando Free Tiers e VPS de entrada).
* **RNF02 - Desempenho e SEO:** O frontend institucional (páginas públicas) deve utilizar Server-Side Rendering (SSR) / Static Site Generation (SSG) no Next.js para carregar em menos de 2 segundos.
* **RNF03 - Usabilidade:** Interface 100% Mobile-First. O frontend deve ser um Progressive Web App (PWA) para instalação na tela inicial.
* **RNF04 - Isolamento de Dados:** Dados de um `tenant_id` jamais podem ser expostos para outro tenant.
* **RNF05 - Escalabilidade:** O backend deve ser Stateless (sem estado local de sessão) para permitir escalabilidade horizontal futura. Senhas devem usar hashing (Bcrypt/Argon2).

---

## 6. Papéis e Permissões (RBAC)

1. **Super Administrador:** Dono do SaaS. Visão global da infraestrutura. Gerencia os tenants (barbearias), planos e assinaturas.
2. **Administrador da Barbearia:** Dono/Gerente do estabelecimento. Controla exclusivamente o seu `tenant_id`. Pode cadastrar barbeiros, configurar catálogo, ver métricas gerais e administrar informações públicas.
3. **Barbeiro:** Colaborador. Acesso restrito à sua própria agenda, perfil e métricas de reputação de clientes que ele atenderá. Pode bloquear próprios horários e registrar no-shows.
4. **Cliente:** Usuário final. Acesso restrito ao seu próprio histórico. Pode visualizar horários livres, realizar agendamentos e cancelamentos de sua titularidade.

---

## 7. Arquitetura da Solução

* **Frontend (Apresentação e Roteamento):** Desenvolvido em React / Next.js (App Router), TypeScript e TailwindCSS. Hospedado na **Vercel** (Free Tier). O roteamento identifica o Tenant pela URL (middleware).
* **Backend (API e Regras de Negócio):** Desenvolvido em Java 21+ e Spring Boot 3+. Hospedado em provedor VPS Linux de baixo custo via contêiner **Docker**.
* **Banco de Dados:** PostgreSQL relacional hospedado na **Neon.tech** ou **Supabase** (Serverless, Free Tier).
* **Comunicação Frontend-Backend:** Exclusivamente via APIs RESTful sobre HTTPS, com payloads JSON.
* **Autenticação/Autorização:** Stateless via **JSON Web Tokens (JWT)**.
* **Armazenamento de Arquivos:** Imagens enviadas via frontend para serviço externo (Cloudinary), gravando apenas a URL gerada no PostgreSQL.

---

## 8. Modelo SaaS e Multi-tenancy

* **Isolamento:** A arquitetura adota a estratégia de *Shared Database, Shared Schema*.
* **Resolução de Inquilino:**
* *Rotas Públicas:* O Next.js envia o header HTTP `X-Tenant-Subdomain` baseado na URL acessada.
* *Rotas Privadas:* O `tenant_id` é embutido no payload criptografado do JWT durante o login, sendo extraído pelo Spring Security.


* **Recursos Globais:** Tabela `tenants` (barbearias).
* **Recursos Inquilinos (Tenant-bound):** `users`, `services`, `barber_schedules`, `appointments`, `client_profiles`.

---

## 9. Banco de Dados (Entidades e Relacionamentos)

| Tabela | Chave Primária | Relacionamentos (FK) | Descrição |
| --- | --- | --- | --- |
| `tenants` | `id` (UUID) | N/A | Centraliza os dados corporativos da barbearia (subdomain, logo_url). |
| `users` | `id` (UUID) | `tenant_id` | Centraliza contas de acesso (SuperAdmin, Admin, Barber, Client). Email deve ser único por tenant. |
| `client_profiles` | `id` (UUID) | `tenant_id`, `user_id` | Consolida métricas de reputação (total_appointments, total_no_shows). |
| `services` | `id` (UUID) | `tenant_id` | Catálogo do estabelecimento (price, duration_minutes). |
| `barber_schedules` | `id` (UUID) | `tenant_id`, `barber_id` | Jornada de trabalho (dia da semana, início, fim). |
| `appointments` | `id` (UUID) | `tenant_id`, `client_id`, `barber_id`, `service_id` | O Core. Contém data, início, fim e status do agendamento. |

---

## 10. Fluxos da Aplicação

* **Fluxo Institucional:** Visitante acessa `subdominio.sistema.com`. Middleware carrega informações do Tenant. Site exibe logo, serviços e equipe.
* **Fluxo de Agendamento (Wizard):** O cliente não logado clica em agendar $\rightarrow$ Redireciona para Cadastro/Login $\rightarrow$ Seleciona Serviço $\rightarrow$ Seleciona Barbeiro $\rightarrow$ Escolhe Data $\rightarrow$ API devolve lista de slots (horários) livres $\rightarrow$ Confirmação.
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
