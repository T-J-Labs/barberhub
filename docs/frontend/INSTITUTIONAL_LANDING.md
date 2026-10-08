# Landing institucional — implementação da revisão 2

Atualização de 08/10/2026: por solicitação explícita, o header voltou à composição
compartilhada anterior ao redesign, com Início, Produto, Serviços, Preço e Contato.
Marca, ações e drawer reutilizam a feature `navigation`; Criar conta mantém
`perfil=barbearia` e o atalho para o conteúdo permanece. Conteúdo e capturas da
landing foram preservados. [Implementação e QA deste ajuste](HEADERS_REVIEW.md#restauração-do-header-institucional--2026-10-08).
As descrições do header próprio e seus testes abaixo registram a revisão histórica.

07/10/2026. Implementação autorizada pelo usuário após a proposta visual revista,
com atenção explícita à qualidade das imagens das funcionalidades. Referência:
[frontend-design e direção da revisão](../design/landing-product-first/REVISION_2.md),
[proposta aprovada](../design/landing-product-first/README_V2.md).

## Composição implementada

Hero com “Sua barbearia apresentada. Sua agenda organizada.”, CTA de configuração
e agenda real em destaque. Perfil público amplo com leitura invertida; duas
etapas inteiras do agendamento; operação com seleção de Serviços, Equipe e
Funcionamento; percurso de configuração sem screenshots; preço reunido; FAQ
central e convite final. No celular, as etapas capturadas alternam sem empilhar
duas telas longas. As abas operacionais aceitam setas, Home/End e foco por teclado.

Conteúdo e footer são Server Components. Somente header/menu, seleção de etapa
capturada e abas precisam de JavaScript cliente. FAQ usa `details` nativo.
CSS Modules e tokens locais isolam a identidade. O botão azul com texto `#07111C`
é a exceção expressamente aprovada para a landing; outros botões não mudaram.

## Imagens: nitidez, proporção e enquadramento

- Vinte regiões reais do frontend, capturadas em DPR 1 e novamente em DPR 2.
  DPR 2 não é uma ampliação do arquivo anterior.
- Quarenta WebP **lossless**, aproximadamente 1,04 MB no conjunto de arquivos.
  O navegador baixa somente a variante correspondente a viewport/densidade;
  imagens abaixo do hero usam lazy loading.
- Viewports próprios para mobile/tablet e desktop. Perfil, etapas do wizard,
  listas e seção de sete dias terminam nas bordas dos componentes existentes.
  Não há `object-fit: cover`, altura fixa para imagens ou corte em controles.
- `picture` seleciona a composição; `source` e `img` declaram dimensões para
  reservar proporções antes de carregar. `getImageProps` com `unoptimized`
  preserva os WebP sem recompressão com perda, sem alterar a configuração global.
- Agenda e telas operacionais têm links para originais DPR 2 ampliados. Alt e
  legendas descrevem as capturas como demonstrações, sem sugerir controles vivos.

[Manifesto de produção](../design/landing-product-first/capture-manifest-production.json)
registra rotas, viewport, DPR, estados, recortes, arquivos finais e bytes.
[Gerador de capturas](../../docs/design/landing-product-first/capture-v2.cjs) e
[conversão sem perdas](../../validation/landing-assets.cjs) permitem reproduzir.
Somente o indicador de desenvolvimento foi ocultado; fixtures e estilos das
telas capturadas não foram editados. A agenda é a amostra de junho de 2025.
Hero desktop usa o filtro Corte + barba; mobile usa Barba completa, para manter
atendimentos inteiros no espaço disponível. São estados reais diferentes.

Perfil público, agendamento e administração continuam amostras independentes.
Uma alteração local não sincroniza outras demonstrações.

## Destinos e limites comerciais

Configuração usa `onboardingHref()` sem origem pré-selecionada. O exemplo da
Esquina usa `getPublicBarbershopOrigin`/`publicBarbershopHref`; agendamento está
no mesmo subdomínio. Entrar e Criar conta usam `clientAuthHref`; o cadastro de
proprietário mantém `perfil=barbearia`, e Google continua indisponível.
Catálogo e cadastro de cliente aparecem como caminhos separados no rodapé.
Nenhuma URL local de captura define domínio de produção.

R$ 40/mês por barbearia; seis funcionalidades previstas para o MVP;
**Contratação ainda indisponível**. Configuração e checklist não criam conta,
tenant, compra, permissão ou publicação. A regra futura de liberação e os
contratos pendentes permanecem como registrados no onboarding.

Âncoras existentes `inicio`, `produto`, `servicos`, `como-funciona`, `preco`,
`contato`, `para-quem`, `diferenciais` e `cta-final` continuam presentes. Dúvidas
usa `duvidas`. Público, Diferenciais e Contato não reaparecem como seções próprias.

## Arquivos e isolamento

- `frontend/src/features/public-home/components/InstitutionalLanding.tsx`:
  conteúdo, composição e footer próprios.
- `InstitutionalHeader.tsx`, `BookingDemo.tsx`, `OperationDemo.tsx`: interações.
- `DemoImage.tsx`, `demo-captures.json`, `routing.ts`, `institutional.module.css`:
  apresentação das capturas, dimensões, destinos e estilos locais.
- `frontend/public/landing`: assets finais DPR 1/2.
- `frontend/src/app/(public)/page.tsx`: troca da composição da landing.
- `PublicHeaderRoute.tsx`: troca somente do ramo já identificado como landing.

`MobileDrawer`, `HeaderBrand`, controles compartilhados, fontes globais,
`globals.css`, proxy, layouts/provedores, PWA, API, backend e banco não foram
alterados. O menu institucional usa diálogo nativo com o mesmo comportamento
de foco, fundo inerte, Escape, bloqueio/restauração de scroll e fechamento no
breakpoint desktop; tem composição própria. O CSS fica escopado à feature.

## QA realmente executado

Windows / Edge 154.0.4258.62 headless; desenvolvimento existente na porta 3000
e builds locais de produção isolados. Build usa a CLI Next diretamente para
não executar a geração OpenAPI nem substituir modificações já existentes.
Não houve publicação ou validação de DNS/TLS público.

| Verificação | Resultado |
| --- | --- |
| ESLint / TypeScript / build Next | Passaram |
| Navegador 320/390/768/1024/1440px, dev e produção | Sem overflow; proporções preservadas; capturas visíveis em escala >=78% da largura CSS capturada |
| DPR 2 | Celular escolhe `agenda-390@2x.webp`, sem carregar a agenda desktop |
| Menu / teclado / FAQ / abas / seleção mobile / foco | Passaram; sem erros de página |
| axe WCAG A/AA, 2.0/2.1, nas cinco larguras | Zero violações detectadas na landing em dev e produção |
| Zoom nativo 200% | Passou nas 11 famílias do script de headers, incluindo landing e ajuda do superadmin |
| Headers: geometria, foco, resize, pouca altura, backdrop, touch, navegação e retorno | Suíte completa passou |
| Roteamento e retorno/auth; estado do onboarding; política PWA | Passaram |
| HTTP roteamento, auth, onboarding e agendamento | Passaram em dev e produção local com Host simulado |
| Comparação raster das outras páginas | 14 comparações idênticas: sete famílias em 390/1440px |

A comparação raster usa os dois builds de produção: catálogo, login, cadastro
de proprietário, cliente/agendamentos, barbeiro, admin/agenda e superadmin.
Aguarda a resposta/stream e fontes antes da captura, para incluir o footer.
Não compara apenas o header. A geometria também passou entre 320 e 1440px em
dez larguras por família. A área da marca foi ajustada para manter 44px de altura.
Inspeção visual do hero, perfil, agendamento, operação, preço e menu foi feita
nas imagens efetivamente renderizadas pelo aplicativo.

Expectativas históricas de testes foram atualizadas para o novo título, CTA e
menu institucional. O teste de superadmin passou a verificar especificamente
Planos e assinaturas indisponível: Ajuda já estava implementada antes desta tarefa.
Nenhuma funcionalidade do superadmin foi alterada para satisfazer o teste.

Evidências da aplicação: [hero desktop](../design/landing-product-first/implementation-review/hero-1440.png),
[hero mobile](../design/landing-product-first/implementation-review/hero-390.png),
[página desktop](../design/landing-product-first/implementation-review/complete-1440.png),
[página mobile](../design/landing-product-first/implementation-review/complete-390.png),
[resultados e medições](../design/landing-product-first/implementation-review/qa-results.json).

## Desempenho antes/depois

Três contextos novos por largura, DPR 1, viewport de altura 900px, CPU 4x,
latência 40ms e download 1,5 MiB/s. Mediana em builds de produção locais; recursos
carregados inicialmente, incluindo a antecipação do lazy loading pelo navegador.
Sem Lighthouse ou métricas de usuários reais.

| Métrica | Antes 390px | Depois 390px | Antes 1440px | Depois 1440px |
| --- | ---: | ---: | ---: | ---: |
| LCP mediano | 424 ms | 504 ms | 800 ms | 692 ms |
| CLS | 0 | 0 | 0 | 0 |
| Transferência inicial | 221,1 KiB | 253,1 KiB | 221,1 KiB | 297,7 KiB |
| JavaScript transferido | 156,4 KiB | 157,6 KiB | 156,4 KiB | 157,6 KiB |

As capturas reais aumentam bytes em relação aos SVGs conceituais anteriores.
A prioridade do hero, WebP sem perda, variantes responsivas e lazy loading
mantêm o custo limitado. Os valores locais não certificam desempenho público.

## Reprodução e pendências

`validation/landing-browser.cjs <porta>` verifica a landing;
`landing-comparison.cjs before|after <porta>` compara screenshots e mede;
`landing-report.cjs` preserva evidências compactas. Os scripts usam ferramentas
de QA existentes, sem adicionar dependências ao produto. Os comandos HTTP
usam `TEST_PORT`, `TEST_ENV` e `TEST_PUBLIC_HOST` conforme o agregador existente.
Artefatos temporários completos ficam em `validation/qa-runs` (ignorado).

Leitores de tela reais, Safari/Firefox, dispositivos físicos, DNS/TLS externo e
contraste manual integral das interfaces dentro das capturas não foram
certificados. axe verifica a página e seus textos vivos, não textos rasterizados.
As limitações demonstrativas e a QA externa geral permanecem em vigor.

## Correção do estado ativo no header — 2026-10-08

O log do CI identificou timeout ao esperar “Preço” ativo no menu mobile.
Foi reproduzido localmente navegando para Produto e rolando para Preço no
mesmo frame: Preço permanecia intersectando, sem uma nova entrada do
`IntersectionObserver`, enquanto o clique tinha selecionado Produto.
Uma execução remota passava e outra falhava no mesmo commit; a aprovação
isolada não demonstrava estabilidade dessa transição.

O header passou a resolver a seção atual pela geometria das âncoras, pelo
header sticky e pelo `scroll-margin-top` responsivo. Rolagem, resize e mudanças
de tamanho das seções agendam atualização por `requestAnimationFrame`;
abrir o menu também recalcula a seleção. Listeners e observers são removidos
ao desmontar. Nenhum estilo, domínio ou navegação operacional foi alterado.

A regressão em `validation/headers-browser.cjs` preserva o caso original e
adiciona quatro repetições do salto no mesmo frame, rolagem sem clique,
retorno ao início e larguras 320/390/768/1440px, incluindo altura de 241px.
Não houve aumento de timeout, retry de aprovação ou remoção de assertions.
QA local desta correção: ESLint, TypeScript e build novo pela CLI Next passaram.
A suíte completa de headers passou nas 162 verificações, incluindo as novas
regressões, sem erros JavaScript. Windows/Chromium 145.0.7632.6; desenvolvimento
isolado na porta 3228. Evidência temporária em
`validation/qa-runs/pr22-scroll-complete/results.json` (ignorada pelo Git).
O reproducer com CPU 8x, que falhava antes da correção, também terminou sem
falhas depois. Isso não substitui leitor de tela, dispositivo físico ou QA público.
