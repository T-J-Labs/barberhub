# Instruções para agentes de IA

## Contexto

Este repositório contém um sistema SaaS multi-tenant para gestão e agendamento de barbearias.

Antes de sugerir ou implementar alterações, leia:

- `docs/architecture/ADR.md`
- `README.md`

Para planejar ou implementar integração frontend/backend, leia também
`docs/integration/ROADMAP.md`: entregas H00–H24, dependências, cartões de execução
e harness. O plano não autoriza executar etapas automaticamente, alterar banco,
migrações ou infraestrutura, nem publicar. Operações continuam exigindo contrato
aprovado em `docs/api/openapi.yaml`; código existente não é contrato aprovado.

Para análise, planejamento ou implementação de frontend, leia também:

- `docs/frontend/FRONTEND_ROADMAP.md`: prioridades, escopo demonstrativo,
  limites e critérios de conclusão das próximas entregas.
- `docs/frontend/CLIENT_EXPERIENCE.md`: jornada global do cliente.
- `docs/frontend/CLIENT_AUTH.md`: autenticação, navegação e retorno entre domínios.

## Estrutura do repositório

- `frontend/`: aplicação Next.js e TypeScript
- `backend/`: API Java com Spring Boot
- `docs/`: documentação técnica do projeto

## Regras gerais

1. Respeite as decisões registradas no ADR.
2. Não invente endpoints da API.
3. Consulte o contrato OpenAPI antes de integrar frontend e backend.
4. Não altere frontend e backend na mesma tarefa sem necessidade.
5. Preserve a arquitetura multi-tenant.
6. O frontend utiliza Next.js com App Router e TypeScript.
7. O backend utiliza Java com Spring Boot e PostgreSQL.
8. As rotas da API devem utilizar o prefixo `/api/v1`.
9. Não inclua segredos, senhas ou tokens no código.
10. Explique mudanças arquiteturais antes de implementá-las.

## Frontend

Ao trabalhar no frontend:

- Siga o escopo pedido pelo usuário. Pedidos de análise, planejamento, listagem
  ou documentação não autorizam implementar funcionalidades. O roadmap orienta
  futuras implementações, mas não autoriza executar suas etapas automaticamente.
- Consulte o estado atual em `docs/frontend/FRONTEND_ROADMAP.md` antes de
  escolher a próxima entrega. As seis etapas da sequência inicial estão
  implementadas: agendamento, meus agendamentos, área do barbeiro, perfil e ajuda
  para cliente e barbeiro, superadmin básico e PWA/acabamento transversal.
  O cadastro manual do superadmin também existe como rascunho demonstrativo.
  Não confundir essas entregas com autenticação, autorização ou integração real;
  preservar as limitações de QA e ambiente registradas nos documentos.
- Não repetir etapas concluídas nem executar uma nova funcionalidade
  automaticamente. A revisão dirigida dos headers usa a landing institucional
  como referência visual e de menu, substituindo a referência anterior ao
  barbeiro. A implementação e o QA local estão em `docs/frontend/HEADERS_REVIEW.md`.
  Preservar navegação admin/superadmin, sidebar desktop, domínios e retorno.
  A consolidação local de QA já foi implementada; a próxima prioridade é
  complementar as verificações manuais e externas de acessibilidade/ambiente
  em `docs/frontend/QA_ACCESSIBILITY.md`. Esta orientação não autoriza novas
  implementações sem solicitação do usuário.
  “Minhas barbearias” está implementada como demonstração local. A regra
  aprovada é vínculo após primeiro agendamento real confirmado na barbearia;
  simulações não criam vínculo. Consulte `docs/frontend/CLIENT_BARBERSHOPS.md`.
  Onboarding demonstrativo do proprietário está implementado conforme plano
  específico aprovado; consulte `docs/frontend/OWNER_ONBOARDING.md`. Identidade,
  vínculo e onboarding real de equipe continuam dependentes de contratos/regras.
  Ajuda do superadmin está implementada e revisada em `/super-admin/ajuda`;
  consulte `docs/frontend/SUPERADMIN_DEMO.md`. Preservar o provider da área,
  os avisos de descarte ao sair e a indisponibilidade de Planos e assinaturas.
  Uma recomendação não constitui aprovação dessas regras ou
  autorização para implementar. Pedidos parciais continuam limitados ao recorte
  solicitado, sem outra reformulação do Header ou mudança de domínio implícita.
- Nas entregas demonstrativas desse roadmap, não altere backend ou banco.
  Enquanto o OpenAPI mantiver `paths: {}`, use fixtures locais em memória,
  sem inventar endpoints, autenticação ou persistência em `localStorage`.
- Não apresente simulação como reserva, autenticação ou autorização real.
  Registre apenas testes efetivamente executados e suas limitações.
- Priorize mobile-first.
- Utilize Server Components por padrão.
- Adicione `"use client"` apenas quando necessário.
- Organize funcionalidades dentro de `src/features`.
- Não acesse o banco de dados diretamente.
- Toda comunicação com o backend deve ocorrer pela API REST.
- Não invente tipos que contradigam o contrato OpenAPI.
- Preserve o padrão aprovado em 2026-10-07 dos botões primários públicos:
  `bg-sky-500`, texto `#07111C` e hover sem alteração do tom de azul. A decisão
  explícita substitui o texto branco anterior para corrigir o contraste. `sky-400` fica reservado
  a destaques e foco, não ao fundo desses botões. Nos perfis públicos, reutilize
  `catalogActionClass` de `src/features/barbershop-catalog/styles.ts`, incluindo
  o hover com ampliação e respeito a movimento reduzido. Não crie uma variante
  de cor sem solicitação explícita do usuário. Consulte `docs/design/README.md`.

## Backend

Ao trabalhar no backend:

- Preserve o isolamento por `tenant_id`.
- Não aceite o `tenant_id` fornecido livremente pelo cliente em rotas privadas.
- Utilize arquitetura modular orientada a funcionalidades.
- Mantenha controllers, services, repositories e DTOs separados.
- Entidades críticas devem utilizar exclusão lógica quando definido no ADR.

## Segurança

- Nunca exponha dados de um tenant para outro.
- Nunca armazene senhas sem hashing.
- Nunca coloque chaves privadas em arquivos versionados.
- Não execute comandos destrutivos sem autorização.
