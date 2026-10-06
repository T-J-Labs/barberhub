# Cadastro e login com Google

Decisão de produto de 2026-10-04: usar somente Google. Cadastro oferece Cliente,
Barbeiro e Barbearia (proprietário). Não há campos de e-mail/senha, senha local,
redefinição de senha, SDK ou endpoints de autenticação inventados.

## Interface e domínio

- `/login` e `/cadastro` são servidos no domínio principal. Acesso por um
  subdomínio confiável redireciona ao domínio principal com contexto validado.
- Catálogo e conta têm escopo global. Perfis públicos seguem na raiz dos
  subdomínios, usando o roteamento existente em `src/proxy.ts`.
- `/register` é compatibilidade para `/cadastro?perfil=barbearia`.
- A logo no login/cadastro leva à landing institucional (`/`). No catálogo e
  nos perfis públicos, leva ao catálogo (`/barbearias`). O botão do Header usa
  “Criar conta” para todos os perfis. O retorno à barbearia é uma ação separada.
- CTAs institucionais preselecionam Barbearia. Header e rodapé distinguem
  acesso comum, conta de cliente e cadastro de estabelecimento.
- `perfil` admite apenas `cliente`, `barbeiro` e `barbearia`. Valores inválidos
  ou repetidos usam Cliente. O parâmetro é intenção visual, nunca autorização.
- `barbearia` identifica uma fixture pública conhecida, sem autenticar tenant.
  Alternância entre telas e escolha de perfil preservam esse contexto.
- O retorno de uma barbearia conhecida é sempre a raiz de seu subdomínio,
  mesmo se `returnTo` faltar, for inválido, repetido ou apontar ao caminho
  legado da plataforma. Não há redirecionamento para destinos arbitrários.
  Sem barbearia reconhecida, retornar ao catálogo.
- O CTA público “Agendar horário” abre a introdução de `/agendar` no subdomínio.
  O wizard pode ser experimentado sem autenticação. Seus links de login/cadastro
  preservam a barbearia e retornam à raiz do perfil, sem ampliar destinos permitidos.
  Consulte [CLIENT_BOOKING.md](CLIENT_BOOKING.md).
- A origem vem de `BARBERHUB_PUBLIC_HOST`; desenvolvimento usa localhost
  e a porta validada do Host. Produção usa HTTPS no domínio configurado.
  Host externo, IP e X-Forwarded-Host não autorizam a tela de acesso.
  Sem configuração válida, controles de acesso ficam indisponíveis.

## Estado da integração

OpenAPI ainda tem `paths: {}`. O botão Google fica desabilitado com aviso visível.
Não há OAuth, criação de conta, vinculação de equipe, sessão ou logout real.
Existe onboarding demonstrativo independente, sem efeitos reais.
Escolher Barbeiro ou Barbearia não cria permissões.

A integração exige contratos aprovados para identidade Google validada no
backend, contas/vínculos, permissões, sessão e logout. Também é necessário
definir projeto/client IDs, callbacks, origens permitidas e sessão entre
plataforma e subdomínios. Nenhum segredo ou token foi adicionado.

## Onboarding demonstrativo do proprietário — 2026-10-06

No cadastro com perfil Barbearia, **Experimentar configuração** abre
`/onboarding/barbearia?origem=cadastro`, separado do Google indisponível.
Login/cadastro e retorno canônico permanecem iguais. A nova rota requer domínio
principal validado pelo helper existente; em subdomínio confiável redireciona
somente à mesma rota na plataforma, com origem demonstrativa validada. Host
externo e encaminhados não autorizam o wizard. A origem não representa papel.

O acesso direto escolhe entre cadastro e prévia de convite do superadmin.
O aceite fictício não valida identidade ou autenticação; o exemplo é independente
do rascunho. Dados ficam em memória e são descartados ao sair/recarregar.
Regra aprovada: liberação para publicação exige configuração mínima e compra
confirmada ou liberação explícita do superadmin. A entrega só apresenta cenários;
não executa compra, liberação, convite, provisionamento ou publicação.
[Percurso, validações, QA e integração pendente](OWNER_ONBOARDING.md).

## Prévia do header demonstrativo

ClientHeader oferece apresentação de visitante, cliente e saída. A opção
“Ver prévia do header de cliente” fica separada do botão Google e só aparece
para Cliente. O estado vive em memória React; recarregar ou mudar de domínio
volta a visitante. Não representa uma sessão autenticada.

Após sair, a mensagem de prévia exibida desaparece e o botão para iniciar outra
prévia reaparece. Durante a saída, esse botão fica bloqueado. Meus agendamentos
abre `/cliente/agendamentos`, uma demonstração pública com fixtures de uma
identidade fictícia ([limites e validação](CLIENT_APPOINTMENTS.md)). Perfil e Ajuda
abrem `/cliente/perfil` e `/cliente/ajuda`; nenhum horário é reservado. Grupos de rotas
e componentes de header não são mecanismos de autorização.

