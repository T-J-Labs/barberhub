# Próximas entregas do frontend — sem depender do backend

## Integração real — planejamento registrado em 2026-10-08

As integrações futuras têm documento próprio em
[Integração frontend/backend — entregas pequenas e harness](../integration/ROADMAP.md).
Ele separa H00–H24, dependências, contratos, ambiente isolado e critérios de aceite.
Nenhuma entrega integrada foi implementada por esse registro; a próxima execução
recomendada é H00. Este documento continua sendo o histórico/estado das entregas
independentes de backend, sem reabrir telas concluídas ou declarar QA humano
concluído. Planejamento não autoriza implementação, banco ou publicação.

Plano registrado em 2026-10-05, conforme a orientação do usuário. Complementa o
[plano da experiência do cliente](CLIENT_EXPERIENCE.md) e o
[ADR](../architecture/ADR.md), sem alterar os contratos ou decisões de autorização.

## 1. Como os agentes devem usar este plano

- Este documento é planejamento, não uma autorização para implementar.
  Pedidos de análise, planejamento, listagem ou documentação não autorizam
  alterações na aplicação. Implementar apenas quando o usuário solicitar.
- Antes de uma implementação, conferir o código, o OpenAPI e o estado atual
  das entregas. O diagnóstico abaixo é uma referência datada, não uma garantia
  de que o projeto não evoluiu.
- Quando o usuário pedir a próxima entrega deste plano, conferir seu estado na
  seção 10. A revisão dos headers e o agendamento histórico já estão implementados;
  a próxima prioridade é consolidação de QA. Não repetir entregas nem executar
  o restante do roadmap automaticamente.
- Manter entregas pequenas e separadas. A seção 10 registra uma revisão dirigida
  dos headers, não uma reformulação livre da aplicação. Não mudar o domínio do
  admin nem alterar backend/banco sem uma solicitação específica.
- Respeitar o ADR e o contrato OpenAPI. Dúvidas que mudem regras de negócio,
  autenticação ou escopo devem ser esclarecidas antes de implementar.
- Ao concluir uma entrega, atualizar seu estado e registrar somente verificações
  realmente executadas. Não apresentar uma simulação como funcionalidade integrada.

## 2. Estado atual — atualizado em 2026-10-07

