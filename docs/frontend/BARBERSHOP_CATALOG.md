# Catálogo público de barbearias

## Rota e organização

`/barbearias` pertence a `app/(public)` e reutiliza header, footer e Container.
A landing comercial continua em `/`; seu menu institucional não inclui o catálogo.
As âncoras da navegação pública apontam
para `/#...`, permitindo retornar às seções a partir do catálogo. A navegação
do cliente também oferece acesso ao catálogo público, sem exigir um tenant.

A implementação fica em `src/features/barbershop-catalog`. Página, filtros,
cards e estados são Server Components. O formulário `next/form` usa navegação
GET com `q` e `cidade` na URL, com suporte a links compartilhados e histórico.
Esses parâmetros são exclusivos da interface, não parâmetros de uma API.
Somente a prévia em diálogo e o boundary de erro usam `"use client"`.

## Experiência

- Busca local por nome, cidade ou bairro, ignorando maiúsculas e acentos.
- Filtro por cidade derivado das fixtures e aplicado junto com a busca.
- Cards em uma coluna no celular, duas a partir de `sm` e três em `lg`.
- Nome e localização como informação principal; iniciais como fallback visual
  de logo, sem imagens remotas, avaliações, preços ou disponibilidade fictícia.
- Controles de pelo menos 44px, rótulos explícitos, foco visível e skeleton com
  movimento desativado para quem prefere movimento reduzido.
- Prévia reutiliza `DemoDialog`; a página individual da barbearia é a próxima
  entrega e não recebe um link para uma rota inexistente.
- Estado vazio distingue catálogo sem estabelecimentos de busca sem resultados.
- `loading.tsx` apresenta skeleton durante a navegação; `error.tsx` permite
  tentar novamente pelo `reset` do Next.js.

## Revisão de interface

- Botões principais do catálogo usam `sky-500` com rótulos brancos, alinhados
  aos botões Entrar e Registrar do header institucional, com cursor de clique
  e ampliação de 5% no hover em 300ms, respeitando a preferência por movimento reduzido.
  O azul claro do catálogo continua reservado aos destaques e foco.
- O select mantém comportamento nativo, seta a 16px da borda e 48px de espaço
  à direita do texto; em cores forçadas, volta à seta nativa do sistema.
- A prévia usa a variante pública de `DemoDialog`, com superfície `#0D1722`
  e foco `sky-400`. A variante administrativa continua sendo o padrão.
- A navegação pública identifica a página atual com `aria-current` e destaque
  visual no desktop e mobile.
- Cards, resultados e títulos do diálogo admitem quebra de palavras longas.

A revisão preserva a composição mobile-first, o tamanho dos controles, os
estados existentes e o uso de Server Components. A validação visual em navegador
continua pendente por ausência de navegador conectado.

## Integração pendente

O contrato `docs/api/openapi.yaml` ainda tem `paths: {}`. Nenhum endpoint,
schema, campo OpenAPI ou header de tenant é utilizado por esta entrega.
Os campos em `types.ts` são exclusivamente de apresentação; os estabelecimentos
em `mock-data.ts` são fictícios e a tela informa isso. A página não é indexável
enquanto houver fixtures. Não há requisições HTTP, autenticação ou persistência.

`getCatalogPresentation` é o ponto de substituição da fonte demonstrativa.
Antes da integração, aprovar dados públicos, critérios de publicação, busca,
destino da página individual e eventual paginação no OpenAPI; gerar o cliente
Orval e usar as operações aprovadas sob `/api/v1`. O catálogo global não deve
impor `X-Tenant-Subdomain`. Nenhum `tenant_id` é enviado ou usado como autorização.
Não há paginação demonstrativa, porque o contrato ainda não prevê esse recurso.

## Verificação manual

Em desenvolvimento, estados podem ser inspecionados sem alterar as fixtures:

- `/barbearias?estado=loading`: carregamento.
- `/barbearias?estado=empty`: ausência de estabelecimentos.
- `/barbearias?estado=error`: erro com ação de recuperação.
- `/barbearias?q=sem-correspondencia`: busca sem resultados.
- `/barbearias?q=meier`: busca sem acento encontra Méier.
- `/barbearias?cidade=Nova%20Igua%C3%A7u`: filtro por cidade.

`estado` é ignorado em produção. Validar também a limpeza dos filtros, o
histórico do navegador, a prévia (Escape e retorno do foco), o menu público e
as âncoras da landing em larguras de 390px e 1280px.

Validação desta entrega: ESLint, TypeScript e build de produção aprovados.
Nove verificações HTTP da renderização SSR cobriram catálogo, busca sem acentos,
filtro por cidade, combinação de filtros, parâmetros repetidos e os três estados
demonstrativos. A revisão visual e as interações no navegador permanecem
pendentes: nenhum navegador conectado estava disponível na sessão.
