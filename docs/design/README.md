# Mockups da landing page pública

Este diretório contém a proposta visual da landing page institucional do
BarberHub. Os arquivos são SVGs vetoriais, editáveis e preparados para
importação no Penpot.

O material é um artefato de design. Ele não implementa componentes do frontend,
integrações com API nem funcionalidades de produção.

## Arquivos

- `barberhub-landing-desktop.svg`: página completa para viewport de 1440 px,
  com conteúdo limitado visualmente a aproximadamente 1280 px.
- `barberhub-landing-mobile.svg`: página completa mobile-first para viewport de
  390 px e margens laterais de 24 px.
- `barberhub-header-mobile-menu-open.svg`: estado aberto do menu em viewport de
  390 × 844 px. O drawer ocupa 332 px, equivalente a aproximadamente 85% da
  largura, abaixo do limite de 384 px.

## Estrutura e âncoras

Os dois mockups da página utilizam grupos principais com os mesmos IDs:

1. `inicio`: proposta de valor, CTA **Registrar**, ação **Como funciona** e
   exemplo demonstrativo do painel.
2. `produto`: visão da plataforma como um todo e composição conceitual da
   administração da barbearia.
3. `servicos`: funcionalidades planejadas para o MVP.
4. `como-funciona`: configuração da barbearia e fluxo conceitual do cliente.
5. `diferenciais`: benefícios concretos para a operação.
6. `planos`: apresentação sem preços ou condições comerciais inventadas.
7. `contato`: canais conceituais, sem formulário funcional ou dados fictícios.
8. `cta-final`: chamada consistente para **Registrar**.
9. `footer`: navegação, autenticação e copyright.

O grupo adicional `para-quem` apresenta os públicos atendidos sem usar
depoimentos, avaliações, números ou logotipos fictícios.

## Header

O código existente é a fonte de verdade:

- marca tipográfica **BARBERHUB**, com **BARBER** branco e **HUB** em
  `#0EA5E9`;
- navegação, nesta ordem: **Início**, **Produto**, **Serviços**, **Planos** e
  **Contato**;
- ações **Entrar** e **Registrar** com aparência azul no desktop;
- no mobile fechado, somente botão de menu e marca;
- no mobile aberto, backdrop, botão de fechar, navegação completa e ações no
  rodapé do drawer.

O header desktop segue o limite visual do componente `Container`: largura
máxima aproximada de 1280 px. Os controles mobile possuem áreas de pelo menos
44 × 44 px.

## Conteúdo e estado do produto

- O BarberHub ainda está em desenvolvimento.
- Os serviços são identificados como funcionalidades planejadas para o MVP.
- Números no painel são marcados como demonstrativos.
- Os detalhes comerciais dos planos permanecem em definição.
- E-mail e WhatsApp são canais conceituais, sem endereços ou números inventados.
- Nenhum formulário é apresentado como funcional.
- O fluxo do cliente é apenas conceitual:
  **Serviço → profissional → data → horário → autenticação → confirmação**.

## Identidade visual

### Paleta oficial da interface pública

As cores abaixo são a fonte de verdade para a landing page pública e seus
componentes compartilhados. Novas seções devem reutilizar seus papéis, em vez
de introduzir variações próximas de azul, cinza ou texto.

| Papel | Valor | Uso |
| --- | --- | --- |
| Fundo principal | `#07111C` | Hero, Produto, header, drawer e seções principais. |
| Fundo alternado | `#0A1521` | Seções alternadas, como Para quem é e Serviços. |
| Superfície padrão | `#0D1722` | Cards e painéis sobre os fundos da página. |
| Superfície elevada | `#172535` | Áreas internas de painéis e controles de interface. |
| Superfície de painel | `#111D2A` | Regiões internas dos mockups de produto. |
| Borda padrão | `#334155` | Contornos de cards, painéis e separadores. |
| Borda sutil | `#26384A` | Contornos de menor contraste em mockups e superfícies. |
| Azul de ação e marca | `#0EA5E9` (`sky-500`) | Botões primários, marca e elementos interativos. |
| Azul de destaque | `#38BDF8` (`sky-400`) | Ícones, bullets, labels de seção e destaques em títulos. |
| Azul de badge | `#7DD3FC` (`sky-300`) | Texto de badges sobre fundo azul translúcido. |
| Texto principal | `#FFFFFF` | Títulos, navegação e conteúdo principal dos cards. |
| Texto de corpo | `#B6C2D1` | Parágrafos explicativos principais. |
| Texto secundário | `#94A3B8` (`slate-400`) | Descrições auxiliares em cards e metadados. |
| Texto de apoio | `#CBD5E1` (`slate-300`) | Listas e conteúdos de menor hierarquia. |
| Texto de ação secundária | `#E2E8F0` (`slate-200`) | Ações secundárias com borda. |

### Regras de aplicação

- Alternar fundos principais e alternados na sequência das seções para manter
  separação visual sem interromper a identidade escura.
- Usar `#0D1722` como superfície padrão de cards públicos; não criar novos
  tons de azul-marinho para essa finalidade.
- Usar `#0EA5E9` apenas para ações, marca e foco de interação. O
  `#38BDF8` é reservado a elementos de destaque e apoio visual.
- Manter títulos em branco, parágrafos principais em `#B6C2D1` e descrições
  auxiliares em `#94A3B8`.

Os SVGs utilizam formas, linhas e textos simples. Não há imagens externas,
assets por URL, conteúdo base64, filtros, máscaras ou fontes proprietárias.
Geist é indicada como primeira opção por corresponder ao frontend; Inter e Arial
são fallbacks.

## Como importar no Penpot

1. Crie ou abra um arquivo de design no Penpot.
2. Arraste os três arquivos SVG para a área de trabalho.
3. Mantenha os grupos principais até definir os frames e componentes do arquivo.
4. Desagrupe apenas a seção que estiver editando.
5. Caso Geist não esteja disponível, utilize Inter.

## Observações de implementação futura

- Os CTAs **Registrar** representam conceitualmente a rota `/register`.
- **Como funciona** representa a âncora `#como-funciona`.
- Os links do header correspondem a `#inicio`, `#produto`, `#servicos`,
  `#planos` e `#contato`.
- Antes da implementação, o conteúdo deve ser convertido em componentes
  mobile-first dentro de `src/features`, preservando Server Components quando
  não houver necessidade de interatividade.
- Integrações somente poderão ser desenhadas após aprovação no contrato
  OpenAPI.
