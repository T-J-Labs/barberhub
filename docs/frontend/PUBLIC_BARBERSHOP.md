# Perfil público da barbearia

## Rota e contexto público

`<subdomain>.<domínio-base>/` continua a descoberta iniciada em `/barbearias`.
`/barbearias/[subdomain]` é apenas a rota interna de renderização do rewrite.
Foi adotada a chave pública `subdomain`, prevista no ADR, sem introduzir outro
slug ou aceitar `tenant_id`. As fixtures compartilham os identificadores
`demo-esquina`, `demo-navalha`, `demo-vila`, `demo-oficina`, `demo-raizes` e
`demo-bairro`. `id` continua sendo apenas a chave local dos cards.

A entrada direta em `<subdomain>.<domínio-base>/` faz rewrite para a mesma
página, mantendo a URL pública. `src/proxy.ts` compara o Host com o domínio-base
configurado em `BARBERHUB_PUBLIC_HOST` (hostname sem protocolo, porta ou caminho).
Em desenvolvimento o padrão é `localhost`; em produção o operador precisa
configurar o domínio-base antes do build e prover DNS/certificado para os
subdomínios. Sem essa configuração não há rewrite de produção. O domínio-base
continua servindo a landing comercial, e hosts arbitrários não são tratados como
estabelecimentos. Não são usados `X-Forwarded-Host`, cookies ou parâmetros de
query para resolver o perfil. Os perfis públicos só são exibidos na raiz do seu
respectivo subdomínio. Tanto no domínio-base quanto em um subdomínio,
`/barbearias/[subdomain]` redireciona com HTTP 307 para a raiz
do estabelecimento indicado no caminho, inclusive se for outro estabelecimento.
Assim o perfil exibido corresponde ao hostname visível. O rewrite por host se
aplica somente à raiz `/`; caixa e ponto final de DNS são normalizados na
resolução, e subdomínios com ponto final redirecionam para a forma canônica.
`skipProxyUrlNormalize` preserva a URL interna do servidor, e o rewrite usa
`new URL(request.url)`. Isso evita que a normalização de `127.0.0.1` para
`localhost` transforme o rewrite em um proxy externo e substitua o Host
validado do estabelecimento. A seleção do perfil continua ignorando
`X-Forwarded-Host` e `X-Forwarded-Proto`.

Os cards do catálogo abrem a raiz do subdomínio quando o Host pertence ao
domínio-base configurado. Em desenvolvimento, `localhost:3000/barbearias`
leva a `http://demo-esquina.localhost:3000/`, preservando a porta em uso.
Em produção, os links usam HTTPS e `BARBERHUB_PUBLIC_HOST`. Hosts externos,
acesso por IP e produção sem domínio configurado não podem exibir os perfis.
Nesses acessos, os cards não oferecem um link alternativo por caminho.
A origem é calculada no servidor, usando apenas o Host validado; cabeçalhos
encaminhados não definem o domínio dos links. A rota interna por caminho é
destino exclusivo do rewrite; uma requisição externa nunca exibe o perfil
mantendo esse caminho na URL. Novas tentativas retornam à raiz do subdomínio.

Os links “Todas as barbearias” e “Explorar barbearias” retornam ao catálogo
no domínio-base, inclusive quando o perfil foi aberto pelo subdomínio. O layout
do perfil fornece esse destino calculado no servidor aos links compartilhados
com os estados de carregamento, erro e barbearia não encontrada. Em localhost,
o retorno é `http://localhost:3000/barbearias`, preservando a porta em uso.

O catálogo não é servido dentro dos subdomínios dos estabelecimentos. O acesso
direto a `demo-esquina.localhost:3000/barbearias` redireciona no servidor para
`localhost:3000/barbearias`, preservando os parâmetros de busca, inclusive
parâmetros repetidos. O domínio-base serve o catálogo normalmente, sem loop;
hosts externos e acesso por IP não são convertidos em domínios de tenants.
O redirecionamento do catálogo usa `redirect()` do App Router: após o início
do streaming, o Next pode comunicá-lo no HTML em uma resposta 200. Os
redirecionamentos de perfil e normalização do hostname usam HTTP 307 no proxy.
Isso evita a conversão indevida para URL relativa que o proxy do Next faz
em redirecionamentos para `localhost` com a configuração padrão do servidor.

O header recebe um contexto explícito de `PublicHeaderRoute`, derivado dos
segmentos da rota renderizada pelo App Router. O destino do rewrite identifica
o estabelecimento mesmo quando a URL visível e `usePathname()` continuam em
`/`. Os contextos de catálogo e estabelecimento exibem somente marca e ações
de acesso; links institucionais e destaque de seção ficam restritos à landing.
Esta composição preserva a renderização estática da landing e não introduz
uma segunda regra de resolução de host no navegador.

O rodapé do catálogo e dos perfis recebe a origem da plataforma no servidor.
Marca, seções institucionais e links de acesso apontam para esse domínio-base;
âncoras da própria barbearia continuam locais. A landing compõe seu rodapé
estático, enquanto o layout de `/barbearias` compõe o rodapé dependente do Host.

## Validação de domínios

Execute `npm run test:routing` em `frontend/` para validar resolução e geração
de links sem servidor. Com `npm run dev` na porta 3000, execute
`npm run test:routing:http` para os testes HTTP. Para outra instalação, configure
`TEST_PORT`, `TEST_PUBLIC_HOST` e `TEST_PROTOCOL` conforme o servidor. Os testes
conectam apenas a `127.0.0.1`, simulando o Host; não exigem DNS público ou TLS.
Resultados e limitações estão em [DOMAINS_VALIDATION.md](DOMAINS_VALIDATION.md).

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
- Em desenvolvimento, `http://demo-esquina.localhost:3000/?estado=loading`, `estado=error`
  e `estado=not-found` permitem inspecionar os estados. O retry remove a query.
  `estado` é ignorado em produção e não integra a identidade pública.
- `http://demo-navalha.localhost:3000/` permite conferir os dados opcionais ausentes.
- `http://demo-inexistente.localhost:3000/` permite conferir inexistência real da fixture.
- `http://demo-esquina.localhost:3000/` permite conferir entrada pelo host local.

Na revisão atual, lint, TypeScript e build passaram, além de 3 testes unitários
de roteamento e 15 testes HTTP em desenvolvimento e no build de produção local.
Os testes cobrem os seis perfis, redirects para a URL pública, parâmetros
repetidos/codificados, headers contextuais, hosts não reconhecidos e cabeçalhos
encaminhados sem efeito sobre identidade ou origem. A renderização final no
navegador complementa a validação HTTP, pois o streaming pode entregar um
skeleton e componentes RSC antes do conteúdo final. Consulte
[DOMAINS_VALIDATION.md](DOMAINS_VALIDATION.md) para os percursos e limitações.
As decisões de produto continuam registradas no ADR e no plano do cliente.

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
