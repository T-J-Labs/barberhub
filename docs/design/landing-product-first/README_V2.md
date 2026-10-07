# Landing institucional — proposta revista

**07/10/2026 · revisão 2 aprovada e implementada.** Após esta revisão, o usuário
solicitou explicitamente a implementação no site, com atenção à qualidade das
imagens. A proposta anterior foi rejeitada por enquadramento, ausência de um
hero marcante e repetição das seções. Esta revisão é a referência visual vigente.
[Implementação, qualidade das imagens, QA e limites](../../frontend/INSTITUTIONAL_LANDING.md).

## Para revisar

- [Proposta interativa v2](http://127.0.0.1:3127/proposal-v2.html).
- [Hero desktop](review-v2/hero-1440.png) e [mobile](review-v2/hero-390.png).
- [Desktop completo](review-v2/complete-1440.png) e [mobile completo](review-v2/complete-390.png).
- [Perfil público](review-v2/presence-section-1440.png).
- [Agendamento](review-v2/booking-section-1440.png).
- [Operação](review-v2/operation-section-1440.png).
- [Menu mobile](review-v2/menu-390.png), [preço](review-v2/price-390.png) e
  [FAQ](review-v2/faq-390.png).

O protótipo é HTML/CSS/JS estático e independente, em `proposal-v2.*`. O selo de
revisão é somente para avaliação. Menu, seleção de tela operacional e FAQ são
interativos. No mobile, Serviço/Profissional alternam as duas capturas da jornada.
Os links “Ampliar” abrem os arquivos de captura originais. Nenhum controle
desenhado representa uma operação real.

## O que mudou

| Problema observado | Tratamento da revisão |
| --- | --- |
| Hero diluído em título + imagem longa | Texto, ação e agenda aparecem juntos, em uma composição lateral de entrada. As duas frases ganham hierarquia própria. |
| Cortes no meio de linhas e controles | Capturas delimitadas pelos componentes existentes: perfil inteiro, etapas inteiras, listas inteiras e seção de funcionamento inteira. Sem alturas fixas arbitrárias. |
| Telas pequenas ou ampliadas demais | Viewports de captura escolhidos para a escala de apresentação; retratos próprios para mobile/tablet; originais acessíveis para ampliação. |
| Seções semelhantes | Perfil horizontal com leitura invertida; duas etapas em retrato; operação com seletor lateral; percurso vertical sem screenshots; preço reunido; FAQ central. |

O plano e sua autocrítica foram registrados **antes** da composição em
[REVISION_2.md](REVISION_2.md), seguindo a skill `frontend-design`.
Marca, Geist e as seis cores solicitadas foram preservadas. Azul não destaca
palavras avulsas nos títulos. O texto escuro nos botões é exclusivo desta proposta
de landing, conforme o pedido; nenhum estilo compartilhado foi modificado.

## Capturas e estados

[Manifesto da revisão](capture-manifest-v2.json) registra URL, viewport, estado,
dimensões, coordenadas, navegador e erros observados. Foram produzidas 20 capturas
em Windows/Edge 154.0.4258.62, DPR 1, no servidor existente da aplicação em
`localhost:3000`. A altura do viewport é 1100px em todas; a largura está abaixo.

| Uso | Rota | Viewport | Conteúdo do recorte |
| --- | --- | --- | --- |
| Hero desktop | `/admin/agenda` | 720px | Layout adaptativo real; filtro Serviço = Corte + barba, demais filtros iniciais; dois atendimentos completos. |
| Hero mobile | `/admin/agenda` | 390 e 320px | Filtro Serviço = Barba completa; um atendimento completo; linha do tempo, sem filtros no recorte. |
| Agenda ampliada | `/admin/agenda` | 1440px | Todos os filtros iniciais; cinco atendimentos, com filtros e lista completos. |
| Perfil público | `demo-esquina.localhost:3000/` | 1060, 390 e 320px | Componente de apresentação inteiro, incluindo logo de iniciais, nome, descrição, ações e aviso existente. |
| Serviço | `demo-esquina.localhost:3000/agendar` | 390 e 358px | Etapa 1; Corte de cabelo selecionado; escolhas e botões completos; sem avançar/concluir. |
| Profissional | Mesma rota de agendamento | 390 e 358px | Etapa 2 após Corte de cabelo; nenhum profissional marcado; opções e botões completos. |
| Operação/serviços | `/admin/servicos` | 1024, 390 e 320px | Lista inteira dos quatro serviços fictícios, com título e todas as ações. |
| Operação/equipe | `/admin/barbeiros` | 1024, 390 e 320px | Lista inteira dos profissionais fictícios, com dias, intervalos e ações. |
| Funcionamento | `/admin/configuracoes` | 1024, 390 e 320px | Seção `#horarios` completa, sete dias e orientação final. |

As escolhas/filtros usam controles existentes e fixtures. Não foram alterados
dados ou estilos do produto para formar a imagem. Somente o indicador de
desenvolvimento `nextjs-portal` foi ocultado nas capturas. A agenda está na amostra
de junho de 2025; ela não representa uma agenda atual ou disponibilidade real.
As legendas permanecem “Tela real do frontend com dados demonstrativos”.

O perfil da Esquina, as amostras administrativas e o wizard continuam independentes.
A etapa de Profissional pertence ao mesmo exemplo/serviço que a captura de Serviço;
isso demonstra a navegação existente, sem criar uma sincronização com a área admin.

## Conteúdo e destinos preservados

Nove partes: header, hero, presença pública, agendamento, operação, configuração,
preço, FAQ e encerramento/rodapé. Sem fotos, imagens geradas, métricas comerciais,
depoimentos ou contatos inventados. Não há contratação, checkout ou publicação.

- Experimentar configuração: `/onboarding/barbearia`, sem origem pré-selecionada.
- Ver exemplo: raiz pública da Esquina; agendamento: `/agendar` no mesmo subdomínio.
- Entrar: apresentação `/login`; Criar conta: `/cadastro?perfil=barbearia`.
- Catálogo secundário: `/barbearias`; cadastro do cliente permanece separado.
- R$ 40/mês por barbearia, seis funcionalidades previstas para o MVP e
  **Contratação ainda indisponível**, sem novos termos comerciais.
- Checklist completo não publica. A regra futura continua configuração mínima
  e compra confirmada ou liberação explícita do superadmin.

URLs do artefato apontam ao app local para revisão. Na implementação futura,
usar `onboardingHref`, `clientAuthHref`, `getPublicBarbershopOrigin` e
`publicBarbershopHref`; nenhuma URL fixa deste protótipo define domínio de produção.
As âncoras `inicio`, `produto`, `servicos`, `como-funciona`, `preco`, `contato`,
`para-quem`, `diferenciais` e `cta-final` continuam compatíveis. Público,
Diferenciais e Contato não reaparecem como seções independentes.

## Verificações executadas

```powershell
node docs/design/landing-product-first/capture-v2.cjs
node docs/design/landing-product-first/render-review-v2.cjs
```

QA exclusivo do desenho em 320, 390, 768, 1024 e 1440px: imagens decodificadas,
sem rolagem horizontal, aviso de contratação, FAQ, abertura por Enter, ciclo de
foco do menu, Escape/retorno, alternância das telas operacionais por clique e
seta, presença das âncoras e troca de Serviço/Profissional no mobile.
O script também rejeita capturas visíveis reduzidas abaixo de 78% da largura
original; é uma proteção de escala, não uma certificação de legibilidade.
Inspeção visual por seção e do conjunto, com imagens preservadas em `review-v2`.
[Resultados](review-v2/review-checks.json).

Não executados nesta fase: lint/TypeScript/build da aplicação, performance,
zoom nativo 200%, axe, leitores de tela ou regressões das demais rotas.
Não houve alteração na aplicação nem integração. Capturas preservam limitações
de contraste e conteúdo demonstrativo da interface existente.

## Implementação autorizada e realizada

A landing foi composta em `features/public-home`, com conteúdo no servidor e
pequenas interações cliente. O header próprio foi ligado somente ao contexto
institucional. `MobileDrawer`, `HeaderBrand`, headers operacionais, sidebar,
fontes globais, `globals.css`, domínio, providers, PWA e backend foram preservados.
As imagens da aplicação têm novos originais DPR 2 e versões WebP sem perda em
DPR 1/2, sem ampliação artificial. O registro anterior de QA acima pertence
somente ao protótipo; o QA da aplicação está no documento de implementação.
