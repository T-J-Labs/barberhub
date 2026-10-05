# Agendamento demonstrativo do cliente

Entrega local de 2026-10-05, após catálogo, perfil público e conta, conforme
[CLIENT_EXPERIENCE.md](CLIENT_EXPERIENCE.md) e o roadmap do ADR.

## Rota e contexto

A URL pública é `<subdomain>.<domínio-base>/agendar`. O rewrite resolve
`/barbearias/[subdomain]/agendar`; o caminho explícito redireciona ao
subdomínio antes do streaming, como o perfil público. Usa somente a chave pública
existente e reconhecida nas fixtures de perfil. Host não confiável, chave inválida
ou desconhecida e acesso a `/agendar` no domínio principal exibem orientação
para escolher uma barbearia. Queries `barbearia`, `returnTo` e `tenant_id` não
resolvem contexto de agendamento. `X-Forwarded-Host` não seleciona estabelecimento.

`/agendamento` e `/barbearias/[subdomain]/agendamento` são somente aliases de
compatibilidade, redirecionando com 307 para `/agendar`. Na plataforma, o alias
sem barbearia reconhecida segue para a orientação do catálogo, sem usar queries
para escolher um estabelecimento. Não há uma segunda feature de agendamento.

O ClientHeader e o rodapé preservam o contexto também na nova rota. Reutilizam
`validateAuthContext`, `clientAuthHref` e `platformReturnHref`, com retorno canônico
à **raiz do perfil**, sem ampliar a allowlist de retorno da conta. Login/cadastro
continuam na plataforma; alternar telas reemite somente os parâmetros validados.

No perfil, “Agendar horário” abre a introdução demonstrativa em `/agendar`, para
visitantes e clientes em prévia de header. A introdução oferece login/cadastro
existentes e exige a ação explícita “Experimentar demonstração” para experimentar
as etapas. Essa opção não altera o provider da
conta nem simula sessão. Recarregar reinicia as escolhas; mudar de origem continua
reiniciando a prévia de conta existente. Nenhuma autenticação real está implementada.

## Organização e dados

`frontend/src/features/booking` contém modelos de apresentação locais em `types.ts`,
fixtures em `demo-data.ts`, transições e validação em `selection.ts`, navegação em
`routing.ts` e componentes em `components`. Páginas, resolução de contexto, loading
e composição são Server Components; escolhas e wizard são interativos.

`demo-esquina` e `demo-navalha` têm exemplos próprios de três serviços, dois
profissionais, três datas fixas ilustrativas (12 a 14 de outubro de 2026) e listas
estáticas de horários. Todos os serviços permitem percorrer a jornada completa;
na Navalha, Barba na navalha apresenta somente Lucas como profissional de exemplo.
Vila, Oficina, Raízes e Bairro continuam vazias. Nenhuma barbearia recebe os dados
da outra. Nomes e valores acompanham os exemplos
do perfil público, mas as fixtures de agendamento são isoladas e não importam agenda,
serviços ou equipe administrativas. Os horários não são calculados como disponibilidade;
o dia 14 é um exemplo sem horários. As datas não acompanham o calendário real.

Tudo vive em memória React. Não há HTTP, MSW de reserva, persistência, banco,
cookies ou localStorage. `getBookingDemoData` é o ponto de substituição para dados
futuros; seus tipos não são DTOs e não devem ser promovidos a contrato de API.

## Fluxo e estados

Serviço → profissional → data → horário → revisão → resultado local.

- Trocar serviço limpa profissional, data e horário.
- Trocar profissional limpa data e horário.
- Trocar data limpa horário. Reescolher o mesmo valor e apenas voltar preservam
  as escolhas; trocar cenário reinicia tudo.
- A revisão confere a presença das escolhas e sua associação às opções locais.
  Revisão incompleta informa a primeira etapa ausente e permite completá-la.
- A ação final passa por preparação visual em memória; nenhuma requisição é enviada.
  O resultado diz: **“Esta é uma demonstração; nenhum horário foi reservado.”**
  Não existe protocolo, reserva confirmada ou sucesso fictício de API; o resultado
  não adiciona agendamentos à área global do cliente.
- “Explorar estados da demonstração” oferece carregamento, ausência de serviços,
  profissionais e horários, erro de horários, revisão incompleta, erro na conclusão
  e conflito demonstrativo (“horário ficou indisponível”).
  Todos são rotulados como exemplos locais e disponíveis também no build de demonstração.
  O erro de horários permite tentar o exemplo normal novamente. A falha final preserva
  as escolhas e informa que não houve tentativa de reserva.
- O conflito ocorre uma vez por exploração do cenário, na conclusão da revisão:
  preserva barbearia, serviço, profissional e data, limpa somente o horário, volta
  à etapa Horário e remove a opção anterior daquele exemplo. O aviso é associado
  aos radios. Outra escolha permite concluir a demonstração sem reserva. Trocar
  cenário ou reiniciar limpa a restrição local; a fixture original nunca é alterada.
  Nenhum conflito, bloqueio ou concorrência real é implementado.
- Operações visuais pendentes impedem conclusão duplicada e são descartadas quando
  o componente sai ou o cenário muda.

## Interface

