# Proposta da landing institucional — produto como material visual

> **Registro histórico da proposta 1, rejeitada.** A proposta atual para revisão
> está em [README_V2.md](README_V2.md) e
> [proposal-v2.html](http://127.0.0.1:3127/proposal-v2.html).

**07/10/2026 · fase 1 concluída para revisão · aprovação pendente.**

Esta proposta segue o plano anexado pelo usuário. A instrução de execução é:
“Não implemente a landing antes da aprovação explícita do usuário”. Nenhum
arquivo da aplicação foi alterado nesta fase. O HTML/CSS/JS deste diretório é
um artefato de design independente, sem importações pela aplicação Next.js.
Os SVGs e registros anteriores em `docs/design` continuam históricos/vigentes
para a landing atual; esta proposta ainda não os substitui.

## Revisão visual

- [Abrir a proposta interativa local](http://127.0.0.1:3127/proposal.html).
- [Página completa desktop, 1440px](review/complete-1440.png).
- [Página completa mobile, 390px](review/complete-390.png).
- [Menu aberto, 390px](review/menu-390.png).
- [Preço desktop](review/price-1440.png) e [mobile](review/price-390.png).
- [FAQ desktop](review/faq-1440.png) e [mobile](review/faq-390.png).
- Estados de operação: [equipe desktop](review/operation-team-1440.png),
  [equipe mobile](review/operation-team-390.png),
  [funcionamento desktop](review/operation-settings-1440.png) e
  [funcionamento mobile](review/operation-settings-390.png).

O protótipo contém todas as nove partes pedidas. O aviso “Proposta visual” acima
do header pertence à revisão e será removido da futura landing. Menu, abas de
capturas e FAQ são interativos. As imagens são capturas, não controles operacionais.
Os links externos ao desenho apontam à demonstração local existente na porta
3000; não são uma definição de domínio para produção.

Para reabrir o servidor de revisão, da raiz do repositório:

```powershell
node docs/design/landing-product-first/serve.cjs
```

## Direção e sistema visual

“A rotina da sua barbearia, apresentada pelo próprio produto”. O proprietário
primeiro vê a rotina administrativa, depois conhece a presença pública, a escolha
do cliente e as ferramentas para preparar a operação. O peso visual fica no
título de duas frases e nas telas reais, sem fotografias, imagens geradas,
brilhos, métricas comerciais, depoimentos ou dashboards desenhados.

| Papel | Valor | Aplicação nesta proposta |
| --- | --- | --- |
| Fundo principal | `#07111C` | Header, hero e conteúdo principal |
| Fundo alternado | `#0A1521` | Presença, operação, preço e encerramento |
| Superfície | `#0D1722` | Identificação discreta da captura da agenda |
| Texto principal | `#FFFFFF` | Títulos e hierarquia |
| Corpo | `#B6C2D1` | Explicações, legendas e limites |
| Ação | `#0EA5E9` | CTAs; texto `#07111C`, exclusivamente nesta landing |

Geist é a mesma família disponível no app, copiada do cache local de fontes para
que o desenho seja independente. Desktop: título 76px, seções 52px, corpo 18px;
390px: título 42px, seções 36px, corpo 16px. Peso deliberado de 620–660 nos títulos,
sem palavra avulsa azul. Conteúdo alinhado à esquerda, largura máxima 1160px,
margens de 24px em 390px e 16px em 320px. Botões 52px; menu 44px. Bordas só
delimitam capturas, controles e relações de conteúdo. Não há animações automáticas.

```text
Desktop                           Mobile
marca | navegação | acesso         menu | marca
título em duas frases             título em linhas curtas
explicação        ação             explicação + ação
agenda em largura legível         linha do tempo mobile
perfil: título + finalidade       título + finalidade + perfil
perfil amplo                      recorte mobile autêntico
seleção: texto + tela ampla        escolhas mobile autênticas
operação: abas + tela ampla        abas + recorte mobile
três passos em sequência          três passos empilhados
escopo             preço          escopo + preço
título             FAQ            título + FAQ
encerramento + rodapé              encerramento + rodapé
```

Autocrítica aplicada: abandonei a captura de agendamento em uma coluna estreita,
que deixava o texto pequeno. Agora ela ocupa sua própria largura no desktop.
A agenda abre com filtros e linha do tempo, e não com um bloco de indicadores.
A aba Funcionamento mostra a seção correspondente da tela real, em vez do topo
genérico de Configurações. Até 1100px o desenho utiliza recortes mobile; entre
768–1100px eles ficam em uma coluna central de no máximo 390px, preservando
legibilidade. Não há uma sequência de cards promocionais semelhantes.

## Conteúdo e decisões

| Parte | Conteúdo e finalidade |
| --- | --- |
| Header | Marca; Produto, Como funciona, Preço e Dúvidas; Entrar/Criar conta. Drawer esquerdo no mobile com acessos no rodapé. |
| Hero | Título solicitado: “Sua barbearia apresentada. Sua agenda organizada.” Agenda real, ação principal e limite da demonstração. |
| Presença pública | Apresentação do perfil; serviços, preços, equipe, localização e funcionamento. Exemplo da Esquina marcado como fictício. |
| Agendamento | Seleção de serviço existente, etapa 1/5. Percurso explicado e aviso de que nenhum horário será reservado. |
| Operação | Abas alternam capturas de Serviços, Equipe e Funcionamento. A agenda aparece no hero; acompanhamento é explicado sem promessa de disponibilidade real. |
| Como começar | Configuração → checklist → liberação futura. Regra aprovada de configuração mínima + compra confirmada ou liberação explícita; ensaio não publica. |
| Preço | Um único plano de R$ 40/mês por barbearia. Seis itens previstos para o MVP. Contratação ainda indisponível. |
| Dúvidas | Seis perguntas sobre produto, ensaio, publicação, preço, cadastro e reserva; primeira aberta no desenho. |
| Encerramento/rodapé | Repete Experimentar configuração e oferece catálogo como caminho secundário para clientes. Acessos úteis sem contato inventado. |

“Público”, “Diferenciais” e “Contato” deixam de ser seções independentes. Não há
promessa de uso ilimitado, teste grátis, cancelamento, checkout, assinatura,
publicação, reservas persistidas ou prevenção real de conflitos. As legendas usam
“Tela real do frontend com dados demonstrativos”. A operação administrativa,
o perfil da Esquina e o wizard possuem amostras independentes, explicitadas na
proposta. A agenda do profissional foi omitida: a agenda administrativa já explica
a operação sem introduzir outra identidade fictícia.

## Inventário de origem e destinos

Inventário consultado: composição atual em `(public)/page.tsx` e
`features/public-home`, header/footer e configuração em `features/navigation`,
agenda administrativa, serviços, equipe/configurações, perfil público, wizard,
helpers de domínio/autenticação e onboarding. O contrato continua sem operações
aprovadas para estas jornadas. Não foram necessários endpoints ou backend.

| Ação | Destino existente / geração prevista na fase 2 |
| --- | --- |
| Experimentar configuração | `/onboarding/barbearia`, `onboardingHref()` sem origem pré-selecionada; introdução com os dois exemplos |
| Ver exemplo de barbearia | Raiz de `demo-esquina` via `getPublicBarbershopOrigin` + `publicBarbershopHref`; indisponível se origem não validada |
| Explorar agendamento demonstrativo | `/agendar` no mesmo subdomínio validado, preservando a introdução existente |
| Entrar | Apresentação `/login` pelo helper `clientAuthHref`, sem sessão real |
| Criar conta | Apresentação `/cadastro?perfil=barbearia` pelo helper existente; proprietário pré-selecionado é intenção visual |
| Criar conta de cliente | Apresentação `/cadastro`, padrão cliente; query `perfil=cliente` no desenho apenas explicita a escolha |
| Catálogo demonstrativo | `/barbearias` no domínio principal validado |

Os links locais do artefato não serão copiados como URLs fixas para a aplicação.
Na implementação aprovada, todos os destinos entre domínios deverão usar os
helpers existentes, preservando normalização do Host e retorno canônico.

| Âncora histórica | Destino compatível proposto |
| --- | --- |
| `/#inicio` | Hero |
| `/#produto` | Presença pública |
| `/#servicos` | Operação |
| `/#como-funciona` | Configuração/checklist/liberação |
| `/#preco` | Preço |
| `/#para-quem` | Presença pública, alias sem seção independente |
| `/#diferenciais` | Operação, alias sem seção independente |
| `/#contato` | Rodapé com acessos úteis, sem canais fictícios |
| `/#cta-final` | Encerramento |

`/#duvidas` é o novo destino do FAQ. Não será necessário modificar a navegação
institucional usada em outras rotas; os destinos antigos continuam recebidos.

## Capturas autênticas

Capturadas em Windows/Edge 154.0.4258.62, servidor de desenvolvimento existente
em `localhost:3000`, DPR 1. Desktop **1440 × 1100**, mobile **390 × 1100**.
[Manifesto completo](capture-manifest.json) registra URL, viewport, estado,
dimensões e coordenadas exatas de cada recorte. Nenhuma tela do produto recebeu
controles, dados ou estilos novos. Exclusivamente o indicador de desenvolvimento
`nextjs-portal` foi ocultado na captura; ele não pertence à interface do produto.

| Uso | Rota real | Estado | Recorte desktop / mobile |
| --- | --- | --- | --- |
| Hero | `/admin/agenda` | Data inicial 24/06/2025; todos os filtros; sem alterações | 1168×660 / 358×700 |
| Presença | `demo-esquina.localhost:3000/` | Visitante; fixture Esquina | 1392×860 / 358×840 |
| Agendamento | `demo-esquina.localhost:3000/agendar` | Demonstração iniciada; Serviço 1/5; primeiro serviço marcado; sem avançar | 1024×940 / 358×780 |
| Serviços | `/admin/servicos` | Fixtures iniciais; sem edição | 1168×780 / 358×780 |
| Equipe | `/admin/barbeiros` | Fixtures iniciais; sem edição | 1168×780 / 358×780 |
| Funcionamento | `/admin/configuracoes` | Seção `#horarios`; valores iniciais; sem edição | 912×726 / 358×900 |

Os recortes mobile são de interfaces renderizadas em 390px, não miniaturas das
telas desktop. Recortes deliberados podem omitir partes da página; o perfil mobile
começa na apresentação textual, abaixo da logo de iniciais. As PNGs sem perda
são material de revisão. Na fase 2: gerar variantes WebP/AVIF conforme suporte,
declarar dimensões por breakpoint, carregar a agenda prioritariamente e as
demais capturas sob demanda. Não fazer download de fotos ou usar ImageGen.

## Verificação da proposta e limites

Executado exclusivamente sobre o **artefato de revisão**:

```powershell
node docs/design/landing-product-first/capture.cjs
node docs/design/landing-product-first/render-review.cjs
```

- 12 capturas autênticas, sem erros JavaScript observados nas jornadas capturadas.
- Pranchas completas em 320, 390, 768 e 1440px; nenhuma rolagem horizontal.
- Imagens decodificadas antes das pranchas; fontes locais Geist carregadas.
- Menu aberto em 320/390/768px, abertura por Enter, ciclo de foco, Escape e retorno.
- FAQ aberto por clique; abas por clique e seta direita; âncoras históricas presentes.
- Preço/aviso de contratação conferidos nas quatro larguras; menu, preço, FAQ
  e estados de equipe/funcionamento exportados separadamente.
- Inspeção visual do desktop completo, hero, preço e menu mobile e capturas de origem.

[Resultados do desenho](review/review-checks.json) não certificam a futura
implementação. Não foram executados lint, TypeScript, build, comparação de
performance, axe, zoom nativo 200%, leitores de tela ou regressões da aplicação
nesta fase, pois não houve alteração no frontend. Não há deploy, DNS/TLS público,
autenticação ou backend integrados. As limitações históricas de contraste nas
interfaces capturadas continuam existindo; o novo texto escuro nos CTAs é uma
decisão específica da landing pedida pelo usuário.

## Fase 2 — somente após aprovação explícita

Concentrar composição, conteúdo, estilos próprios, capturas e pequenas interações
em `frontend/src/features/public-home`. Manter a página/conteúdo estático como
Server Components; somente drawer/abas precisam de estado cliente; FAQ pode
usar `details` nativo. Não mudar `globals.css`, fontes globais, providers, PWA,
rotas, helpers de domínio, backend ou banco.

O layout público hoje compõe `PublicHeaderRoute`. A integração mínima precisa
selecionar um header institucional próprio somente no contexto já identificado
como landing, preservando todos os outros ramos. Não editar a aparência de
`MobileDrawer`, `HeaderBrand`, headers operacionais ou sidebar; reutilizar os
comportamentos acessíveis sem trocar seus estilos compartilhados. O rodapé
institucional novo pertence à landing. A navegação compartilhada permanece
inalterada; aliases recebem os links históricos.

Após implementar a proposta aprovada: mouse/teclado/foco, menu, FAQ, abas,
âncoras, 320/390/768/1440px e zoom 200%, contraste, movimento reduzido,
legibilidade, imagens sem deslocamento, desempenho antes/depois, lint,
TypeScript, build e regressões de catálogo, autenticação/domínio e áreas
operacionais. Documentar apenas o QA executado e distinguir esta proposta dos
registros históricos. A aprovação visual não autoriza contratação ou publicação.
