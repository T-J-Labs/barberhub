# Integração frontend/backend — entregas pequenas e harness

Plano registrado em 2026-10-08, após solicitação do usuário. **Estado: planejado;
nenhuma entrega H00–H24 foi implementada por este registro.**

Este documento organiza a integração real. O [roadmap do frontend](../frontend/FRONTEND_ROADMAP.md)
preserva as entregas demonstrativas concluídas e seus limites de QA. O
[ADR](../architecture/ADR.md) registra decisões de produto/arquitetura; o
[OpenAPI](../api/openapi.yaml) continua sendo a fonte de verdade das operações.
Este plano não aprova endpoints, schemas, sessão ou mudanças de banco por si só.

## 1. Uso pelos agentes e limites

- Planejamento/documentação não autoriza executar as entregas. Implementar
  somente o recorte solicitado, após conferir código e estado atual.
- Uma tarefa por execução e uma entrega pequena por PR. Entregas maiores devem
  ser subdivididas em cartões, sem alterar os IDs principais deste plano.
- Preferir recortes verticais: contrato aprovado → backend → cliente gerado →
  frontend → teste integrado. Fundação e decisões têm critérios próprios;
  não exigem integração de tela artificial para serem concluídas.
- Alterar frontend e backend juntos somente quando necessário ao recorte.
  Não executar automaticamente a entrega seguinte.
- Banco, migrações, reset de dados, infraestrutura, credenciais Google e
  publicação exigem autorização específica. Não usar o banco pessoal existente.
- Preservar design, headers, sidebar administrativa, domínios e retorno canônico.
  Uma mudança de política de domínio/retorno precisa de decisão explícita.
- Não adaptar o produto ao login com senha existente. A decisão vigente é
  Google exclusivo e identidade global do cliente.
- Não armazenar tokens em `localStorage`, expor segredos ou usar um tenant
  escolhido no navegador como autorização. O transporte da sessão depende de H00.
- Simulações permanecem identificadas e separadas. Não mostrar fixtures como
  fallback silencioso de falha da API, nem permitir que uma prévia conceda acesso
  a dados reais. Dados privados não entram no cache da PWA; não há reserva offline.
- Registrar apenas verificações executadas. CI, navegador automatizado, Google
  real, ambiente publicado e QA humano são evidências diferentes.

## 2. Base observada e bloqueadores

Levantamento estático de 2026-10-08; não comprova backend funcionando em execução.

| Base atual | O que pode ser aproveitado | Bloqueador antes de integrar |
| --- | --- | --- |
| Criação de tenant em `/api/tenants` | Entidade, repositório e verificação de subdomínio duplicado. | Contrato, `/api/v1`, autorização, validação e distinção criação/liberação/publicação. |
| Proprietário em `/users/owner` | Parte da estrutura de identidade e relacionamento. | Vínculo recebido por `tenantId` sem comprovação; Google e resposta segura. |
| Login em `/auth/login` | Parte da emissão de JWT. | Usa senha; não atende Google exclusivo. |
| Spring Security | Base de proteção. | Não foi encontrada validação Bearer JWT nem autorização por papel/tenant. |
| `User` retornado pelo controller | Estrutura persistida existente. | Getter de `password` pode expor hash; usar DTO público seguro. |
| Usuário com tenant obrigatório | Parte do vínculo profissional. | Não atende identidade global do cliente; revisar com o responsável pelo banco. |
| OpenAPI com `paths: {}` | Estrutura inicial do contrato. | Nenhuma operação aprovada para consumo. |
| Axios, Orval, MSW e QA do frontend | Infraestrutura reaproveitável. | Ainda não comprovam integração real. |

Os caminhos acima descrevem código existente, **não rotas aprovadas a consumir**.
Ainda não foram encontrados endpoints de catálogo, serviços, equipe,
disponibilidade ou agendamentos. Reavaliar antes de cada entrega; o levantamento
não obriga reimplementar algo que tenha sido concluído posteriormente.

## 3. H00 — decisões antes de implementação

Preparar e aprovar decisões para:

1. Chamadas diretas à API ou camada intermediária no Next.js; responsabilidades
   do servidor e do navegador, sem acesso direto do frontend ao banco.
2. Sessão: transporte, expiração, encerramento, revogação quando aplicável,
   cookies, CORS e proteção CSRF conforme a arquitetura escolhida.
3. Google: fluxo, validação de identidade, criação/vinculação, origens e callbacks.
   Configurações reais são dependências externas; não inventar credenciais.
4. Identidade global, papéis e vínculos autorizados; selecionar um perfil não
   concede permissões. Identificar alterações necessárias de banco sem executá-las.
5. Domínio principal e subdomínios, retorno canônico e resolução do contexto.
   Não transformar `returnTo`, Host encaminhado ou tenant arbitrário em autorização.
