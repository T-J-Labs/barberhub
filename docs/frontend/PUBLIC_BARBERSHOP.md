# Perfil público da barbearia

## Rota e contexto público

`/barbearias/[subdomain]` continua a descoberta iniciada em `/barbearias`.
O catálogo não tinha rota individual nem resolução por host implementada.
Foi adotada a chave pública `subdomain`, prevista no ADR, sem introduzir outro
slug ou aceitar `tenant_id`. As fixtures compartilham os identificadores
`demo-esquina`, `demo-navalha`, `demo-vila`, `demo-oficina`, `demo-raizes` e
`demo-bairro`. `id` continua sendo apenas a chave local dos cards.

A entrada direta em `<subdomain>.<domínio-base>/` faz rewrite para a mesma
página, mantendo a URL pública. `next.config.ts` compara o Host com o domínio-base
configurado em `BARBERHUB_PUBLIC_HOST` (hostname sem protocolo, porta ou caminho).
Em desenvolvimento o padrão é `localhost`; em produção o operador precisa
configurar o domínio-base antes do build e prover DNS/certificado para os
subdomínios. Sem essa configuração não há rewrite de produção. O domínio-base
continua servindo a landing comercial, e hosts arbitrários não são tratados como
estabelecimentos. Não são usados `X-Forwarded-Host`, cookies ou parâmetros de
query para resolver o perfil. Os caminhos explícitos sempre resolvem sua própria
chave pública; o rewrite por host se aplica somente à raiz `/`.

Esta resolução seleciona uma apresentação fictícia, não estabelece contexto
autorizado no backend. Não há mudança na autorização privada ou na arquitetura
de dados. Na integração futura a operação pública aprovada receberá
`publicTenantRequest(subdomain)`; o backend validará existência, atividade e
publicação do estabelecimento. Selecionar um perfil nunca concede acesso privado.

## Composição e UX

Direção visual: identidade de uma barbearia de bairro, com monograma em formato
de letreiro como elemento principal, em vez de uma foto fictícia.

A hero apresenta uma única logo circular, usando `BarbershopLogo` e a fonte
local de apresentação `logoSrc`, com `object-contain` para preservar a imagem
inteira. Sem imagem, mostra as iniciais. O antigo quadrado pequeno foi removido.
No celular, a logo aparece centralizada acima do nome, com 144px; em telas médias,
192px; no desktop, até 256px na coluna direita. A localização fica imediatamente
abaixo do título com o nome da barbearia. O círculo representa a logo, sem foto de capa.
Na integração, mapear a logo pública aprovada para essa fonte única e configurar
os hosts de imagens autorizados no Next.js; `logoSrc` não é um campo OpenAPI.

Tipografia Geist, nome grande e alinhado à esquerda, sem nova fonte ou dependência.
Tokens reutilizados: fundo `#07111C`, alternado `#0A1521`, superfície `#0D1722`,
azul de ação `#0EA5E9`, corpo `#B6C2D1` e borda `#26384A`. A revisão do plano
concentrou o destaque no letreiro e adotou listas de serviços em vez de uma grade
de cards idênticos. Não há estatísticas, avaliações ou promessas de disponibilidade.

No celular, a ordem é identidade, ações, serviços, equipe, agendamento e informações
de visita. Em telas grandes, localização, funcionamento e contato ficam em uma
coluna lateral. Âncoras oferecem navegação local sem JavaScript. Áreas de toque
têm pelo menos 44px, o foco é visível e o skeleton respeita movimento reduzido.
O CTA reutiliza `catalogActionClass`: fundo `sky-500`, texto branco e hover
com ampliação de 5%, sem clarear para `sky-400`, respeitando movimento reduzido.
Essa orientação também está registrada em `AGENTS.md` para próximas alterações.

Reutilizados `Container`, layout/header/footer públicos e estilos do catálogo.
Os componentes e modelos ficam em `src/features/public-barbershop`. A página e
seus componentes são Server Components; somente `error.tsx` é Client Component
para chamar `reset`. A antiga prévia em diálogo do catálogo foi removida.
Metadados por estabelecimento usam `noindex` enquanto houver dados fictícios.

## Dados demonstrativos e limites

O OpenAPI tem `paths: {}`: **nenhum endpoint, DTO, campo ou parâmetro OpenAPI é
consumido**. `X-Tenant-Subdomain` existe no contrato, mas não é enviado nesta
entrega, pois não há operação HTTP aprovada. Não houve alteração no backend,
no contrato ou no cliente gerado, nem acesso ao banco ou dados administrativos.

