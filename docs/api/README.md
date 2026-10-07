# Contrato da API

`openapi.yaml` é a fonte de verdade compartilhada por frontend e backend. Ele
descreve o endereço de cada operação, dados de entrada, respostas e erros antes
da implementação.

O contrato começa com `paths: {}` porque ainda não existe nenhum endpoint
aprovado no repositório. O frontend não deve preencher essa seção sozinho nem
inventar uma rota para atender uma tela.

## Processo para uma nova operação

1. Frontend e backend combinam comportamento e regras.
2. A operação é adicionada ao `openapi.yaml`, incluindo um `operationId` único.
3. A alteração do contrato é revisada pelos dois lados.
4. O frontend executa `npm run api:generate`.
5. Frontend desenvolve contra o mock enquanto o backend implementa o contrato.
6. A integração substitui o mock pela API real sem alterar o formato dos dados.

Se a implementação real divergir, ela deve ser corrigida ou o contrato deve ser
alterado e novamente aprovado. O OpenAPI não corrige o backend sozinho; ele
fornece o acordo verificável usado por geração de código, mocks e testes.

## Geração e uso no frontend

As instruções de `docs/frontend/API_FIRST.md` foram condensadas aqui em
2026-10-07 para manter contrato e fluxo de integração em uma única referência.

```text
docs/api/openapi.yaml → Orval → modelos e funções Axios
                            → handlers MSW com dados Faker
```

- OpenAPI registra caminhos, payloads, headers, respostas e erros acordados.
- Orval é uma ferramenta de desenvolvimento. Gera código em
  `frontend/src/lib/api/generated`, que não deve ser editado manualmente.
- Axios executa as requisições. `frontend/src/lib/api/axios-instance.ts` mantém
  a instância compartilhada e o mutator `apiClient` usado pelo Orval.
- MSW intercepta a rede para desenvolvimento e reprodução de estados antes da
  integração. `instrumentation-client.ts` inicia o navegador e `instrumentation.ts`
  inicia Node/Server Components; ambos exigem desenvolvimento. Desative mocks
  para validar a API real. O worker MSW é separado do worker da PWA.
- Faker fornece dados aos mocks gerados. Cenários importantes de negócio devem
  usar valores explícitos e previsíveis, sem depender de amostras aleatórias.

Na pasta `frontend`:

```bash
npm run api:generate # Gera cliente, modelos e mocks; também roda antes de dev/build
npm run api:watch    # Observa alterações do contrato durante desenvolvimento
npm run lint
npm run typecheck
npm run build
```

Em `.env.local`, `NEXT_PUBLIC_API_MOCKING=enabled` habilita mocks somente em
desenvolvimento; `disabled` permite validar a integração real. Reinicie o
servidor após alterar variáveis. Enquanto `paths: {}`, não há handlers gerados
para operações nem integração aprovada; as demonstrações usam fixtures em memória.

Após a primeira operação ser aprovada, gere o cliente, confira os arquivos,
importe o agregador MSW em `src/mocks/handlers.ts` e use a função Axios gerada na
feature correspondente de `src/features`. Rotas da API mantêm `/api/v1`.

## Contexto e autorização

Requisições públicas de uma barbearia usam `publicTenantRequest(subdomain)` para
`X-Tenant-Subdomain`; o catálogo global não exige tenant. Requisições privadas
podem usar `authenticatedRequest(token)`, conforme o contrato aprovado. Esses
helpers não concedem autorização nem certificam uma sessão real.

Nunca envie `tenant_id` livremente escolhido pelo cliente como autorização de
rota privada. Conforme o ADR 08, identidade do cliente é global; o backend
resolve os recursos, verifica titularidade e limita a área pessoal às reservas
do cliente autenticado, preservando o isolamento operacional entre tenants.

Armazenamento/transporte do JWT ainda exigem acordo com o backend. Não adote
`localStorage` automaticamente; cookie `HttpOnly` ou BFF são possibilidades a
avaliar nesse contrato, não decisões implementadas. Consulte
[ADR](../architecture/ADR.md) e [autenticação do cliente](../frontend/CLIENT_AUTH.md).