6. Estados de tenant criado, configurado, liberado, publicado e suspenso.
   Configuração mínima + compra confirmada ou liberação explícita continuam
   necessárias para publicação, conforme ADR 09.
7. Convenções do contrato: `/api/v1`, DTOs, validações, paginação e erros;
   política de informações públicas versus privadas.

**Aceite:** decisões e alternativas registradas, pendências atribuídas e escopo
inicial do contrato revisado. Mudanças que alterem decisões existentes exigem
aprovação antes de atualizar o ADR. Não aprovar toda a API antecipadamente:
cada entrega fecha seu próprio contrato antes de implementação.

## 4. Harness reproduzível — H01 e expansão por entrega

Harness significa a estrutura que prepara o ambiente, executa testes e preserva
evidências. Reutilizar os executores em `validation/` e os comandos existentes;
não criar uma segunda suíte de frontend com a mesma responsabilidade.

| Camada | Evidência esperada |
| --- | --- |
| Contrato | OpenAPI válido; respostas/entradas/erros compatíveis; geração Orval reproduzível, sem edição manual dos gerados. |
| Backend | Validação, autenticação, autorização, persistência e isolamento entre identidades/tenants. |
| Jornada integrada | Navegador → frontend → API real → armazenamento exclusivo de testes. |

### Preparação e segurança

- Ambiente isolado e identificável. Escolha de infraestrutura/banco de teste
  em H00/H01; não pressupor disponibilidade nem criar infraestrutura sem autorização.
- Massa determinística: duas barbearias, dois clientes, profissionais e
  proprietários distintos, superadmin e estabelecimento indisponível.
  Criar dados progressivamente conforme os módulos existirem, sem forçar modelos
  ainda não aprovados no banco.
- Inicialização, prontidão por condição observável, execução e encerramento
  somente dos processos criados pelo executor. Não depender de pausas fixas.
- Reset apenas no ambiente exclusivo de testes, depois de validar o alvo.
  Não limpar o banco de desenvolvimento nem usar dados pessoais reais.
- Desabilitar MSW no teste integrado. Testes isolados com mocks devem aparecer
  com identificação própria, sem serem contabilizados como integração real.
- Testar Google com verificador controlado somente em ambiente de teste e,
  separadamente, validar com o provedor real. Nunca publicar bypass de identidade.
- Controlar relógio/datas nos testes de agenda para evitar expiração da massa.
- Logs sanitizados: sem JWT, cookies, senhas, hashes, credenciais ou dados pessoais.

### Evidências e CI

Preservar por execução commit, versão do contrato, ambiente, comandos, duração,
resultados, falhas, logs sanitizados e capturas quando úteis. Evidências locais
podem usar `validation/qa-runs/`, ignorado pelo Git; publicar no CI apenas os
artefatos sanitizados e com retenção definida. Não substituir FAIL antigo por PASS.

Acrescentar testes do backend e integração ao CI, preservando o workflow do
frontend. Comandos novos devem ser documentados **depois de implementados**;
este plano não apresenta executores ainda ausentes como disponíveis.

## 5. Sequência de entregas

**Todos os IDs abaixo estão pendentes.** Dependências indicam capacidades/testes
necessários, não apenas ordem numérica. Atualizar estado somente com evidência.

### Fundação e consultas públicas

| ID | Entrega e dependências | Tarefas pequenas | Aceite específico |
| --- | --- | --- | --- |
| H00 | Decisões e contratos iniciais. | Executar seção 3; registrar bloqueadores e autorizações necessárias. | Decisões aprovadas sem mudança implícita de domínio ou banco. |
| H01 | Harness mínimo; depende de H00 e autorização do ambiente. | Preparar isolamento; testes HTTP/backend; prontidão, reset seguro, relatórios e CI. | Execução reproduzível sem acessar banco pessoal. Ainda não declara jornadas inexistentes aprovadas. |
| H02 | Base segura da API; depende de H00/H01. | Padronizar `/api/v1`; DTOs de resposta; validação/erros; corrigir exposição de hash e cadastro de vínculo arbitrário; proteger ou retirar rotas legadas inseguras. | Sem credenciais nas respostas e sem concessão arbitrária de vínculo. Até H05/H07, negar operações privadas sem autenticação validada, não fingir autorização completa. |
| H03 | Catálogo real; depende de H02 e dados públicos aprovados. | Contrato de busca/paginação; projeção pública; backend e cliente gerado; substituir fixtures da tela. | `/barbearias` usa API real, com busca/vazio/erro; não expõe dados privados ou exemplos como fallback. |
| H04 | Perfil público real; depende de H03. | Contrato da consulta por contexto público; resolução do subdomínio; dados institucionais e indisponibilidade. | Cada subdomínio mostra sua barbearia; desconhecido/não publicado não revela outro tenant. Serviços/equipe/horários entram após H09–H11. |