Ajuste solicitado em 2026-10-08: header institucional restaurado ao padrão
compartilhado anterior ao redesign, sem nova entrega funcional.
[Escopo e verificações](HEADERS_REVIEW.md#restauração-do-header-institucional--2026-10-08).

Landing atualizada mediante solicitação específica: preço aprovado de
**R$ 40/mês por barbearia**, um único plano, com perfil público, serviços,
equipe, funcionamento, agenda e agendamentos previstos para o MVP.
Menu **Preço** → `/#preco`; **Experimentar configuração** →
`/onboarding/barbearia`, demonstração sem contratação, conta, estabelecimento,
acesso ou publicação. Contratação e Planos/assinaturas do superadmin continuam
indisponíveis. Wireframes mobile/desktop e drawer atualizados antes do código.
[Arquivos, verificações locais executadas e limites](../design/README.md#preço-aprovado--2026-10-07).
Esta entrega não autoriza pagamentos, checkout ou novas funcionalidades.
Pendências técnicas reclassificadas na seção 13 a partir das evidências brutas:
ambiente pessoal atualizado, CI da revisão final aprovado, botões corrigidos,
testes locais Chromium/Firefox/WebKit e Edge standalone automatizado comprovados.
Publicação/QA público foram adiados para a etapa final, após as integrações com
o backend estarem funcionando e validadas localmente; QA humano continua separado.

**As seis entregas da sequência inicial estão implementadas no escopo sem
backend.** As cinco primeiras são demonstrações locais; a PWA foi implementada
e validada em produção local, com pendências de ambiente e acessibilidade
registradas na seção 9. O cadastro manual demonstrativo do superadmin também
está implementado. Isso não significa conclusão do MVP integrado.

Estado observado na revisão estrutural e documental:

- Landing, catálogo, perfil público, páginas administrativas e navegação possuem
  interfaces. Isso não certifica autenticação, persistência ou autorização real.
- Login/cadastro possuem apresentação pronta; Google permanece indisponível.
  A prévia do header de cliente não cria sessão. Consulte
  [CLIENT_AUTH.md](CLIENT_AUTH.md).
- Cliente tem “Meus agendamentos” demonstrativos em `/cliente/agendamentos`;
  barbeiro tem início, agenda e histórico demonstrativos. Ambos têm perfil e
  ajuda, conforme a seção 7 e [PROFILE_HELP.md](PROFILE_HELP.md).
- Cliente também tem “Minhas barbearias” em `/cliente/barbearias`, vínculos
  fictícios de Esquina/Navalha e filtro combinado de agendamentos. Regra aprovada
  e limites em [CLIENT_BARBERSHOPS.md](CLIENT_BARBERSHOPS.md).
- Superadmin tem visão geral, lista, detalhes, ajuda, suspensão/reativação em memória
  e cadastro manual de rascunhos, conforme a seção 8 e
  [SUPERADMIN_DEMO.md](SUPERADMIN_DEMO.md).
- PWA tem manifesto, ícones, instalação na plataforma e fallback offline,
  sem cache de dados privados ou reservas offline. Consulte [PWA.md](PWA.md).
- O CTA “Agendar horário” abre a introdução de `/agendar` no subdomínio.
  A feature `booking` oferece serviço, profissional, data, horário, revisão,
  resultado e conflito com recuperação. Esquina e Navalha têm exemplos completos.
  Implementação e verificações: [CLIENT_BOOKING.md](CLIENT_BOOKING.md).
- O OpenAPI mantém `paths: {}`. Não há operações aprovadas para integrar essas
  novas interfaces.

O levantamento inicial consolidou resultados já documentados, sem nova execução
de QA. As revisões independentes posteriores estão identificadas na seção 11;
não equivalem a certificação do MVP integrado. Não há outra entrega automaticamente autorizada
na sequência inicial. A revisão dos headers foi implementada posteriormente,
com a landing como referência e QA local registrado na seção 10 e em
[HEADERS_REVIEW.md](HEADERS_REVIEW.md). A próxima prioridade é consolidar QA.
“Minhas barbearias” foi solicitada e implementada como demonstração local em
2026-10-06; regra e limites em [CLIENT_BARBERSHOPS.md](CLIENT_BARBERSHOPS.md).
Onboarding demonstrativo do proprietário foi solicitado e implementado com as
regras do plano aprovado em 2026-10-06. [Escopo e QA](OWNER_ONBOARDING.md).

## 3. Sequência inicial — entregas implementadas

As cinco primeiras entregas estão **implementadas como demonstração local**.
A sexta foi implementada e validada em produção local, com as limitações de
ambiente descritas em [PWA.md](PWA.md). Integração real continua dependente de contratos.

| Ordem | Entrega | Escopo sem backend |
| --- | --- | --- |
| 1 | Agendamento demonstrativo — implementado | Serviço, profissional, data, horário, revisão, conflito e resultado demonstrativo no subdomínio da barbearia. |
| 2 | Meus agendamentos — implementado | Área global demonstrativa com próximas reservas, histórico, detalhes, cancelamento da amostra em memória e acesso ao wizard existente. Exemplos de duas barbearias para uma identidade fictícia, independentes do wizard. Consulte [CLIENT_APPOINTMENTS.md](CLIENT_APPOINTMENTS.md). |
| 3 | Área do barbeiro — implementada | Início com próximo atendimento e agenda própria demonstrativa; detalhes, conclusão, falta, bloqueio e desbloqueio de horários em memória. |
| 4 | Perfil e ajuda — implementados para ambos os papéis | Quatro telas: perfil e ajuda do cliente, perfil e ajuda do barbeiro. Prévia de edição do nome de exibição e orientação contextual, reutilizando `SettingsShell`, `HelpShell` e padrões existentes. Não alterar a conta Google. Escopo e testes na seção 7 e [PROFILE_HELP.md](PROFILE_HELP.md). |
| 5 | Superadmin básico — implementado | Visão geral calculada, lista, busca por nome/cidade/bairro e detalhes das seis fixtures públicas; suspensão/reativação somente em memória. Busca preservada no retorno à lista. Sem cobrança, publicação ou autorização real. Consulte [SUPERADMIN_DEMO.md](SUPERADMIN_DEMO.md). |
| 6 | PWA e acabamento transversal — implementada em produção local | Manifesto, ícones, instalação na plataforma, fallback offline e auditoria dirigida de acessibilidade, desempenho e navegação. Cache somente de HTML offline e favicon; sem reservas offline, dados privados, filas ou replay. Ambientes e pendências na seção 9 e em [PWA.md](PWA.md). |

Habilitar links de navegação e ajuda conforme seus destinos existirem, evitando
controles que levem a páginas ausentes. Grupos de rotas e headers não são
mecanismos de autorização.

“Minhas barbearias” foi implementada após solicitação específica em 2026-10-06.
A regra aprovada é vínculo após o primeiro agendamento real confirmado na
barbearia; a tela usa vínculos fictícios prontos, sem criação por simulação.

## 4. Primeira entrega: agendamento demonstrativo

Entrega implementada. Os itens abaixo preservam o escopo e as regras do plano
original, não uma lista de funcionalidades ainda por desenvolver. O comportamento
atual, os arquivos e as verificações estão em [CLIENT_BOOKING.md](CLIENT_BOOKING.md).

### 4.1. Entrada, domínio e contexto

- Criar a feature `booking` em `frontend/src/features`, com página Server
  Component e wizard interativo em Client Component.
- Usar a URL pública `<subdomínio>.<domínio-base>/agendar`, por exemplo
  `http://demo-esquina.localhost:3000/agendar` em desenvolvimento.
- Resolver a barbearia pelo Host validado, reutilizando a infraestrutura existente.
  Parâmetros de URL e cabeçalhos encaminhados não podem selecionar outra barbearia.
- O domínio principal não será uma alternativa pública desse fluxo. Não criar
  uma opção de agendamento em `/barbearias/[subdomain]/agendar`.
- Tratar hosts desconhecidos, externos ou sem barbearia reconhecida como endereço
  indisponível, sem mostrar dados de outro estabelecimento.
- Manter a barbearia identificada durante todas as etapas, com retorno ao perfil
  na raiz do próprio subdomínio e ao catálogo no domínio principal.
- Preservar o contexto nos links de login/cadastro no domínio principal. A regra
  atual de retorno continua sendo a raiz canônica do subdomínio da barbearia,
  conforme `CLIENT_AUTH.md`; não aceitar `returnTo` arbitrário ou mudar essa
  política implicitamente para retornar ao wizard.
- Preservar o comportamento das páginas admin. Não mudar o domínio de `/admin`
  ou sua navegação nesta entrega.

### 4.2. Introdução e jornada

O CTA “Agendar horário” deve abrir uma introdução com aviso de que reservas reais
não estão disponíveis. Uma ação separada, **“Experimentar demonstração”**, inicia
o wizard. O botão Google permanece indisponível; a demonstração não simula login.

Etapas propostas:

1. Serviço: nome, descrição, preço e duração de exemplo.
2. Profissional: equipe demonstrativa do estabelecimento.
3. Data: opções fictícias identificadas como exemplos.
4. Horário: opções fictícias, com indicação clara do fuso.
5. Revisão: resumo das escolhas e possibilidade de voltar para alterá-las.
6. Resultado: **“Simulação concluída — nenhum horário foi reservado”**.

Nunca exibir confirmação real, comprovante de reserva ou promessa de disponibilidade.
Essa entrada demonstrativa não substitui o fluxo integrado do ADR, que exigirá
autenticação quando necessária antes de uma reserva real.

### 4.3. Dados e organização

- Usar fixtures públicas e modelos de apresentação explicitamente locais,
  com identificadores estáveis. Não criar DTOs ou endpoints.
- Preparar exemplos completos para `demo-esquina` e `demo-navalha`.
- Preservar exemplos sem serviços e representar também ausência de equipe.
  Uma barbearia sem dados suficientes não pode iniciar uma simulação completa.
- Não importar dados administrativos/privados para a apresentação pública.
- Separar regras de seleção e transição de estado da renderização para facilitar
  testes de comportamento.
- Reutilizar identidade pública, componentes acessíveis e estilos existentes.
  Manter os botões primários aprovados: `bg-sky-500`, texto `#07111C` e hover sem
  mudar o tom de azul, respeitando movimento reduzido. O usuário aprovou a
  troca do texto branco em 2026-10-07; ver [acompanhamento](VALIDATION_HISTORY.md#acompanhamento).
- Manter estado somente em memória, sem tokens, cookies de sessão fictícios
  ou persistência em `localStorage`.

### 4.4. Regras de seleção e estados

- Ao trocar serviço, limpar profissional, data e horário.
- Ao trocar profissional, limpar data e horário.
- Ao trocar data, limpar horário.
- Voltar sem alterar uma escolha deve preservar seleções ainda válidas.
- Impedir avanço com seleção incompleta e conclusão fora da revisão.
- Representar carregamento, ausência de horários, falha ao carregar, falha de
  envio e conflito na conclusão por cenários locais controlados.
- Cenários de QA não devem ativar falhas de teste em produção por parâmetros
  arbitrários. Documentar como reproduzi-los no ambiente demonstrativo.
- Bloquear confirmação repetida enquanto estiver processando.
- Na falha de envio, preservar escolhas e permitir nova tentativa.
- No conflito demonstrativo, invalidar o horário escolhido e permitir outro,
  mantendo serviço, profissional e data quando ainda válidos.
- Limpar operações temporizadas ao sair ou reiniciar para evitar resultados
  antigos sobre escolhas novas.

### 4.5. Limitação entre subdomínio e área global

A reserva demonstrativa e a lista global do cliente possuem **dados
independentes**. A conclusão no subdomínio não deve adicionar automaticamente
uma reserva a “Meus agendamentos”. A limitação precisa estar visível.

O reagendamento demonstrativo abre o wizard no estabelecimento,
mas não atualiza automaticamente a lista global. Não criar armazenamento
compartilhado entre domínios para contornar a ausência de integração.

### 4.6. Documentação da entrega implementada

- `PUBLIC_BARBERSHOP.md` descreve o CTA para a introdução de `/agendar` no
  subdomínio; `#agendamento` não é mais seu destino.
- `CLIENT_EXPERIENCE.md` e este roadmap distinguem a interface demonstrativa
  implementada das funcionalidades aguardando integração.
- `CLIENT_BOOKING.md` documenta o wizard, cenários locais, testes e limitações,
  com referência no README. Não apresentar URLs ou comandos ainda inexistentes
  como disponíveis.
- Manter referências de autenticação e navegação coerentes com `CLIENT_AUTH.md`.
- Preservar registros históricos de validação e acrescentar os novos resultados
  efetivamente obtidos, sem tratar testes antigos como validação da nova feature.

## 5. Critérios de conclusão e testes

Cada futura entrega exige testes de comportamento e QA no navegador, além de
ESLint, TypeScript e build. Os resultados efetivamente executados para o wizard
estão em [CLIENT_BOOKING.md](CLIENT_BOOKING.md). Os critérios abaixo preservam
o plano; verificações manuais não realizadas devem permanecer pendentes.

### Primeira entrega

Checklist da revisão original do agendamento: itens não marcados não devem ser
convertidos em testes aprovados por esta atualização documental. Consulte o
registro detalhado em `CLIENT_BOOKING.md` e as regressões posteriores em `PWA.md`;
uso real de leitor de tela e validação de DNS/TLS/OAuth continuam pendentes.

- [x] Percorrer introdução, todas as etapas, revisão e resultado demonstrativo.
- [ ] Voltar e editar serviço, profissional e data, verificando invalidação das
  escolhas dependentes e bloqueio de avanço incompleto.
- [ ] Testar ausência de serviços/equipe, carregamento, ausência de horários,
  falha ao carregar, falha de envio, conflito e recuperação.
- [ ] Testar clique repetido, reinício da demonstração e saída durante processamento.
- [x] Abrir diretamente os dois subdomínios e conferir a identidade correta.
- [x] Testar domínio principal, hosts desconhecidos/externos, parâmetros de tenant
  e cabeçalhos encaminhados sem seleção indevida de barbearia.
- [x] Verificar normalização do Host, portas locais, retorno ao perfil/catálogo e
  contexto dos links de login/cadastro, preservando as regras atuais de retorno.
- [x] Verificar que o Google continua indisponível e que a conclusão não autentica,
  não persiste, não cobra nem cria uma reserva real.
- [ ] Testar teclado, foco, avisos com leitor de tela e larguras de 320, 390, 768
  e 1440px, sem rolagem horizontal ou controles cortados.
- [x] Executar regressão de autenticação e roteamento existentes, conferir catálogo
  e navegação admin, validar ESLint, TypeScript e build.
- [x] Registrar comandos, ambientes, resultados e limitações realmente observados.

### Entregas posteriores

- Cliente: reservas de duas barbearias para uma identidade fictícia; cancelamento
  somente em memória, próximos agendamentos, histórico, detalhes e estados vazios.
- Barbeiro: apenas agenda do profissional demonstrativo; feedback de conclusão,
  falta e bloqueios. Não apresentar essa restrição visual como autorização real.
- Perfil/ajuda e superadmin: ações locais, estados vazios/erro, destinos existentes
  e avisos de demonstração; sem alteração da identidade Google ou cobrança.
- PWA: instalação e indisponibilidade offline sem reserva offline ou cache privado.

Documentar separadamente testes automatizados, verificação visual/DOM e uso real
de leitor de tela. Se alguma verificação não for realizada, informar a limitação.
Testes HTTP locais com Host simulado não validam DNS público, TLS ou OAuth.

## 6. Fora do escopo e integração futura

- Não alterar backend, banco, migrações ou sua configuração nestas entregas.
- Enquanto `paths: {}` permanecer no OpenAPI, não inventar requisições, schemas,
  SDKs de autenticação ou mocks HTTP de operações inexistentes. Fixtures locais
  não são contratos da API; Orval/MSW serão utilizados após aprovação de operações.
- OAuth, sessão compartilhada, vínculos profissionais, disponibilidade real,
  concorrência, titularidade e persistência aguardam contratos e integração.
- Onboarding demonstrativo do proprietário foi implementado conforme plano
  aprovado; regras e efeitos fictícios em [OWNER_ONBOARDING.md](OWNER_ONBOARDING.md).
  Onboarding real de equipe/identidade continua dependente de contratos e regras.
- Geolocalização, avaliações, rankings, favoritos, pagamentos e fidelidade não
  fazem parte desta sequência inicial.
- Não introduzir preços de planos, condições comerciais, contatos ou avaliações
  reais inventados.

**Área do barbeiro implementada como demonstração local.** Consulte [BARBER_DEMO.md](BARBER_DEMO.md).

**Perfil e ajuda demonstrativos implementados para ambos os papéis.**
Superadmin, cadastro manual e PWA também estão implementados, conforme as seções
8 e 9. Novas entregas exigem solicitação própria, sem reservas ou autorização reais.

## 7. Perfil e ajuda de cliente e barbeiro — implementados

Planejamento e implementação registrados em 2026-10-05, após solicitação explícita.
A entrega contempla os dois papéis e está pronta como demonstração local.
Não há integração real. [Arquivos, testes e limitações](PROFILE_HELP.md).

### 7.1. Telas e sequência

Rotas disponíveis na demonstração:

| Papel | Perfil | Ajuda | Contexto |
| --- | --- | --- | --- |
| Cliente | `/cliente/perfil` | `/cliente/ajuda` | Conta global, com `ClientHeader` e identidade visual da área do cliente. |
| Barbeiro | `/barbeiro/perfil` | `/barbeiro/ajuda` | Profissional fictício da demonstração, com `BarberHeader` e identidade visual privada existente. |

As quatro telas compõem a etapa 4 concluída. O escopo aprovado não inclui
perfil/ajuda de admin ou superadmin, nem alterações em suas páginas ou domínios.
Preservar as convenções de
domínio e retorno já existentes; esta entrega não resolve sessão entre domínios
nem muda o domínio operacional do barbeiro.

### 7.2. Perfil: somente nome de exibição demonstrativo

- Apresentar uma identidade fictícia, com aviso de demonstração e campo rotulado
  como nome de exibição. Não utilizar dados pessoais reais da conta Google.
- Manter rascunho separado do valor aplicado. Aceitar nomes com acentos e espaços;
  remover espaços nas extremidades e rejeitar conteúdo vazio ou só espaços.
  Mostrar erro junto ao campo, sem apagar o rascunho ou o último valor aplicado.
- “Aplicar à demonstração” atualiza somente a apresentação local do próprio
  papel. Exibir feedback acessível de que nada foi salvo em uma conta real.
- “Cancelar edição” descarta o rascunho e repõe o último valor aplicado.
  “Restaurar exemplo” repõe o nome fictício inicial e informa o resultado.
- Conservar o valor aplicado durante navegação interna da mesma área usando
  estado React no escopo adequado. Recarregar ou sair da área restaura o exemplo.
  Cliente e barbeiro devem ter estados independentes, sem armazenamento persistente.
- A edição não inicia prévia de autenticação, não promove visitante a cliente
  e não concede um papel. Quando houver apresentação demonstrativa ativa do nome
  na mesma área, mantê-la coerente com o valor aplicado, sem simular sessão real.
- Não alterar nome/e-mail/avatar do Google, credenciais, vínculo com barbearia,
  permissões ou identidade/titularidade das fixtures de agenda e agendamentos.
  Não incluir senha, upload de foto, exclusão de conta ou desvinculação de equipe.

### 7.3. Ajuda contextual por papel

Compartilhar a estrutura de ajuda, não um texto genérico idêntico para ambos.
Explicar somente ações existentes e seus limites, com atalhos válidos:

- **Cliente:** explorar barbearias em `/barbearias`; entrar no perfil público e
  no wizard pelo subdomínio validado; consultar próximos agendamentos, detalhes
  e histórico em `/cliente/agendamentos`; simular cancelamento; abrir a prévia
  de reagendamento. Explicar que wizard e lista global têm dados independentes.
- **Barbeiro:** consultar início em `/barbeiro`, agenda em `/barbeiro/agenda`
  e histórico em `/barbeiro/historico`; abrir detalhes, simular conclusão/falta,
  bloquear/desbloquear intervalos e restaurar exemplos. Explicar que o recorte
  de um profissional fictício não representa autorização real.
- **Ambos:** explicar como editar/restaurar o nome demonstrativo, a perda das
  alterações ao recarregar e a indisponibilidade atual do acesso Google.
  Recuperação de acesso é responsabilidade do Google; não oferecer senha local.
- Usar perguntas frequentes e orientação por tarefa. Não inventar contatos,
  canais de suporte, prazos de atendimento, regras de cancelamento, reputação,
  cobrança ou promessas de funcionalidades ainda não integradas.
- Gerar links de barbearia com os helpers existentes e contexto validado,
  nunca com tenant livre ou URLs arbitrárias. Sem contexto válido, orientar
  pelo catálogo em vez de criar um destino de estabelecimento inválido.

### 7.4. Reutilização, navegação e limites técnicos

- Reutilizar `SettingsShell`, `SettingsSection`, `SettingsField`, `HelpShell`
  e `HelpDestination`; organizar o conteúdo de cada papel em `src/features`.
  Páginas e conteúdo estático devem ser Server Components; formulários e estado
  local usam Client Components apenas onde necessário.
- Preservar a identidade de cada área: a conta do cliente não deve herdar
  automaticamente o azul administrativo dos shells. Se necessário, permitir
  composição/variante nos componentes compartilhados, preservando os defaults
  usados pelo admin e seus estilos aprovados.
- Habilitar Perfil e Ajuda no menu de cada papel somente quando suas rotas
  existirem. Na área do barbeiro, o controle Perfil deve dar acesso à nova tela;
  preservar os demais controles e o funcionamento da navegação atual. Não fazer
  outra reformulação estrutural do Header.
- Usar apenas modelos de apresentação e estado em memória. Não criar endpoints,
  DTOs, OAuth, sessão fictícia, tokens, cookies ou persistência em localStorage.
  Backend, banco, contratos e arquivos gerados ficam fora desta entrega.
- Antes de integração real, acordar no OpenAPI consulta/edição de perfil,
  identidade autenticada, vínculos, permissões, validação e erros. Nenhuma
  demonstração deve ser apresentada como autenticação ou autorização.

### 7.5. Critérios de conclusão e validação

Resultados da implementação em [PROFILE_HELP.md](PROFILE_HELP.md).
A verificação acessível usa DOM, foco e teclado; não foi usado leitor de tela.

- [x] As quatro telas existem, têm conteúdo específico do papel e são acessíveis
  pelos menus correspondentes, sem links quebrados ou acesso cruzado entre áreas.
- [x] Nos dois perfis, testar aplicar nome, cancelar rascunho, restaurar exemplo,
  espaços nas extremidades, vazio/só espaços, acentos e nomes longos sem cortes.
- [x] Conferir estado durante navegação interna, reinício após recarga/saída,
  independência entre papéis e ausência de alteração da conta Google, das
  fixtures de agendamentos ou de permissões. Testar acesso direto como visitante
  sem criação implícita de sessão ou ativação da prévia de cliente.
- [x] Na ajuda, percorrer todos os atalhos e perguntas com mouse e teclado;
  conferir o contexto dos links entre catálogo, subdomínio e login/cadastro,
  inclusive ausência de contexto e Host inválido.
- [x] Conferir rótulos, erros associados ao campo, foco e avisos acessíveis;
  testar 320, 390, 768 e 1440px. Registrar separadamente inspeção DOM/visual
  e eventual uso real de leitor de tela.
- [x] Executar testes de comportamento da nova entrega, regressões existentes
  de autenticação, roteamento, booking, cliente e barbeiro, ESLint, TypeScript
  e build; conferir navegação e shells administrativos para evitar regressão.
- [x] Atualizar README, este roadmap, CLIENT_EXPERIENCE.md e CLIENT_AUTH.md
  para distinguir telas demonstrativas prontas da integração pendente;
  documentar comandos, resultados efetivamente obtidos e limitações da entrega.

### 7.6. Resultado da entrega em 2026-10-05

As quatro telas, formulários em memória e ajudas contextuais estão implementados.
Passaram 7 grupos de regras e 38 grupos de navegador em Edge headless, além das
regressões de auth, roteamento, booking, agendamentos e barbeiro. Lint, TypeScript
e build passaram. QA em 320/390/768/1440px; inspeção visual e de DOM, sem leitor de
tela real. Comandos, arquivos e limitações em [PROFILE_HELP.md](PROFILE_HELP.md).
Google, identidade autenticada, vínculos, autorização e edição persistida
continuam pendentes de contratos no OpenAPI. A implementação não autoriza
executar as próximas etapas do roadmap.

## 8. Superadmin básico — implementado

Entrega demonstrativa concluída em 2026-10-06, após solicitação explícita.
Rotas: `/super-admin`, `/super-admin/barbearias` e
`/super-admin/barbearias/[id]`. Visão geral calculada, seis fixtures públicas,
busca por nome/cidade/bairro, detalhes e retorno preservando a busca.
Suspensão/reativação altera somente o estado React da amostra, com confirmação
acessível e feedback de que nada foi salvo ou aplicado a uma barbearia real.
Catálogo, publicação, autorização e acesso não são alterados.

Validação executada: ESLint, TypeScript, build, 7 grupos de estado, 3 testes de
host e QA Edge/Playwright com 27 verificações em desenvolvimento e 25 em produção
local. Visão geral, lista, detalhes e diálogo conferidos em 320, 390, 768 e
1440px. Teclado, foco e mensagens foram verificados por DOM; leitor de tela real
não foi usado. Erro, carregamento e vazio reproduzidos por cenários locais em
desenvolvimento; o boundary de erro real não foi forçado.

Diagnóstico, arquivos, fixtures, comandos, evidências e pendências:
[SUPERADMIN_DEMO.md](SUPERADMIN_DEMO.md). O OpenAPI mantém `paths: {}`;
a integração real ainda exige autorização global, projeção permitida e regras
de suspensão/publicação aprovadas. A entrega posterior de PWA foi solicitada e
implementada conforme a seção 9.

### 8.1. Cadastro manual demonstrativo — ampliação solicitada

Implementado em 2026-10-06, por solicitação específica, na mesma feature
`superadmin-demo`. `/super-admin/barbearias` oferece formulário embutido com
nome, cidade, bairro, subdomínio pretendido e motivo obrigatório. Validação
separada da interface, duplicidade contra fixtures e rascunhos em memória,
erros associados e foco no primeiro inválido. Cancelar não adiciona item.

Criar na demonstração adiciona **Rascunho na amostra** ao provider do layout e
abre `/super-admin/barbearias/[id]` preservando a busca. Detalhes resolvem também
IDs locais no componente cliente, sem alterar a página Server Component.
Resumo mostra Total/Rascunhos/Ativas/Suspensas calculados da mesma coleção.
Rascunho não aceita suspensão/reativação. Recarga ou saída o remove; ID ausente
mostra “Exemplo indisponível” e retorno à lista. Nenhum estabelecimento real,
compra, acesso, publicação ou subdomínio é criado. Catálogo e hosts não mudam.

Não havia política de nomes reservados no roteamento: a proteção local usa nomes
das rotas existentes, com pendência explícita da política oficial e de unicidade
real. OpenAPI continua com `paths: {}`. Backend, banco e contratos não foram
alterados. Responsável/Google, auditoria, provisionamento, publicação e cobrança
continuam separados e dependentes de contratos reais. A regra de liberação
explícita sem compra foi aprovada pelo plano de onboarding; a demonstração apenas
apresenta cenários, sem executar efeitos. Consulte [OWNER_ONBOARDING.md](OWNER_ONBOARDING.md).

Verificações desta ampliação: lint, TypeScript, build, 12 grupos de regras,
20 grupos de cadastro no navegador por ambiente (desenvolvimento/produção),
regressão do superadmin com 27/25 verificações e roteamento com 3 testes de host
e 15 HTTP em desenvolvimento. QA DOM/teclado e visual em 320/390/768/1440px,
sem leitor de tela real. Comandos, arquivos e limitações em
[SUPERADMIN_DEMO.md](SUPERADMIN_DEMO.md#cadastro-manual-demonstrativo--implementado-em-2026-10-06).

### 8.2. Ajuda do superadmin — ampliação solicitada

Implementada em `/super-admin/ajuda` em 2026-10-06. Página e conteúdo são Server
Components com metadados próprios `noindex, nofollow`, reutilizando o `main` do
layout e `HelpShell`/`HelpDestination` administrativos. Menu Ajuda habilitado;
Planos e assinaturas continuam indisponíveis. Cinco atalhos orientam visão geral,
busca/detalhes, cadastro manual, suspensão/reativação e onboarding independente.
Treze perguntas usam `details` nativo e distinguem comportamento em memória,
regra aprovada de publicação futura e integração ausente.

O mesmo `SuperadminProvider` permanece montado: lista → Ajuda → lista preserva
rascunhos e suspensões locais. Recarga ou saída descarta a amostra alterada. O
atalho do onboarding avisa o descarte e a ausência de transferência de dados ao
proprietário. Ajuda independe de dados e dos cenários de vazio/erro local.
Sem novo provider, efeitos, API, persistência ou alterações de outros papéis.
Validação local aprovada: lint, TypeScript, build, roteamento, regras/HTTP,
regressões de superadmin/cadastro e jornada da ajuda em desenvolvimento/produção.
Teclado, quatro larguras, zoom nativo 200% e oito auditorias axe sem violações
detectadas. Leitor de tela, dispositivos reais e contraste manual integral
permanecem pendentes; os cenários de erro são demonstrativos, não falhas de API.
QA e limitações da entrega: [SUPERADMIN_DEMO.md](SUPERADMIN_DEMO.md#ajuda-do-superadmin--2026-10-06).

## 9. PWA e acabamento transversal — registro histórico de 2026-10-06

Implementada por solicitação explícita. Manifesto App Router com início em
`/barbearias`, identidade derivada da marca, ícones 192/512/maskable/Apple 180,
instalação após ação da pessoa e instruções quando o prompt não está disponível.
Sem instalação por tenant, papel, sessão ou autenticação nova.

Worker próprio de produção somente no domínio principal validado, separado do
MSW. Cache `barberhub-pwa-v1` com `/pwa/offline.html` e `/pwa/icon-192.png`.
Fallback de navegação completa em falha de rede; API, autenticação, POST,
RSC/prefetch e externos não recebem cache nem HTML substituto. Sem fila, replay,
sync ou reservas offline. Versões novas aguardam fechamento das páginas;
nenhuma edição sofre recarga forçada. Limpa apenas caches do próprio prefixo.

Auditoria corrigiu nomes acessíveis do catálogo, semântica modal do drawer da
conta e foco global; removeu a fonte Mono sem uso e aplicou a Geist prevista no
design. Sem reformulação do Header, mudança de domínio ou alteração de backend.

Validação: lint, TypeScript, build, 12 grupos de política, 15 de navegador PWA,
4 de ciclo de vida, regressões existentes de estado/HTTP, 38 de perfil/ajuda
em desenvolvimento, 25 de superadmin e 20 de cadastro em produção. Edge 154 no
Windows, produção local em localhost:3110; instalação nativa em perfil de QA,
janela standalone após ajuste da preferência do navegador, catálogo sem sessão.
Offline preparado e primeiro acesso sem preparação reproduzidos separadamente.
UI e 20 rotas em 320/390/768/1440px; teclado, foco e zoom desktop 200%.

Lighthouse antes/depois: performance 96/92 e acessibilidade 96/96, com contraste
insuficiente mantido no padrão azul/branco exigido. Transferência mediana
227.145/213.061 bytes; JS aumentou 3.223 bytes. Sem certificação WCAG ou SLO;
leitor de tela, dispositivos móveis reais, instalação manual e HTTPS publicado
permanecem pendentes. Resultados, arquivos, comandos e limitações:
[PWA.md](PWA.md). As demonstrações não se tornaram operações integradas.

## 10. Próximos passos sem backend — sequência vigente em 2026-10-06

Esta seção substitui a prioridade histórica de agendamento; as seções 3 a 9
preservam as entregas já implementadas e seus registros. Planejamento não autoriza
implementar: cada entrega exige solicitação própria. A revisão de headers foi
solicitada e implementada em 2026-10-06. A **landing institucional é a referência
principal de aparência e menu mobile**, substituindo expressamente a orientação
anterior que usava o header do barbeiro. QA local no navegador foi executado;
aparelhos reais e leitor de tela continuam pendentes. [Registro](HEADERS_REVIEW.md).

### 10.1. Ordem recomendada e dependências

| Ordem | Entrega | Estado e condição | Resultado esperado sem backend |
| --- | --- | --- | --- |
| 1 | Consistência e responsividade dos headers | Implementada e validada localmente em 2026-10-06. | Landing preservada; padrão de drawer compartilhado por cliente e barbeiro; acesso mobile no rodapé; sidebar admin preservada. |
| 2 | Consolidação de QA e acessibilidade | Infraestrutura e regressão local implementadas; validação manual/externa parcial. Não reimplementar a PWA. | Complementar verificações de dispositivos, navegadores, leitor de tela e ambiente publicado, preservando os agregadores existentes. |
| 3 | Minhas barbearias | Implementada como demonstração local em 2026-10-06; criação real aprovada após primeiro agendamento real confirmado. | Lista demonstrativa de vínculos fictícios, perfil público, agendamento e acesso aos próprios agendamentos por estabelecimento. |
| 4 | Onboarding demonstrativo do proprietário | Implementado em 2026-10-06 conforme plano específico aprovado. | Dois exemplos independentes, seis etapas, checklist calculado, cenários fictícios de liberação e atalhos administrativos com aviso; sem conta, tenant ou publicação reais. |
| 5 | Ajuda do superadmin | Implementada e aprovada na revisão independente local de 2026-10-06. | Cinco caminhos por tarefa e 13 FAQs em `/super-admin/ajuda`, sob o mesmo provider; cadastro manual, onboarding independente e limites da memória, sem planos, cobrança ou suporte inventado. |

As entregas 3, 4 e 5 foram solicitadas e implementadas no escopo demonstrativo.
É possível avançar em QA sem implementar integração real. Esta lista
não exige criar novas telas para preencher cada opção desabilitada da navegação.

### 10.2. Revisão dirigida dos headers — implementada

**Objetivo:** permitir que visitante, cliente e profissional reconheçam a
navegação e acessem seus destinos no celular, preservando contexto e diferenças
entre papéis. Não redesenhar o conteúdo das páginas nem criar funcionalidades.

Pontos de partida existentes em `frontend/src/features/navigation`:

- `components/public/PublicHeader.tsx` e `PublicMobileMenu.tsx`: navegação
  institucional, incluindo âncoras e ações de acesso.
- `components/authenticated/ClientHeader.tsx`: apresentação de visitante,
  prévia de cliente, acesso e menu de conta em drawer modal (substitui `details`).
- `components/authenticated/BarberHeader.tsx`, `AuthenticatedHeader.tsx` e
  `AuthenticatedMobileMenu.tsx`: composição do barbeiro e drawer compartilhado.
- `HeaderBrand.tsx`, configurações por papel e `AdminSidebar.tsx`: marca,
  destinos existentes e navegação administrativa a preservar.

Escopo implementado, preservando as composições existentes:

1. Reproduzir e registrar as diferenças e os problemas relatados em `/`, catálogo,
   perfil público, agendamento, login/cadastro e áreas de cliente e barbeiro.
   Distinguir diferenças intencionais de inconsistência ou quebra de layout.
2. Alinhar marca, tipografia, espaçamento, dimensões de controles, superfícies,
   bordas e foco aos padrões existentes. Reutilizar componentes e estilos;
   compartilhar estrutura quando houver uso real, sem um componente monolítico
   com regras de todos os papéis. Consultar `docs/design/README.md` e
   `.interface-design/system.md`, preservando a identidade pública e privada.
3. Usar a landing institucional como referência principal de aparência e menu
   mobile: marca tipográfica, fundo/borda, controles de 44px, drawer esquerdo
   com 85% e `max-w-sm`, backdrop, conteúdo rolável e ações no rodapé.
   Essa decisão substitui a referência anterior ao header do barbeiro.
   Cliente e barbeiro usam `MobileDrawer`, mantendo destinos, nomes e estados
   próprios. Não copiar contexto de tenant ou notificações para o cliente.
4. Corrigir ações de acesso em telas pequenas: Entrar e Criar conta devem ficar
   acessíveis sem sobreposição, cortes, rolagem horizontal ou alvos comprimidos.
   Usar composição responsiva coerente, incluindo menu quando necessário; não
   impor mesma altura fixa se isso prejudicar zoom ou conteúdo longo.
5. Preservar âncoras institucionais e seus estados ativos, URLs e destinos da logo:
   login/cadastro retornam à landing; catálogo/perfis públicos levam ao catálogo.
   Não alterar implicitamente o destino da marca nas áreas operacionais.
6. Preservar contexto validado de barbearia, escolha visual de perfil, retorno
   canônico ao subdomínio e indisponibilidade do Google, conforme `CLIENT_AUTH.md`.
   Encerrar a prévia continua sendo uma ação local, não logout real.
7. Preservar sidebar desktop do admin, header/menu mobile e comportamento do
   superadmin. Alterações em componentes compartilhados exigem regressão dos
   papéis afetados; não mudar domínio, permissões ou navegação operacional aprovada.

Critérios de conclusão:

- [x] Verificar todas as famílias de header em 320, 390, 768 e 1440px, incluindo
  pontos imediatamente antes/depois dos breakpoints e zoom desktop de 200%.
- [x] Testar nomes longos, visitante, prévia de cliente, saída, contexto válido
  e ausente; nenhuma opção deve apontar a uma página inexistente.
- [x] Menus abrem/fecham por mouse, toque e teclado; Escape e retorno de foco
  funcionam, foco não alcança o fundo de um drawer modal, rolagem é restaurada
  e navegação/resize não deixam overlay ou bloqueio residual.
- [x] Controles têm rótulos acessíveis, estado expandido, foco visível e áreas
  de toque de pelo menos 44px; respeitar movimento reduzido.
- [x] Links de acesso, logo, perfil, ajuda, catálogo, subdomínio e âncoras mantêm
  seus destinos/contextos; admin e superadmin não sofrem regressão.
- [x] Executar testes de comportamento e QA no navegador, regressões relevantes
  de auth/roteamento/perfil, lint, TypeScript e build. Registrar ambiente,
  comandos, resultados e limitações; screenshot isolada não prova interação.
- [x] Atualizar a documentação de navegação afetada e registrar os padrões
  compartilhados sem declarar OAuth, sessão ou autorização implementados.

Verificações realizadas em Windows/Edge 154, servidor de desenvolvimento local
em `localhost:3000` e tenants `.localhost`. Toque emulado por Playwright; zoom
nativo 200% por preferência de perfil temporário (janela 1440px, viewport CSS
707px, DPR 2). Matriz inclui 639/640, 1023/1024 e 1199/1200px, altura 240px,
nome de cliente com 300 caracteres e menu extenso do admin. A inspeção do foco
e dos rótulos foi DOM/teclado, sem uso real de leitor de tela. Não valida
Android/iOS, Safari/Firefox, publicação HTTPS/DNS/TLS ou autenticação real.
Resultados, arquivos, comandos e capturas: [HEADERS_REVIEW.md](HEADERS_REVIEW.md).

Ajuste posterior solicitado: header da prévia do cliente igual ao do barbeiro,
com controles de Notificações demonstrativas e Perfil à direita. Exclusivamente
no catálogo `/barbearias` em estado visitante, as ações de acesso ficam
centralizadas no drawer. Isso não muda a referência da landing nos demais
contextos nem implementa notificações, sessão ou autorização reais.

### 10.3. QA transversal e pendências da PWA

**Estado atual em 2026-10-07:** consolidação de testes e acessibilidade implementada
após solicitação explícita, com `test:qa:local`, `test:qa:browser` e
`test:qa:production`, ferramentas separadas, evidências únicas e correções
pontuais. Chromium, Firefox e WebKit têm testes locais comprovados, com recortes
e limitações em [FRONTEND_PENDING_REVIEW.md](VALIDATION_HISTORY.md#revisao-final).
**Parcialmente validada**: leitor de tela operado por pessoa, dispositivos físicos,
Safari real, instalação manual e HTTPS publicado permanecem pendentes.
Preparação e limites em [QA_ACCESSIBILITY.md](QA_ACCESSIBILITY.md).
Os registros anteriores permanecem históricos; não representam reexecução.

Consolidar os testes existentes, evitando outra implementação da mesma PWA:

- Tornar reproduzível a regressão de descoberta → perfil → introdução → wizard,
  área global do cliente, agenda do barbeiro e gestão demonstrativa do superadmin.
  Wizard e lista global continuam independentes; não testar sincronização fictícia.
- Documentar preparação do servidor e configuração de Host/porta por ambiente,
  fixtures, reset de amostras e dependências do navegador. Não depender de caminhos
  absolutos da máquina de um desenvolvedor. A consolidação final implementou
  `.github/workflows/frontend.yml`, com lint, TypeScript, regras, build e
  navegador/PWA Chromium. A execução real
  [37642914180](https://github.com/T-J-Labs/barberhub/actions/runs/37642914180)
  passou nos dois jobs Ubuntu, incluindo Chromium, testes, builds e upload.
  Revisão `97cee8d917084d255f4d8112cbf9b876c41c2978`; ver artefato e limites
  na [revisão final](VALIDATION_HISTORY.md#revisao-final). Não representa deploy.
- Complementar a inspeção DOM/teclado com leitor de tela real e aparelhos
  Android/iOS quando disponíveis. Registrar Safari real e instalação manual,
  distinguindo testes novos das evidências já existentes.
- Por decisão de 2026-10-07, hospedagem na internet e validação pública ficam
  para a etapa final, após as integrações com o backend estarem funcionando e
  validadas localmente. DNS/TLS e HTTPS continuam sem validação pública;
  disponibilidade de hospedagem, por si só, não antecipa essa etapa nem autoriza
  publicação. Integração real continua dependente de contratos e solicitação própria.
- Acompanhar contraste e desempenho com medições comparáveis. Preservar os botões
  públicos corrigidos (`sky-500`, texto `#07111C`). O indicador “1” foi mantido
  com contraste insuficiente por decisão explícita; uma correção futura exige
  nova aprovação, medição de contraste e regressão visual.

### 10.4. Minhas barbearias — implementada como demonstração local

Decisão aprovada em 2026-10-06: **o vínculo real nasce após o primeiro
agendamento real confirmado na barbearia**. Substitui a pendência anterior.
A implementação solicitada usa vínculos fictícios prontos e independentes.
[Arquivos, comportamento, QA e pendências](CLIENT_BARBERSHOPS.md).

- Rota global `/cliente/barbearias`, feature `client-barbershops`, menu e ajuda.
- Esquina e Navalha da mesma identidade fictícia, avatar de iniciais e localização.
- Perfil público canônico, introdução de agendamento no subdomínio e consulta
  de agendamentos com filtro público validado, combinado à busca.
- Valores desconhecidos/repetidos e hosts inválidos não selecionam outra barbearia.
- Vazio, carregamento, erro e indisponibilidade com orientação; indisponibilidade
  mantém vínculo fictício e consulta, sem motivo ou remoção automática.
- Sem favoritos, Tornar-me cliente, desvinculação ou dados privados.
- Wizard, cancelamento local e suspensão no superadmin não alteram vínculos.
- Sem backend, sessão, persistência, cache privado ou endpoints.

### 10.5. Onboarding do proprietário — demonstração implementada

Plano específico aprovado em 2026-10-06 substitui as pendências anteriores de
percurso e configuração mínima. `/onboarding/barbearia` existe somente no domínio
principal; cadastro Barbearia e detalhes de rascunho oferecem entradas separadas.
Acesso direto permite escolher os mesmos exemplos de cadastro/Horizonte e
convite fictício/Pátio. Não recebe dados do cadastro ou do rascunho.

Seis etapas: estabelecimento, endereço público pretendido, serviço inicial,
profissional inicial, funcionamento e revisão. Nome/localização, sintaxe e conflito
local do subdomínio, serviço ativo, associação e intervalo suficiente dentro do
funcionamento compõem o checklist calculado, atualizado após cada edição.
Voltar preserva dados; reiniciar/sair/recarregar descarta o ensaio.

Estados: configuração incompleta com pendências acionáveis; configuração completa
com liberação pendente; configuração e liberação demonstrativas completas com prévia.
A liberação para publicação requer configuração mínima e compra confirmada ou
liberação explícita pelo superadmin. As opções são cenários fictícios; não compram,
concedem acesso ou publicam. Atalhos administrativos usam dados independentes e
mostram aviso na chegada, sem substituir fixtures/CRUDs.

Sem OAuth, upload externo, convites enviados, provisionamento, endereço acessível,
reserva de subdomínio, compra, plano, conta, tenant, vínculo ou acesso real.
Modelos/fixtures/validações/checklist/transições em `owner-onboarding`; nenhuma
mudança em backend, banco ou OpenAPI. [Arquivos, testes e limites](OWNER_ONBOARDING.md).

### 10.6. O que ainda depende de backend ou fica para depois

- **Integração:** Google/OAuth, sessões entre domínios, autorização por papel e
  tenant, vínculos reais, disponibilidade, concorrência, reservas, cancelamento,
  reagendamento persistido, publicação e cadastro real de estabelecimentos.
  Só integrar após contratos aprovados no OpenAPI; não inventar DTOs ou endpoints.
- **Decisões de produto:** demais efeitos do ciclo de vida do vínculo (criação
  aprovada após primeiro agendamento real confirmado), identidade/vínculo real do
  responsável e demais efeitos de ativação. Configuração mínima e liberação
  explícita sem compra foram aprovadas no plano de onboarding; execução real
  continua dependente de contratos. Outras regras podem ser
  discutidas agora, mas não transformadas em regras reais por um agente.
- **Fora desta sequência:** planos/assinaturas, pagamentos, fidelidade, favoritos,
  geolocalização, avaliações, rankings e notificações reais. “Planos e assinaturas”
  do superadmin permanece indisponível; não inventar condições comerciais.

**Próxima prioridade de QA:** completar as verificações manuais e externas ainda
pendentes em [QA_ACCESSIBILITY.md](QA_ACCESSIBILITY.md). A consolidação local
foi implementada; isso não conclui integralmente a QA. A revisão dirigida de headers foi
implementada após solicitação explícita; não executar novas funcionalidades
automaticamente nem repetir a revisão já concluída.

## 11. Consolidação das entregas e revisões — 2026-10-06

Os registros abaixo consolidam o estado do frontend, sem autorizar novas
implementações nem transformar evidências históricas em testes desta rodada.

| Entrega existente | Registro de implementação e limites |
| --- | --- |
| Catálogo e perfil público | [BARBERSHOP_CATALOG.md](BARBERSHOP_CATALOG.md) e [PUBLIC_BARBERSHOP.md](PUBLIC_BARBERSHOP.md) |
| Apresentação de login/cadastro e retorno seguro | [CLIENT_AUTH.md](CLIENT_AUTH.md) |
| Agendamento demonstrativo | [CLIENT_BOOKING.md](CLIENT_BOOKING.md) |
| Meus agendamentos | [CLIENT_APPOINTMENTS.md](CLIENT_APPOINTMENTS.md) |
| Área do barbeiro | [BARBER_DEMO.md](BARBER_DEMO.md) |
| Perfil e ajuda de cliente/barbeiro | [PROFILE_HELP.md](PROFILE_HELP.md) |
| Superadmin, cadastro manual e ajuda | [SUPERADMIN_DEMO.md](SUPERADMIN_DEMO.md) |
| PWA e política offline | [PWA.md](PWA.md) |
| Headers e navegação compartilhada | [HEADERS_REVIEW.md](HEADERS_REVIEW.md) |
| Consolidação de QA | [QA_ACCESSIBILITY.md](QA_ACCESSIBILITY.md), com pendências manuais/externas |
| Minhas barbearias | [CLIENT_BARBERSHOPS.md](CLIENT_BARBERSHOPS.md), incluindo revisão independente |
| Onboarding demonstrativo do proprietário | [OWNER_ONBOARDING.md](OWNER_ONBOARDING.md), incluindo revisão independente |

Na revisão independente da Ajuda foram reexecutados lint, TypeScript,
`test:superadmin:help` em desenvolvimento e produção local e `test:qa:local`.
Todos passaram; não foram encontrados bloqueadores no escopo demonstrativo.
O build existente foi reutilizado, não reconstruído nesta revisão. As evidências
e os testes da revisão anterior de onboarding foram registrados nos documentos
das respectivas features. Não houve alterações na aplicação, backend ou banco.

As entregas funcionais solicitadas desta sequência podem ser consideradas
concluídas **como apresentação/demonstração local**. A próxima ação é complementar
QA manual e externo mediante disponibilidade de equipamentos/ambiente, não
reimplementar telas concluídas. Integração real continua na seção 10.6.

## 12. Landing institucional revisada — 2026-10-07

Implementação solicitada explicitamente após aprovação da proposta visual v2.
Hero com agenda real, presença pública, agendamento, operação com abas,
configuração, plano único de R$ 40, FAQ e encerramento têm composições próprias.
Capturas completas com enquadramentos responsivos e originais DPR 1/2, servidos
em WebP sem perdas. Header e estilos novos ficam restritos à landing.
Não altera catálogo, autenticação demonstrativa, domínios, áreas operacionais,
providers, PWA ou backend. [Arquivos, QA executado e limitações](INSTITUTIONAL_LANDING.md).
Esta entrega não autoriza novas funcionalidades nem conclui a QA externa pendente.
## 12. Consolidação final solicitada — 2026-10-06 e 2026-10-07

Foi executado o complemento local de QA/acessibilidade, com Edge/Chrome,
teclado/foco/responsividade e evidência DOM dos inconclusivos. Corrigidos
contraste secundário de Relatórios/Ajuda admin e nome acessível das iniciais
em Configurações, preservando features, regras, domínios e botões públicos.
Instalação limpa isolada, lint, TypeScript, build novo e regressão de produção
com 19 suítes passaram, incluindo jornadas e PWA. Dependências de produção
corrigidas; cinco alertas das ferramentas de lint permanecem documentados.

GitHub Actions implementado para lint, TypeScript, regras, build e navegador/PWA
Chromium, com primeira execução real aprovada no Ubuntu em 2026-10-07 e
artefato publicado. O executor local passou no Chromium gerenciado,
com snapshot estável: seis suítes em desenvolvimento e 19 em produção.
No acompanhamento, o ambiente pessoal adotou o lock e o usuário aprovou texto
escuro sobre sky-500, aplicado com regressão sem exceções de contraste.
Leitor de tela, dispositivos físicos, Safari real, revisão humana integral
dos inconclusivos, DNS/TLS publicado e instalação manual continuam pendentes.
Uma rodada posterior exercitou WebKit no Windows, corrigiu foco e validou a
abertura standalone real do Edge. O indicador “1” da landing permanece em
2,7:1 por decisão explícita de preservar o visual; os botões públicos usam o
texto escuro aprovado. Cinco alertas altos da cadeia de lint continuam sem
correção compatível publicada.
[Comandos, resultados, falhas corrigidas e limites](VALIDATION_HISTORY.md#consolidacao-inicial).
[Estado posterior e evidências reais do CI](VALIDATION_HISTORY.md#acompanhamento).
[Última revisão, resultados e limitações](VALIDATION_HISTORY.md#revisao-final).
Não autoriza novas features nem repetição das entregas concluídas.

## 13. Encerramento técnico e classificação — 2026-10-07

### Pendências técnicas resolvidas

- Documentação atual reconciliada com evidências, preservando falhas e resultados
  históricos datados. [Registro completo](TECHNICAL_CLOSURE.md).
- Atualização do ambiente pessoal comprovada: Next 16.3.8/Axios 1.20.0 instalados;
  lock preservado. Node 24.21.0/npm 11.19.0 conferidos nesta rodada.
- CI remoto da revisão final de código `97cee8d917084d255f4d8112cbf9b876c41c2978`
  aprovado nos dois jobs, com upload de artefato:
  [37642914180](https://github.com/T-J-Labs/barberhub/actions/runs/37642914180).
  Metadados acessíveis conferidos; sem nova execução remota nesta rodada.
- Botões públicos corrigidos e medidos: texto `#07111C` sobre `sky-500`,
  7,017:1; fallback 6,851:1 e cache v2. Sem exceção nos testes atuais.
- Testes locais comprovados em Chromium, Firefox e WebKit nos recortes da
  [revisão final](VALIDATION_HISTORY.md#revisao-final): produção 19/19; Firefox 70/70 grupos;
  WebKit 75/75 em repetição direta e 23 rotas retestadas por engine no coletor final.
  O agregado WebKit com timeout permanece FAIL, sem alegar novo 5/5.
- Edge 154.0.4258.62: abertura standalone real automatizada, instalação e
  desinstalação em perfil temporário. Não encerra instalação manual humana.
- Novas auditorias npm executadas; produção zero alertas. Lint, TypeScript e
  dez suítes de regras passaram nesta rodada. Evidências em
  `validation/qa-runs/technical-closure-2026-10-07/`.

### Pendências externas ou decisões preservadas

- **Pendência externa:** cinco altos propagados de braces 3.0.3 na cadeia
  `eslint-config-next 16.3.8 → @next/eslint-plugin-next 16.3.8 → fast-glob 3.3.1
  → micromatch 4.0.8 → braces 3.0.3`. Sem versão corrigida publicada no advisory;
  config/plugin 16.4.0 ainda usam a cadeia afetada. Downgrade 14.2.35 sugerido
  pelo audit rejeitado. Reavaliar após correção oficial compatível, validar
  instalação limpa/lock, lint, tipos, regras, build e CI do novo commit.
- **Adiada para a etapa final por decisão de 2026-10-07:** publicação e validação
  pública ocorrerão após as integrações com o backend estarem funcionando e
  validadas localmente. Usuário confirmou ausência de domínio/site publicado.
  Faltam ambiente de demonstração/homologação, commit a publicar, domínio
  principal e dois subdomínios, DNS/TLS, `BARBERHUB_PUBLIC_HOST` e autorização
  explícita de publicação/infraestrutura. Validação pública não executada;
  Host/HTTPS lógico local não comprova DNS/TLS. Plano em [TECHNICAL_CLOSURE.md](TECHNICAL_CLOSURE.md).
- **Decisão preservada:** indicador “1” com contraste insuficiente de 2,7059:1,
  mantido visualmente como solicitado. Correção futura exige nova aprovação
  explícita, medição e regressão visual. Não declara acessibilidade integral.

### QA humano excluído desta entrega

- Leitor de tela operado por pessoa e anúncios reais; revisão humana integral
  de inconclusivos, contraste e zoom.
- Android/iPhone físicos, Safari real e instalação manual humana.

Esses itens permanecem pendentes. Automação Chromium/Firefox/WebKit, axe ou
Edge não equivale a esses testes. As etapas de publicação e validação publicada
continuam não executadas; o trabalho inteiro não é declarado concluído.
