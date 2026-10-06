# Próximas entregas do frontend — sem depender do backend

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
- Quando o usuário pedir a primeira entrega deste plano, limitar o trabalho ao
  agendamento demonstrativo, documentação associada e testes. Não executar o
  restante do roadmap automaticamente.
- Manter entregas pequenas e separadas. Não incluir outra reformulação do Header,
  mudança de domínio do admin ou alterações de backend/banco nesta sequência
  demonstrativa sem uma solicitação específica.
- Respeitar o ADR e o contrato OpenAPI. Dúvidas que mudem regras de negócio,
  autenticação ou escopo devem ser esclarecidas antes de implementar.
- Ao concluir uma entrega, atualizar seu estado e registrar somente verificações
  realmente executadas. Não apresentar uma simulação como funcionalidade integrada.

## 2. Diagnóstico e prioridade

**O agendamento demonstrativo foi implementado em 2026-10-05.** É a
continuação da jornada de descoberta e conta global do cliente prevista no ADR.

Estado observado na revisão estrutural e documental:

- Landing, catálogo, perfil público, páginas administrativas e navegação possuem
  interfaces. Isso não certifica autenticação, persistência ou autorização real.
- Login/cadastro possuem apresentação pronta; Google permanece indisponível.
  A prévia do header de cliente não cria sessão. Consulte
  [CLIENT_AUTH.md](CLIENT_AUTH.md).
- Cliente tem “Meus agendamentos” demonstrativos em `/cliente/agendamentos`;
  barbeiro tem início e agenda demonstrativos. Na revisão original, superadmin
  tinha apenas layout e navegação; em 2026-10-06 recebeu a demonstração básica
  descrita na seção 8 e em [SUPERADMIN_DEMO.md](SUPERADMIN_DEMO.md).
- O CTA “Agendar horário” abre a introdução de `/agendar` no subdomínio.
  A feature `booking` oferece serviço, profissional, data, horário, revisão,
  resultado e conflito com recuperação. Esquina e Navalha têm exemplos completos.
  Implementação e verificações: [CLIENT_BOOKING.md](CLIENT_BOOKING.md).
- O OpenAPI mantém `paths: {}`. Não há operações aprovadas para integrar essas
  novas interfaces.

Este registro não constitui uma nova execução de QA nem a conclusão de uma branch
funcional. Não é necessário remodelar novamente o Header para iniciar o wizard.

## 3. Sequência das entregas restantes

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

“Minhas barbearias” permanece depois da jornada inicial, conforme a escolha do
usuário. Não confundir com favoritos nem presumir regras de vínculo ainda não
definidas.

## 4. Primeira entrega: agendamento demonstrativo

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
  Manter os botões primários aprovados: `bg-sky-500`, texto branco e hover sem
  mudar o tom de azul, respeitando movimento reduzido.
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

A reserva demonstrativa e a futura lista global do cliente terão **dados
independentes**. A conclusão no subdomínio não deve adicionar automaticamente
uma reserva a “Meus agendamentos”. A limitação precisa estar visível.

Na entrega posterior, o reagendamento poderá abrir o wizard no estabelecimento,
mas não atualizará automaticamente a lista global. Não criar armazenamento
compartilhado entre domínios para contornar a ausência de integração.

### 4.6. Documentação associada à futura implementação

- Atualizar `PUBLIC_BARBERSHOP.md` para descrever o novo destino do CTA somente
  quando o wizard existir. Até lá, o destino continua sendo `#agendamento`.
- Atualizar `CLIENT_EXPERIENCE.md` e este roadmap para distinguir interface
  demonstrativa concluída de funcionalidades aguardando integração.
- Documentar o wizard, seus cenários locais, testes e limitações, com links no
  README. Não apresentar URLs ou comandos ainda inexistentes como disponíveis.
- Manter referências de autenticação e navegação coerentes com `CLIENT_AUTH.md`.
- Preservar registros históricos de validação e acrescentar os novos resultados
  efetivamente obtidos, sem tratar testes antigos como validação da nova feature.

## 5. Critérios de conclusão e testes

Cada futura entrega exige testes de comportamento e QA no navegador, além de
ESLint, TypeScript e build. Os resultados efetivamente executados para o wizard
estão em [CLIENT_BOOKING.md](CLIENT_BOOKING.md). Os critérios abaixo preservam
o plano; verificações manuais não realizadas devem permanecer pendentes.

### Primeira entrega

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
- Onboarding de estabelecimento/equipe aguarda definição de suas regras.
- Geolocalização, avaliações, rankings, favoritos, pagamentos e fidelidade não
  fazem parte desta sequência inicial.
- Não introduzir preços de planos, condições comerciais, contatos ou avaliações
  reais inventados.

**Área do barbeiro implementada como demonstração local.** Consulte [BARBER_DEMO.md](BARBER_DEMO.md).

**Perfil e ajuda demonstrativos implementados para ambos os papéis.**
As etapas restantes exigem solicitação própria, sem reservas ou autorização reais.

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

Implementar primeiro o perfil dos dois papéis; depois, a ajuda contextual de
ambos. As quatro telas compõem a etapa 4. Não incluir perfil/ajuda de admin ou
superadmin, nem alterar suas páginas ou domínios. Preservar as convenções de
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
alterados. Responsável/Google, liberação sem compra, auditoria, provisionamento,
publicação e cobrança continuam separados e dependentes de definição real.

Verificações desta ampliação: lint, TypeScript, build, 12 grupos de regras,
20 grupos de cadastro no navegador por ambiente (desenvolvimento/produção),
regressão do superadmin com 27/25 verificações e roteamento com 3 testes de host
e 15 HTTP em desenvolvimento. QA DOM/teclado e visual em 320/390/768/1440px,
sem leitor de tela real. Comandos, arquivos e limitações em
[SUPERADMIN_DEMO.md](SUPERADMIN_DEMO.md#cadastro-manual-demonstrativo--implementado-em-2026-10-06).

## 9. PWA e acabamento transversal — 2026-10-06

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