Primeiro marco utilizável: catálogo e perfil institucional com dados reais,
mesmo sem reservas. Critérios de publicação devem ser aprovados antes dessas
consultas; massa de teste não libera uma barbearia real automaticamente.

### Identidade e autorização

| ID | Entrega e dependências | Tarefas pequenas | Aceite específico |
| --- | --- | --- | --- |
| H05 | Google e sessão no backend; depende de H00–H02, configuração Google e alterações de identidade autorizadas. | Contrato; validação Google; criação/vinculação; validação de sessão; consulta da identidade autenticada. | Credencial inválida/expirada rejeitada; escolha de perfil não concede autorização. |
| H06 | Login e sessão no frontend; depende de H05. | Conectar acesso; identidade no header; expiração/saída; retorno canônico entre domínios. | Login, recarga, saída e retorno usam sessão real; sem alternativa de acesso pela prévia. |
| H07 | Papéis e tenant; depende de H05/H06. | Permissões/vínculos; proteger operações e composição das áreas; testes de acesso direto e troca de IDs. | Servidor limita acesso por identidade, papel e vínculo; filtro visual não é proteção. |

### Dados operacionais

| ID | Entrega e dependências | Tarefas pequenas | Aceite específico |
| --- | --- | --- | --- |
| H08 | Configurações; depende de H07. | Consulta/edição institucional; formulário; refletir dados publicáveis no perfil. | Edição persiste e só responsável autorizado altera. |
| H09 | Serviços; depende de H07/H08. | Contratos; operações administrativas; consulta pública dos publicáveis; conectar telas. | Preço/duração/estado validados; remoção não destrói histórico. |
| H10 | Equipe e vínculos; depende de H07/H08. | Aprovar inclusão/convite; implementar operações; conectar equipe. | Sem vínculo arbitrário ou acesso à equipe de outro tenant. |
| H11 | Funcionamento/jornadas; depende de H08–H10. | Contratos de fuso/intervalos/exceções; persistência; controles administrativos. | Intervalos inválidos rejeitados; configuração sustenta disponibilidade. |

Upload de logo, convite e subfluxos de equipe devem virar cartões próprios.
Não simular upload ou convite enviado como real enquanto faltarem suas dependências.

### Agendamento e cliente

| ID | Entrega e dependências | Tarefas pequenas | Aceite específico |
| --- | --- | --- | --- |
| H12 | Disponibilidade; depende de H04/H07/H09–H11. | Regras de data/fuso; cálculo no backend; conectar serviço → profissional → data → horário. | Horários refletem duração, jornadas, reservas e bloqueios implementados. Expandir regressão após H19. |
| H13 | Criar agendamento; depende de H12. | Contrato de confirmação/repetição; concorrência; revisão/resultado; criação transacional do vínculo aprovado. | Uma disputa não confirma duas reservas. Resultado incerto de rede não gera repetição insegura nem sucesso falso. |
| H14 | Meus agendamentos; depende de H13. | Consulta global do cliente; detalhes/filtro; atualização após confirmar. | Reserva no subdomínio aparece na área global; outro cliente não consulta seus dados. |
| H15 | Cancelar; depende de H14. | Aprovar regras/efeitos; operação; diálogo; atualizar lista e disponibilidade. | Cancelamento autorizado persiste; repetição não duplica efeitos. |
| H16 | Reagendar; depende de H14/H15. | Aprovar transação/conflito; carregar reserva original; conectar wizard e confirmação. | Falha não perde a reserva original; sucesso altera a reserva corretamente e atualiza consultas. |
| H17 | Minhas barbearias; depende de H13/H14. | Consulta de vínculos reais; lista/indisponibilidade; regressão da criação pelo primeiro agendamento. | Uma identidade tem vínculos em duas casas; simulação não cria vínculo. Não postergar a criação obrigatória de H13 para esta tela. |

A independência demonstrativa entre wizard e lista global termina no percurso
real. A mesma fonte persistida sustenta ambos. Regras de cancelamento,
reagendamento, envio repetido e ciclo de vida do vínculo precisam de contrato;
não presumir prazos ou remoção de vínculos.

### Operação e gestão