Nome, iniciais, cidade e bairro são as fixtures existentes do catálogo.
Descrição, serviços com preços/durações, dois profissionais e funcionamento
do perfil `demo-esquina` são exclusivamente exemplos locais de apresentação.
Os demais perfis exibem ausência de serviços, profissionais e horários.
Não há endereço completo, números de telefone, links de WhatsApp, fotos,
galeria, avaliações, mapa, disponibilidade ou estado “aberto agora” simulados.
Informações ausentes são descritas de forma explícita, sem controles sem destino.

Não existem páginas de login/cadastro nem fluxo de reserva implementados,
embora o header institucional já contenha links conceituais de autenticação.
O CTA **Agendar horário** leva à seção local `#agendamento`, que informa que
a reserva ainda está indisponível. O aviso também aparece junto ao CTA.
Não há wizard, seleção fictícia de horário ou confirmação. Quando o fluxo real
existir, substituir a âncora pelo destino aprovado, preservando o estabelecimento
e o retorno após autenticação com destinos internos validados.

## Estados e verificação

- `loading.tsx`: skeleton e anúncio de carregamento.
- `error.tsx`: mensagem de falha, tentativa com `reset` e retorno ao catálogo.
- `not-found.tsx`: identificador inválido/desconhecido ou estabelecimento ausente,
  com retorno ao catálogo e `notFound()` do Next.js. Com streaming já iniciado
  pelo loading boundary, o Next pode responder HTTP 200 com a tela de inexistência
  e `noindex`; sem streaming iniciado, responde 404.
- Em desenvolvimento, `/barbearias/demo-esquina?estado=loading`, `estado=error`
  e `estado=not-found` permitem inspecionar os estados. O retry remove a query.
  `estado` é ignorado em produção e não integra a identidade pública.
- `/barbearias/demo-navalha` permite conferir os dados opcionais ausentes.
- `/barbearias/nao-existe` permite conferir inexistência real da fixture.
- `http://demo-esquina.localhost:3000/` permite conferir entrada pelo host local.

ESLint, TypeScript e build de produção passaram. Foram aprovadas 18 verificações
HTTP em desenvolvimento e 18 em produção: catálogo, seis perfis, dados opcionais
ausentes, identificadores inválidos/desconhecidos, query `tenant_id` sem efeito,
estados de desenvolvimento, entrada por subdomínio, host externo e landing.
Em produção, os três valores de `estado` foram confirmados como ignorados.
A revisão visual e as interações
em 390px/1280px ficam pendentes, pois não há navegador conectado nesta sessão.
O chat “Arquiteto de Software” não estava acessível pelas ferramentas; as decisões
complementares utilizadas são as documentadas no ADR e no plano do cliente.

## Arquivos da entrega

- Criados em `frontend/src/features/public-barbershop`: `types.ts`, `mock-data.ts`,
  `routing.ts`, `barbershop-presentation.ts`, `styles.ts` e os componentes
  `ProfileShell.tsx`, `ProfileHero.tsx`, `ProfileView.tsx`, `ProfileState.tsx`
  e `BarbershopLogo.tsx`.
- Criados em `frontend/src/app/(public)/barbearias/[subdomain]`: `page.tsx`,
  `loading.tsx`, `error.tsx`, `not-found.tsx`.
- Alterados em `barbershop-catalog`: `types.ts`, `mock-data.ts` e
  `components/BarbershopCard.tsx`; removido `components/BarbershopPreview.tsx`.
- Alterados `frontend/next.config.ts`, `frontend/.env.example`, `README.md` e
  `docs/frontend/BARBERSHOP_CATALOG.md`; criado este documento.

## Integração futura

1. Aprovar no OpenAPI os dados públicos, serviços ativos, equipe publicável,
   funcionamento, contato, estados HTTP e regras de publicação/suspensão.
2. Gerar Orval/MSW e substituir `getPublicBarbershopPresentation` pela operação
   pública aprovada sob `/api/v1`, usando a chave validada da rota/host.
3. Retirar fixtures e rótulos demonstrativos, confirmar isolamento/cache por
   estabelecimento e habilitar indexação somente para perfis publicados reais.
4. Implementar conta global e agendamento em suas respectivas entregas, com
   validação de autorização, titularidade e disponibilidade no backend.
5. Configurar domínio-base, DNS e TLS; validar entrada direta e retorno de
   autenticação no domínio da plataforma e nos subdomínios de produção.
