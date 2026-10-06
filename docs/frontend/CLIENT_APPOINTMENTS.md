# Meus agendamentos — demonstração local

Entrega implementada em 2026-10-05 em `/cliente/agendamentos`, no domínio
principal. Acesso pelo subdomínio confiável redireciona antes do boundary de
carregamento; hosts externos não exibem a amostra. A página e seu layout são
Server Components, e a view usa estado React somente para as interações locais.
O `ClientHeader` existente é reutilizado; seu menu agora oferece o destino.
O grupo `(private)`, o domínio e o header não constituem proteção de acesso.

Arquivos criados: na rota `frontend/src/app/(private)/cliente/agendamentos`,
`page.tsx`, `layout.tsx`, `loading.tsx` e `error.tsx`; na feature
`frontend/src/features/client-appointments`, `types.ts`, `demo-data.ts`,
`presentation.ts` e os componentes `AppointmentsState.tsx`,
`AppointmentCard.tsx` e `ClientAppointmentsView.tsx`. Também foram criados
este documento, os dois scripts `validation/client-appointments-*.cjs` e as
duas evidências JPG descritas na validação.

Arquivos atualizados: `client-navigation.ts` (destino existente no menu),
`frontend/package.json` (comandos de teste), `README.md`, `CLIENT_AUTH.md`,
`CLIENT_EXPERIENCE.md` e `FRONTEND_ROADMAP.md` (estado e limites da entrega).

## Dados e apresentação

`src/features/client-appointments` contém modelos de apresentação, fixtures,
seleção/busca, estados, cartões e view. Não são DTOs do backend. A amostra
pertence a uma única identidade fictícia e contém duas próximas visitas e dois
itens históricos entre Barbearia da Esquina e Navalha & Pente. Usa referência
fixa em 5 de outubro de 2026; não promete horários futuros reais.

Próximas visitas aparecem em ordem crescente, com data/hora em destaque.
Histórico aparece em ordem decrescente em lista compacta. Cada item e seu
detalhe mostram nome, subdomínio e localização da barbearia, serviço e situação
de exemplo. Profissional, valor e duração ausentes são explicitamente indicados
como não informados. Horários de exemplo usam America/Sao_Paulo (Brasília).
Busca por barbearia, identificação, serviço ou profissional ignora acentos e
maiúsculas e possui estado sem resultados.

A orientação visual da skill `interface-design` foi aplicada à continuidade
da conta: Geist, paleta pública compartilhada pelo ClientHeader, bordas sutis,
ritmo de 4px, hierarquia de data/estabelecimento e controles de pelo menos 44px.
Não se aplicou o azul administrativo à conta. `Container`, estilos do catálogo,
`DemoDialog` em tom público e navegação existente foram reaproveitados.

## Interações e limites

- Detalhes usam diálogo HTML nativo compartilhado, com foco, Escape e rolagem.
- “Simular cancelamento” abre aviso explícito. “Aplicar à amostra” muda somente
  o status do exemplo em memória e o move ao histórico. Feedback informa que
  nenhuma reserva real foi alterada. O foco retorna à busca após a mudança.
- “Ver prévia de reagendamento” abre `/agendar` no subdomínio da mesma
  barbearia via `publicBookingHref`. O wizard começa pela introdução existente,
  sem preseleções ou parâmetros de reserva inventados. Não atualiza esta lista.
- Ações demonstrativas aparecem nos exemplos agendados; isso não define
  elegibilidade, prazo ou regras de cancelamento/reagendamento reais.
- Recarga ou “Restaurar exemplos” restaura a amostra. Sem HTTP de reservas,
  sessão, cookies fictícios, localStorage ou estado compartilhado entre domínios.
- Há boundaries reais de carregamento e erro da rota. Em desenvolvimento,
  o controle “Cenários de demonstração” permite inspecionar carregamento,
  falha e lista vazia. Não aceita cenários por query e não aparece em produção.

## Contrato e integração pendente

OpenAPI conferido nesta entrega: `paths: {}` e nenhum schema de reserva.
Nenhuma operação ou schema de consulta, detalhes, cancelamento ou reagendamento
foi utilizado. `TenantSubdomain` e `bearerAuth` existentes não aprovam essas
operações. Backend, banco e arquivos gerados não foram alterados manualmente.

Antes da integração real, acordar no OpenAPI:

- Identidade Google validada, sessão, expiração e armazenamento de credenciais.
- Consulta global limitada à identidade autenticada, detalhes e erros;
  titularidade e contexto dos recursos resolvidos no backend para cada acesso.
- Isolamento entre tenants e permissões da equipe; `client_id` ou `tenant_id`
  livremente fornecidos pela interface jamais devem autorizar acesso.
- Regras, elegibilidade, prazos e efeitos de cancelamento/reagendamento,
  disponibilidade, concorrência, fuso e envios repetidos.
- Integração do wizard com atualização da área global após resposta da API.

Depois da aprovação, gerar o cliente com Orval, usar os contratos via API REST
e validar autorização com diferentes identidades e tenants no backend. A
ausência de dados reais nesta demonstração não certifica isolamento real.

## Validação desta entrega

Comandos executados na pasta `frontend`:

```sh
npm run test:appointments
npm run test:appointments:http
npm run test:auth
npm run test:auth:http
npm run test:booking
npm run test:booking:http -- 3000
npm run test:routing
npm run test:routing:http
npm run lint
npm run typecheck
npm run build
```

`test:appointments` passou em 8 grupos: ordenação/recortes, busca, vazio,
cancelamento sem mutar fixtures, chaves desconhecidas/histórico, datas/fuso,
barbearias/opcionais e reutilização segura do link do wizard. Smoke HTTP passou
em SSR, avisos, barbearias, opcionais, query ignorada, redirecionamentos das duas
barbearias e host externo com header forwarded. Não testa autorização real.
O smoke passou também em produção local com
`npm run test:appointments:http -- 3104 barberhub.test`, incluindo ausência dos
controles de cenários em produção. O Host é simulado no teste; não valida DNS
público ou TLS.

Regressões passaram: 62 verificações de auth, 48 HTTP de auth, 39 de booking,
22 HTTP de booking, 3 testes de host e 15 HTTP de roteamento.

QA no navegador: lista e detalhes; busca sem resultados; cenários vazio,
carregamento e erro/recuperação; cancelamento, feedback, restauração e recarga;
opcionais ausentes; Enter e Escape com retorno de foco; foco na busca após
cancelamento; link para o wizard da Navalha. Conferidos mobile e desktop sem
rolagem horizontal em 320, 390, 768 e 1440px. Evidências em
`validation/client-appointments-desktop.jpg` e
`validation/client-appointments-mobile.jpg`. ESLint, TypeScript e build de
produção passaram na revisão final. A validação não cobre leitor de tela real, falha de API,
titularidade, sessão ou concorrência. Os cenários locais não forçam os boundaries
reais da rota a falhar.
