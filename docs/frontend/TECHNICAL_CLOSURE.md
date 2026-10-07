# Consolidação técnica baseada em evidências — 2026-10-07

Escopo: documentação, auditoria de dependências e conferência de validação
automatizada. Alterações locais existentes preservadas. Nenhuma tela, backend,
contrato, regra de domínio ou infraestrutura foi alterado nesta rodada.
Publicação e validação publicada estão **adiadas para a etapa final**; QA humano está
excluído desta entrega. Não se declara conformidade integral de acessibilidade.

## Estado comprovado

Foram conferidos arquivos brutos, e não apenas afirmações dos resumos:

| Verificação | Evidência e limite |
| --- | --- |
| Ambiente pessoal atualizado | `environment-followup-2026-10-07-5aa60d89/environment-update.json`: instalação e reinício anteriores, Next 16.3.8/Axios 1.20.0. `pending-resolution-2026-10-07/personal-preservation-final.json`: lock/ambiente preservados. As versões instaladas foram lidas novamente nesta rodada. Não foi alegado novo reinício. |
| CI da revisão final de código | [Run 37642914180](https://github.com/T-J-Labs/barberhub/actions/runs/37642914180), commit `97cee8d917084d255f4d8112cbf9b876c41c2978`: `run-final.json`, `jobs-final.json` e `artifacts-final.json` confirmam dois jobs e steps concluídos com success e artefato de 211.578.187 bytes. Metadados coletados anteriormente, acessíveis localmente; sem nova execução nem download de logs autenticados nesta rodada. |
| Chromium local | Produção final `production-stable-identities/2026-10-07T15-20-43.112Z-production-HbV0z2/run.json`: 19/19 suítes, 70 grupos, 110 auditorias, zero violações/exceções. Chromium gerenciado e Edge foram usados nas rodadas identificadas nos registros anteriores. |
| Firefox local | Firefox 146.0.1: 160 verificações de headers; jornadas finais 70/70, 110 auditorias, zero violações/exceções. Coletor final de teclado passou 23 rotas. |
| WebKit local | WebKit 26.0/build 2248 no Windows: 160 verificações de headers e três suítes de perfil/ajuda e superadmin PASS; repetição direta de jornadas 75/75, 122 auditorias, zero violações/exceções. Reteste do coletor final passou 23 rotas. Não se declara agregado WebKit 5/5; o agregado com timeout permanece FAIL. Não equivale a Safari real. |
| Edge standalone | `edge-headed-final/install-results.json`: Edge 154.0.4258.62, instalação, janela real em `/barbearias`, `standalone: true`, cookies/localStorage vazios, desinstalação. Preferência standalone definida por CDP, sem emulação de mídia. Não equivale a instalação manual humana. |
| Botões públicos | Texto `#07111C` sobre `sky-500`: revisão anterior mediu 7,017:1; fallback 6,851:1. Exceções de contraste removidas dos testes. Cache atual v2 distribui o HTML corrigido. |

Os caminhos abreviados acima são relativos a `validation/qa-runs/`; exceto o
ambiente pessoal, as evidências estão em `pending-resolution-2026-10-07/`.
[Revisão detalhada, comandos e falhas anteriores](VALIDATION_HISTORY.md#revisao-final),
[decisão dos botões](VALIDATION_HISTORY.md#acompanhamento). Resultados históricos FAIL, timeouts,
tentativas de instalação e medições Lighthouse anteriores foram preservados.
Esses testes não foram reexecutados como navegador/build nesta rodada documental.
CI comprova aquele commit executável; não comprova merge, deploy, main nem um
novo commit documental posterior.

## Auditorias reexecutadas e decisão de dependências

Windows local, Node **24.21.0**, npm **11.19.0**, Next **16.3.8**, Axios **1.20.0**.
Comandos na raiz, equivalentes aos comandos npm na pasta `frontend`:

```powershell
npm audit --json --prefix frontend
npm audit --omit=dev --json --prefix frontend
npm ls braces micromatch fast-glob @next/eslint-plugin-next eslint-config-next --all --json --prefix frontend
npm view braces version dependencies engines dist-tags --json
npm view micromatch version dependencies engines dist-tags --json
npm view fast-glob version dependencies engines dist-tags --json
npm view @next/eslint-plugin-next@16 version dependencies peerDependencies engines dist-tags --json
npm view eslint-config-next@16 version dependencies peerDependencies engines dist-tags --json
npm view eslint-config-next@16.3.8 version dependencies peerDependencies engines --json
npm view eslint-config-next@16.4.0 version dependencies peerDependencies engines --json
npm view @next/eslint-plugin-next@16.4.0 version dependencies --json
```

Auditoria completa: exit **1**, **cinco altos**, zero críticos/moderados/baixos.
Produção (`--omit=dev`): exit **0**, **zero alertas**. Isso é o resultado da
auditoria npm naquele momento, não prova de ausência de toda vulnerabilidade.
As cinco entradas são propagação de um mesmo advisory, não cinco falhas
independentes do runtime:

| Pacote | Instalado | Faixa reportada pelo npm audit | Origem |
| --- | --- | --- | --- |
| `eslint-config-next` | 16.3.8 | `>=14.3.0-canary.0` | Dependência direta de desenvolvimento; usa o plugin 16.3.8 |
| `@next/eslint-plugin-next` | 16.3.8 | `>=14.3.0-canary.0` | Usa `fast-glob` 3.3.1 |
| `fast-glob` | 3.3.1 | `*` | Usa `micromatch` 4.0.8 |
| `micromatch` | 4.0.8 | `>=0.2.0` | Usa `braces` 3.0.3 |
| `braces` | 3.0.3 | advisory `<=3.0.3`; entrada agregada `*` | Recursão sem limite em padrões profundamente aninhados |

[GHSA-vfj7-8cjw-p6xm / CVE-2026-93687](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm),
consultado em 2026-10-07: publicado em 2026-09-18, atualizado em 2026-10-02,
sem versão corrigida informada. O impacto descrito é esgotamento da pilha e
terminação do processo Node por padrões maliciosos. Neste projeto a cadeia
identificada pertence ao lint; a auditoria de produção não contém essas entradas.
Não foi demonstrado ataque ao serviço publicado nem explorabilidade remota da
aplicação. A cadeia continua sendo uma pendência de segurança das ferramentas.

Registro npm consultado: `braces` latest **3.0.3**, `micromatch` latest **4.0.8**
(continua com braces `^3.0.3`), `fast-glob` latest **3.3.3** (continua com micromatch
`^4.0.8`). Config/plugin Next **16.4.0**, estáveis mais recentes na consulta,
continuam usando `fast-glob` **3.3.1**. Peers do config: ESLint `>=9.0.0` e
TypeScript `>=3.3.1`; satisfazê-los não remove o advisory. Essa atualização não
resolve a cadeia, portanto não foi aplicada como suposta correção.

O npm oferece `eslint-config-next` **14.2.35**, marcado `isSemVerMajor: true`:
é downgrade major da ferramenta pareada com Next 16.3.8, rejeitado conforme o
escopo. Não usados `npm audit fix --force`, override ou substituição de glob.
O experimento anterior com adaptador local e falha ENOENT permanece no histórico.

**Classificação: pendência externa, sem correção compatível identificada.**
Reavaliar quando houver release corrigida de braces ou uma cadeia oficial de
lint compatível que o remova. Nessa condição, testar em checkout isolado com
lock reproduzível, `npm ci`, lint, TypeScript, regras, build e CI remoto do novo
commit antes de declarar resolução. Como nenhum pacote/lock foi alterado nesta
rodada, não foi necessário criar novo ambiente de atualização, instalação limpa,
build ou CI. As instalações/builds limpos anteriores permanecem evidências datadas.

Verificações atuais adicionais, em `frontend`: `npm run lint`,
`npm run typecheck` e `npm run test:rules` passaram (dez suítes, zero falhas).
Evidências novas: `validation/qa-runs/technical-closure-2026-10-07/`, com JSONs
brutos de auditoria/árvore/registro npm, códigos de saída e conferência de hashes.
`verification-summary.json` reúne a conferência atual, hashes dos nove relatórios
brutos selecionados e os resultados dos comandos; manifesto e lock mantiveram
seus hashes. As evidências de navegador e CI continuam identificadas como
execuções anteriores conferidas, sem alegar reexecução nesta rodada.

## Decisão preservada de contraste

O número branco **“1”** em “Como funciona” mantém contraste **2,7059:1** sobre
`sky-500`, insuficiente, por decisão explícita anterior. É dívida visual conhecida;
não foi alterado nesta entrega nem convertido em conforme por `aria-hidden` ou
ausência de violações axe. Difere dos botões públicos cujo texto foi corrigido.
Correção futura exige nova aprovação explícita, medição e regressão visual.
Revisão técnica dos inconclusivos não substitui QA humano integral.

## Publicação e validação publicada — adiadas para a etapa final

Decisão posterior do usuário em 2026-10-07: hospedar na internet e validar o
ambiente publicado somente após as integrações com o backend estarem funcionando
e validadas localmente. Substitui a prioridade anterior de aguardar ambiente para
publicar a demonstração. A ausência de domínio/site continua registrada; os dados
abaixo serão necessários quando essa etapa final for retomada. Não autoriza
iniciar integrações, alterar contratos ou publicar agora. As evidências históricas
desta rodada mantêm a classificação original de ausência de ambiente.

O usuário confirmou nesta rodada: ainda não há domínio e o site não está
publicado. Nenhum endereço publicado ou autorização de infraestrutura foi disponibilizado.
Faltam: ambiente/projeto de demonstração ou homologação; commit a publicar;
domínio principal e os dois subdomínios demonstrativos; configuração/estado de
DNS e certificados TLS; valor de `BARBERHUB_PUBLIC_HOST` no build e runtime;
autorização explícita para publicar e para as alterações de infraestrutura
necessárias. A arquitetura e estratégia de domínios permanecem preservadas.

Antes da validação, vincular URL, commit efetivamente publicado e configuração
sem segredos às evidências. Reutilizar os testes existentes, adaptando somente
o transporte necessário; o executor atual usa loopback/Host lógico e não pode
ser apresentado como teste público. Ao disponibilizar o ambiente, verificar:

- DNS, certificados, HTTPS e redirecionamentos canônicos no domínio e tenants.
- Catálogo, perfis, retorno login/cadastro, contexto de agendamento em ambos os
  subdomínios e recusa de subdomínio desconhecido.
- Manifesto, ícones, registro/escopo do worker, fallback, recuperação e atualização
  do cache; ausência de cache privado, filas ou reenvio. Preservar erros HTTP
  como respostas HTTP, sem classificá-los como falta de conexão.
- Jornadas, teclado, responsividade e axe na URL publicada; desempenho com
  método e configuração comparáveis, sem metas inventadas ou comparação direta
  entre perfis de medição diferentes.

Essas verificações publicadas **não foram executadas**. As páginas continuam
demonstrativas, sem autenticação, reservas ou persistência reais.

## QA humano excluído desta entrega

Continuam pendentes: leitor de tela operado por pessoa e anúncios reais,
revisão humana integral dos inconclusivos/contraste/zoom, Android e iPhone físicos,
Safari real e instalação manual. Chromium/Firefox/WebKit, axe, CDP e Edge
automatizados não encerram esses itens. A tentativa anterior de leitor de tela
e sua restrição de ambiente permanecem no histórico, sem nova tentativa aqui.
