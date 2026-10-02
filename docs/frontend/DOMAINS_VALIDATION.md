# Validação de domínios e subdomínios

Verificação local em 2 de outubro de 2026. Alterações deixadas sem commit.

## Correções

- Um perfil diferente podia ser mostrado mantendo o subdomínio original.
  Agora `demo-esquina.localhost:3000/barbearias/demo-vila` recebe HTTP 307
  para `demo-vila.localhost:3000/`, preservando a query string.
- Links institucionais e a marca no rodapé de um perfil permaneciam dentro
  do subdomínio, onde as seções da plataforma não existem. Agora apontam para
  o domínio-base configurado.
- Um hostname com ponto final de DNS caía na landing. Agora o subdomínio é
  reconhecido e normalizado, preservando a porta e os parâmetros.
- A resolução da origem rejeitava portas padrão explícitas (`:80`/`:443`).
  Agora aceita essas formas e normaliza a URL.
- A URL por caminho no domínio-base agora também redireciona para o subdomínio;
  a rota interna deixa de ser uma alternativa pública.
- No servidor de produção vinculado a `127.0.0.1`, a normalização automática
  do Next convertia o destino do rewrite para `localhost`, disparando um proxy
  externo que substituía o Host do estabelecimento. `skipProxyUrlNormalize`
  e o destino criado com `new URL(request.url)` mantêm o rewrite interno.
  A correção foi validada com `next start -p 3103 -H 127.0.0.1`.

## Verificações realizadas

| Ambiente | Resultado |
| --- | --- |
| Resolução de hosts e links, sem servidor | 3 testes de regressão passaram |
| Desenvolvimento, localhost:3000 | 15 testes HTTP passaram, incluindo subdomínio obrigatório e headers contextuais |
| Build de produção, porta 3103, domínio barberhub.test, bind 127.0.0.1 | Os mesmos 15 testes HTTP passaram |
| Produção sem domínio configurado, porta 3104 | 3 verificações passaram: landing, catálogo sem links de perfil e perfil indisponível |
| Navegador, larguras 390 e 1440 | 12 percursos: catálogo → perfil → catálogo passaram |
| Navegador, casos adicionais | Filtros repetidos, mudança entre subdomínios, link Produto do rodapé, nova tentativa e perfil inexistente passaram |
| Lint, TypeScript e build | Passaram; landing continua estática |

Os testes cobrem os seis estabelecimentos demonstrativos, caminhos explícitos,
query string, subdomínio inexistente, URL inexistente, caixa do hostname,
ponto final de DNS, portas alternativas/padrão e hosts externos. Também
verificam que `X-Forwarded-Host`, `X-Forwarded-Proto` e parâmetros de tenant
não alteram a seleção do estabelecimento ou a origem dos links e redirects.
Os casos de parâmetros codificados comparam seus valores, ordem e repetição,
permitindo normalizações equivalentes de espaços (`%20`/`+`).

O proxy usa a configuração explícita `BARBERHUB_PUBLIC_HOST` e o cabeçalho Host
validado. A configuração é compartilhada com os links renderizados no servidor.
Os testes de produção simulam o Host em conexões HTTP locais e verificam os
destinos HTTPS gerados; DNS público, certificados TLS e infraestrutura de
implantação não foram exercitados.

## Limites e pendências existentes

- `/login` e `/register` retornam 404 porque essas telas ainda não existem.
  Autenticação real e navegação do cliente permanecem para a entrega posterior.
- As páginas administrativas são demonstrativas. Esta validação não confirma
  autenticação ou isolamento de dados privados no backend.
- No App Router, redirects e not-found após o início do streaming podem usar
  status HTTP 200 com instruções no HTML. O catálogo muda corretamente para o
  domínio-base no navegador; o perfil inexistente mostra a tela apropriada.
- Os testes HTTP conferem metadados, links, header contextual e o `h1` quando
  já estiver presente no HTML. Um skeleton pode preceder a view final entregue
  pelo fluxo RSC; o título visível e o estado final são conferidos no navegador.
  Uma resposta `200` ou um texto isolado no payload não basta para validar a UI.
- Hosts externos e IPs não são interpretados como tenants. Permitem a landing
  e o catálogo, mas não exibem perfis nem links de perfil por caminho.

## Regra obrigatória de subdomínio

Após a confirmação do requisito, `/barbearias/[subdomain]` passou a ser apenas
uma rota interna de renderização. Qualquer acesso externo nesse caminho em
um Host confiável recebe HTTP 307 para `<subdomain>.<domínio-base>/`, com os
parâmetros preservados. Em hosts não reconhecidos, o perfil fica indisponível.
Os links dos cards exigem uma origem pública válida e não têm fallback por
caminho. A página ainda verifica se o Host corresponde à chave da barbearia.
Os testes HTTP foram atualizados para exigir essa regra nos seis perfis.

## Reexecutar

Na pasta `frontend/`:

```powershell
npm run test:routing
# Em outro terminal, manter npm run dev ativo:
npm run test:routing:http
```

Para repetir a validação de produção, gere e inicie o build com o domínio-base
configurado. Este servidor fica restrito ao loopback; o teste simula o Host
e valida URLs HTTPS, sem usar DNS público ou terminar TLS:

```powershell
$env:BARBERHUB_PUBLIC_HOST = 'barberhub.test'
npm run build
npm run start -- -p 3103 -H 127.0.0.1
```

Em outro terminal, execute:

```powershell
$env:TEST_PORT = '3103'
$env:TEST_PUBLIC_HOST = 'barberhub.test'
$env:TEST_PROTOCOL = 'https:'
npm run test:routing:http
```