| ID | Entrega e dependências | Tarefas pequenas | Aceite específico |
| --- | --- | --- | --- |
| H18 | Agenda barbeiro/admin; depende de H07/H11/H13. | Consultas autorizadas; início/agenda/histórico; detalhes. | Recorte vem da autorização do servidor, não apenas de filtro visual. |
| H19 | Atendimento/bloqueios; depende de H18. | Cartões separados: concluir, registrar falta, bloquear e desbloquear; transições e conflitos. | Ações persistem e afetam disponibilidade/reputação conforme contrato; apenas titular autorizado opera. |
| H20 | Perfil real; depende de H06/H07. | Contrato de nome de exibição; consulta/edição; identidade coerente nas áreas. | Nome persiste sem alterar credenciais ou identidade Google. |
| H21 | Superadmin; depende de H07/H08 e estados de tenant aprovados. | PRs separados: lista/detalhes, cadastro manual, liberação, suspensão/reativação e auditoria. | Somente superadmin autorizado opera; efeitos no catálogo/acesso são testados, sem apagar históricos ou inventar efeitos em reservas. |
| H22 | Onboarding real; depende de H08–H11/H21. | Persistir rascunho/configuração; vincular responsável; checklist; aplicar liberação. | Checklist não publica sozinho; compra confirmada ou liberação explícita auditada é necessária. Sem checkout inventado. |
| H23 | Indicadores/ajuda; depende dos módulos correspondentes. | Contratos de métricas; cartões por dashboard/relatório; atualizar ajuda conforme cada integração. | Sem métricas fictícias como reais; ajuda descreve apenas operações disponíveis. Atualizar textos também ao concluir cada entrega anterior. |

H20 pode avançar após sua dependência, sem esperar toda a agenda. H21 pode
avançar após sua dependência, sem esperar H20. O caminho inicial recomendado
continua H00 → H01 → H02 → H03 → H04; não iniciar trilhas automaticamente.

### H24 — regressão final e ambiente público

Depende dos recortes integrados a homologar e de autorização de publicação.

1. Executar localmente jornadas completas com API real e massa isolada.
2. Testar mesma conta em duas casas; outro cliente sem acesso; equipe sem
   acesso cruzado; disputa concorrente; expiração/saída; perda de rede e repetição.
3. Verificar PWA sem cache de API, dados privados, sessão ou reserva offline.
4. Após autorização, preparar homologação e testar DNS/TLS, domínio principal,
   subdomínios, callbacks Google, sessão e recuperação de falhas publicados.
5. Registrar QA humano separadamente: leitor de tela, dispositivos físicos,
   Safari real e instalação manual. Automação não encerra esses itens.

Não declarar o MVP inteiro concluído porque um recorte passou. Publicação segue
a decisão vigente de ocorrer após integrações funcionando e validadas localmente.

## 6. Cartão obrigatório antes de cada execução

Usar esta estrutura no PR ou documento de acompanhamento, sem criar um segundo
roadmap concorrente:

```text
ID: Hxx.nn — título do recorte
Estado: pendente | em andamento | bloqueado | concluído
Objetivo e exclusões:
Dependências e decisões aprovadas:
Arquivos/sistemas autorizados:
Contrato e operações aprovadas (sem inventar rotas):
Banco/infra/credenciais: necessidade e autorização, ou não aplicável
Tarefas:
Testes positivos, negativos e de isolamento:
Critérios de aceite:
Reversão segura / preservação dos dados:
Evidências: commit, ambiente, comandos, resultados e limitações
PR/CI:
Pendências e próximo cartão (sem execução automática):
```

Contrato, backend e frontend podem ser subcartões da mesma entrega vertical.
Um subcartão aprovado não torna a integração inteira concluída. Em bloqueio,
registrar a dependência real, sem substituí-la por mock apresentado como sucesso.

## 7. Gate de conclusão por entrega

Para recortes executáveis:

- [ ] Contrato aprovado, válido e compatível com implementação/cliente gerado.
- [ ] Testes do backend e da feature aprovados, incluindo erros e isolamento.
- [ ] API real usada na jornada, com MSW desligado e persistência comprovada
  quando aplicável. Consultas têm origem real comprovada.
- [ ] Sem sucesso falso, fallback silencioso para fixtures ou permissão pela UI.
- [ ] Lint, TypeScript, build e regressões pertinentes aprovados; CI do commit verde.
- [ ] Documentação de contexto/ajuda atualizada e limitações explícitas.
- [ ] Evidências preservadas e reversão segura definida, sem restauração destrutiva.

H00 fecha por decisão/revisão; H01 por isolamento e execução reproduzível.
Não exigir testes de operações ainda não existentes nessas fundações. Usar
"não aplicável" com justificativa, não marcar teste não executado como aprovado.

Testes demonstrativos antigos ficam separados dos integrados. Não apagar
asserções, aumentar timeouts indiscriminadamente ou adicionar retries apenas
para deixar CI verde. Sincronizar por estado observável e corrigir a causa.

## 8. Fora do plano e próxima entrega

Não autoriza pagamento/checkout, assinatura, fidelidade, favoritos, avaliações,
rankings, geolocalização, notificações reais, redesign ou mudança implícita
de domínio. O preço comercial aprovado não implementa cobrança.

**Próxima execução recomendada: H00.** H01/H02 vêm depois; a primeira conexão
visível ocorre em H03. Nenhuma etapa foi iniciada por esta documentação.