Skill aplicada: `interface-design`. Pessoa: cliente no celular preparando uma visita.
Domínio: corte, barba, navalha, profissional, cadeira, ficha de atendimento e duração.
Cores do mundo visual existente: fundo preto-azulado, azul-marinho das superfícies,
azul do letreiro/ação, cinza-aço das bordas, branco dos títulos e cinza claro do corpo.
Assinatura: uma ficha de visita vinculada à barbearia acompanha as escolhas e a revisão.
Hierarquia: uma decisão principal por etapa; valor/duração apoiam o nome do serviço.
Evitar uma grade uniforme de cards, calendário artificial complexo e ação de confirmação
com aparência de reserva real. Reutilizar listas, radios nativos e “Concluir demonstração”.

Geist, paleta, bordas, ações e foco são os mesmos do catálogo/perfil/conta. Ritmo de
4px, padding de 20/32px, controles de pelo menos 44px, títulos de 24/32px e texto de
16/14px. Desktop apresenta resumo lateral; celular usa uma coluna. Radios nativos
oferecem teclado por Tab, setas e espaço. `fieldset`/`legend` e `aria-describedby`
associam opções e erros; mudanças de etapa focam o título. Progresso usa `aria-current`
e etapa textual; alertas e estados locais têm anúncio semântico. Não há novos links
de pagamentos, avaliações ou telas futuras.

Nos cards de serviço, os valores ocupam uma coluna fixa de 80px alinhada à direita.
As descrições ficam na linha abaixo, usando toda a largura do card, inclusive em
320px; isso preserva alinhamento sem comprimir o texto em uma coluna estreita.

## Integração futura

O OpenAPI continua com `paths: {}`: nenhuma operação de agendamento ou schema está
aprovado. Antes da reserva real, acordar serviços/equipe publicáveis, vínculo entre
recursos e barbearia, disponibilidade, datas/fuso, sessão Google, autorização,
titularidade, conflitos, concorrência, repetição de envio e erros de criação.
Registrar operações e schemas no OpenAPI, gerar Orval/MSW e então substituir as
fixtures. Só o backend poderá resolver contexto autorizado e confirmar uma reserva.

## Verificação

Verificações executadas e aprovadas:

- `npm run lint`: sem erros ou avisos.
- `npm run typecheck`: aprovado, inclusive após o build.
- `npm run build -- --webpack`: build de produção aprovado, com o domínio reservado
  `barberhub.test` exclusivamente para smoke via Host em localhost; sem DNS/publicação.
- `node validation/booking-state.cjs`: 39 verificações de transição, revisão, conflito,
  isolamento dos dois exemplos completos e navegação.
- `node validation/client-auth-routing.cjs`: 62 verificações existentes da conta.
- `npm run test:routing`: 3 verificações existentes de Host e links.
- `npm run test:routing:http`: 15 testes existentes em desenvolvimento na porta 3000.
- `node validation/booking-http.cjs 3000` e `3104 barberhub.test`: 22 verificações em
  desenvolvimento e 22 em produção, de navegação canônica, aliases, introdução pelo
  CTA, exemplos públicos da Navalha e contexto inválido.
- `node validation/client-auth-http.cjs 3000` e `3104 barberhub.test`: 48 verificações
  existentes em desenvolvimento e 48 em produção. Total: 259 verificações automatizadas.
- Navegador desta cópia: CTA → introdução → etapas na Esquina; conflito com horário
  removido, seleção limpa, foco no título, alerta associado aos controles e bloqueio
  de avanço sem nova escolha; recuperação escolhendo outro horário e resultado sem
  reserva. Jornada completa da Navalha com Barba na navalha → Lucas → 12/10 → 10:00
  → revisão → resultado. Cards em 320px com preços na mesma posição e descrições
  em largura total; resultado da Navalha em 320/390/768/1440px sem rolagem horizontal.
  Evidências em `validation/booking-browser-report.md` e capturas `booking-*.png`.

Autenticação, disponibilidade, confirmação, autorização e conflitos reais permanecem
pendentes dos contratos e backend. A inspeção semântica não substitui o uso real de
leitor de tela; DNS público, TLS e OAuth não foram validados pelos testes locais.

## Arquivos da entrega

- Criados na feature: `types.ts`, `demo-data.ts`, `selection.ts`, `routing.ts`,
  `components/BookingEntry.tsx`, `BookingFlow.tsx`, `ChoiceField.tsx` e `BookingState.tsx`.
- Criadas as páginas `src/app/(public)/barbearias/[subdomain]/agendar/page.tsx`,
  `loading.tsx` no mesmo diretório e `src/app/(public)/agendar/page.tsx`.
  Os caminhos antigos `/agendamento` passam a conter somente redirecionamentos.
- Alterados `src/proxy.ts`, `auth/routing.ts`,
  `auth/components/AuthScreen.tsx`, `GoogleAccess.tsx`,
  `public-barbershop/mock-data.ts`, `components/ProfileHero.tsx`, `ProfileView.tsx` e a página
  pública `src/app/(public)/barbearias/[subdomain]/page.tsx`.
- Criados `validation/booking-state.cjs`, `booking-http.cjs`, resultados e capturas.
- Atualizados ADR, README, FRONTEND_ROADMAP, CLIENT_EXPERIENCE, CLIENT_AUTH e
  PUBLIC_BARBERSHOP; criado este documento. Instruções e alterações locais preexistentes
  foram preservadas.
