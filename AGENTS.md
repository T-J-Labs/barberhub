# Instruções para agentes de IA

## Contexto

Este repositório contém um sistema SaaS multi-tenant para gestão e agendamento de barbearias.

Antes de sugerir ou implementar alterações, leia:

- `docs/architecture/ADR.md`
- `README.md`

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

- Priorize mobile-first.
- Utilize Server Components por padrão.
- Adicione `"use client"` apenas quando necessário.
- Organize funcionalidades dentro de `src/features`.
- Não acesse o banco de dados diretamente.
- Toda comunicação com o backend deve ocorrer pela API REST.
- Não invente tipos que contradigam o contrato OpenAPI.

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