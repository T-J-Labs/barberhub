# Fluxo API-First do frontend

## Visão geral

O fluxo configurado neste projeto é:

```text
docs/api/openapi.yaml
          |
          v
        Orval ---------> tipos e funções Axios
          |
          +------------> handlers de mock do MSW
                                  |
                                  v
                         navegador ou Next.js
```

O OpenAPI é a fonte de verdade. Arquivos dentro de
`frontend/src/lib/api/generated` são derivados desse contrato e não devem ser
editados manualmente.

## Tecnologias e quando usar

### OpenAPI

É o contrato legível por pessoas e ferramentas. Use quando dois sistemas
precisam concordar sobre uma API: frontend e backend, serviços internos ou uma
integração externa.

Ele evita acordos vagos como “a API retorna um serviço”. O contrato registra
campos, tipos, códigos HTTP, headers e erros. O arquivo sozinho não obriga uma
implementação a obedecê-lo; geração, revisão e testes tornam o acordo
verificável.

### Axios

É o cliente HTTP executado pela aplicação. Use para enviar requisições,
configurar URL base, headers e tratamento comum de erros.

`src/lib/api/axios-instance.ts` contém uma única instância compartilhada. O
Orval direciona todas as funções geradas para ela. Requisições públicas recebem
`X-Tenant-Subdomain` por `publicTenantRequest`; requisições privadas recebem
Bearer JWT por `authenticatedRequest`.

O frontend nunca deve enviar um `tenant_id` escolhido pelo cliente em uma rota
privada.

### Orval

É um gerador executado somente no desenvolvimento. Ele lê o OpenAPI e produz:

- modelos TypeScript;
- funções Axios com caminhos e payloads tipados;
- handlers do MSW compatíveis com as respostas do contrato.

Use quando copiar tipos e escrever funções HTTP manualmente começar a causar
divergências. Não é necessário no código de produção e não substitui o Axios;
ele escreve código Axios para o projeto.

### MSW

Mock Service Worker intercepta requisições na camada de rede. Para a aplicação,
parece que o backend respondeu normalmente. Isso permite desenvolver estados de
sucesso, carregamento e erro antes do backend estar pronto.

Neste projeto ele é iniciado no navegador por `instrumentation-client.ts` e no
Node.js por `instrumentation.ts`. A parte Node é importante porque Server
Components fazem suas requisições no servidor do Next.js. Ambos exigem
`NODE_ENV=development`, evitando que o mock seja ativado em produção mesmo se a
variável de ambiente for configurada incorretamente.

Use MSW para desenvolvimento isolado, testes de interface e reprodução de
erros. Desative-o para validar a integração real.

### Faker

É usado pelo gerador de mocks para produzir dados fictícios compatíveis com os
schemas OpenAPI. Use para preencher listas e variações sem manter grandes
arquivos manuais. Para cenários importantes de negócio, prefira sobrescrever o
mock com valores explícitos e previsíveis.

## Comandos

Execute dentro de `frontend`:

```bash
npm run api:generate
```

Gera novamente o cliente, os modelos e os mocks. A geração também acontece
antes de `npm run dev` e `npm run build`.

```bash
npm run api:watch
```

Mantém o Orval observando o contrato durante uma sessão dedicada de trabalho.

```bash
npm run lint
npm run typecheck
npm run build
```

Validam estilo, tipos e build de produção.

## Alternando mock e backend real

Em `.env.local`, para desenvolver sem backend:

```env
NEXT_PUBLIC_API_MOCKING=enabled
```

Para integrar com a API real:

```env
NEXT_PUBLIC_API_MOCKING=disabled
```

Sempre reinicie `npm run dev` depois de alterar variáveis de ambiente.

## Quando o primeiro endpoint for aprovado

1. Adicione a operação ao `openapi.yaml` com um `operationId` único e uma tag.
2. Execute `npm run api:generate`.
3. Confira os arquivos gerados; não os edite.
4. Importe o agregador de handlers gerado em `src/mocks/handlers.ts`.
5. Use a função Axios gerada dentro da feature correspondente em
   `src/features`.
6. Passe `publicTenantRequest(subdomain)` nas opções de rotas públicas ou
   `authenticatedRequest(token)` nas privadas.

O armazenamento do JWT ainda precisa ser acordado com o backend. Não adote
`localStorage` automaticamente; cookie `HttpOnly` ou uma camada BFF costumam
reduzir a exposição do token a scripts.