## Perfil e ajuda demonstrativos implementados

Entrega concluída em 2026-10-05: `/cliente/perfil`, `/cliente/ajuda`,
`/barbeiro/perfil` e `/barbeiro/ajuda`, conforme seção 7 do roadmap.
Os menus têm destinos existentes; o controle Perfil do barbeiro abre sua página.
Consulte [implementação e validação](PROFILE_HELP.md).

Editar o nome de exibição aplica apenas uma apresentação em memória do próprio
papel. Isso não altera nome, e-mail, avatar ou credenciais do Google, não cria
sessão, não ativa automaticamente a prévia do header e não concede permissões.
Estado local reinicia ao recarregar ou sair da área. A ajuda explica
os fluxos existentes e essas limitações, sem oferecer senha local ou prometer
autenticação, reserva ou alterações persistidas.

## Validação local original

Na pasta `frontend`:

```sh
npm run lint
npm run typecheck
npm run test:routing
npm run test:routing:http
npm run test:auth
npm run test:auth:http
npm run build
```

Os testes HTTP usam o servidor local ativo na porta 3000. Para outra porta:
`npm run test:auth:http -- 3103`. Para produção local configurada com o host
reservado `barberhub.test`: `npm run test:auth:http -- 3104 barberhub.test`.
Esse host só é enviado no header de teste; não altera DNS ou publica o produto.

Navegador: verificar os três perfis, alternância de telas, navegação por teclado,
iniciar prévia → sair → iniciar novamente e retorno ao subdomínio. Verificar
cadastro no celular e desktop, sem rolagem horizontal.

Nesta revisão passaram 62 verificações de autenticação/retorno, os três testes
de host existentes, 15 testes HTTP do roteamento público e 48 verificações HTTP
de autenticação tanto em desenvolvimento quanto em produção local. ESLint,
TypeScript e `npm run build` (Turbopack) também passaram. O ciclo de reinício
da prévia foi reproduzido no navegador em `localhost:3000`.

QA mobile original (anterior à revisão de 2026-10-06): a navegação da conta ocupa a largura disponível e alinha seus itens
à direita abaixo de `sm`, mantendo o dropdown dentro da tela quando o header
quebra linha. Menu aberto verificado em 320, 390, 768 e 1440px; em 320px suas
bordas no login ficam em 48 e 304px; cadastro também conferido em 320px, sem
corte. Evidências em `validation/client-menu-320.jpg` e
`validation/client-menu-responsive-results.json`.

## Navegação revisada — 2026-10-06

O padrão visual vigente é o header da landing. Visitantes no catálogo, perfil,
agendamento, login e cadastro usam menu à esquerda e marca centralizada abaixo
de `lg`; Entrar/Criar conta ficam no rodapé do drawer. No desktop, usam
`publicLoginClass` e `catalogActionClass`. Login/cadastro continuam com um único
header, logo para a landing, perfil visual e retorno canônico preservados.

A prévia do cliente usa drawer modal em todas as larguras, com Explorar barbearias, Minhas barbearias e
Meus agendamentos no bloco principal; Perfil e Ajuda ficam no rodapé separado,
acima da saída local, como no menu do barbeiro. O nome demonstrativo quebra
linha no drawer. Após ajuste solicitado, a barra da prévia usa o mesmo layout do
barbeiro, com Notificações e Perfil à direita, também no mobile. Notificações
abre um painel de demonstração vazio; Perfil leva a `/cliente/perfil`.
O botão de menu recebe
foco após a saída no mobile; no desktop, o foco segue para Entrar.
Recarregar continua restaurando visitante. Não há OAuth, sessão ou logout real.

Exclusivamente no catálogo `/barbearias` em estado visitante, Entrar e Criar conta
ficam centralizados verticalmente na área disponível do drawer mobile.
Login/cadastro, perfil público, agendamento e cliente em prévia mantêm o rodapé.
As ações desktop não mudaram de posição.

Escape, backdrop, botão de fechar, foco contido/retornado, rolagem e mudança de
rota/breakpoint foram verificados no Edge local. Resultados e comandos atuais:
[HEADERS_REVIEW.md](HEADERS_REVIEW.md). As capturas do dropdown acima são históricas.

## Ampliação de navegação do cliente — 2026-10-06

Minhas barbearias → `/cliente/barbearias` foi adicionada ao bloco principal,
entre Explorar barbearias → `/barbearias` e Meus agendamentos →
`/cliente/agendamentos`. Perfil/Ajuda e prévia do header permanecem; acesso
direto não cria sessão. A ajuda explica a criação do vínculo após primeiro
agendamento real confirmado e o filtro combinado com busca. As fixtures são
vínculos fictícios prontos, independentes do wizard, cancelamento e superadmin.
[Escopo e QA](CLIENT_BARBERSHOPS.md).
