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
- Cliente, barbeiro e superadmin possuem layouts e navegação, mas ainda não suas
  páginas funcionais.
- O CTA “Agendar horário” abre a introdução de `/agendar` no subdomínio.
  A feature `booking` oferece serviço, profissional, data, horário, revisão,
  resultado e conflito com recuperação. Esquina e Navalha têm exemplos completos.
  Implementação e verificações: [CLIENT_BOOKING.md](CLIENT_BOOKING.md).
- O OpenAPI mantém `paths: {}`. Não há operações aprovadas para integrar essas
  novas interfaces.

Este registro não constitui uma nova execução de QA nem a conclusão de uma branch
funcional. Não é necessário remodelar novamente o Header para iniciar o wizard.

## 3. Sequência das entregas restantes

A primeira entrega está **implementada como demonstração local**. As demais
continuam planejadas e dependem de solicitação específica.

| Ordem | Entrega | Escopo sem backend |
| --- | --- | --- |
| 1 | Agendamento demonstrativo — implementado | Serviço, profissional, data, horário, revisão, conflito e resultado demonstrativo no subdomínio da barbearia. |
| 2 | Meus agendamentos | Área global do cliente com próximas reservas, histórico, detalhes, cancelamento em memória e acesso à prévia de reagendamento. Usar exemplos de duas barbearias para uma identidade fictícia. |
| 3 | Área do barbeiro | Início com próximo atendimento e agenda própria demonstrativa; detalhes, conclusão, falta, bloqueio e desbloqueio de horários em memória. |
| 4 | Perfil e ajuda | Prévia de edição do nome de exibição e ajuda contextual para cliente e barbeiro, reutilizando `SettingsShell`, `HelpShell` e padrões existentes. Não alterar a conta Google. |
| 5 | Superadmin básico | Visão geral, lista, busca e detalhes de barbearias, com suspensão/reativação demonstrativas. Não implementar cobrança ou inventar preços e condições comerciais. |
| 6 | PWA e acabamento transversal | Manifesto, ícones, instalação, tela de indisponibilidade offline e revisão de acessibilidade, desempenho e navegação. Sem reservas offline ou cache de dados privados. |

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

**Próxima entrega funcional recomendada, quando solicitada: Meus agendamentos
demonstrativos, com fixtures independentes do wizard e sem reservas reais.**
