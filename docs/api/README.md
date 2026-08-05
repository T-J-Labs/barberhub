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
