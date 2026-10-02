# Plano da experiência do cliente

Direção aprovada em 2026-10-01, conforme o ADR 08 em
[ADR.md](../architecture/ADR.md). Este documento organiza o trabalho do frontend;
os contratos de API e a modelagem física de IAM ainda dependem de acordo com o
backend.

## Objetivo

Permitir que uma pessoa encontre uma barbearia, utilize sua conta única, reserve
um horário e acompanhe seus próprios agendamentos em diferentes estabelecimentos.
Cada barbearia continua acessando somente seus dados operacionais, perfis locais
e reputação dos clientes.

## Sequência de entregas

| Ordem | Funcionalidade | Escopo inicial | Critério de conclusão da interface |
| --- | --- | --- | --- |
| 1 | Catálogo público | Busca por nome, cidade ou bairro; cards com nome, logo e localização; acesso à página do estabelecimento. | Funciona no celular, permite limpar filtros e representa carregamento, erro, ausência de estabelecimentos e busca sem resultados. |
| 2 | Página da barbearia | Dados públicos, serviços ativos com preço e duração, profissionais, endereço, funcionamento e ação Agendar. | O cliente identifica a barbearia e inicia o agendamento. A página também admite entrada direta pelo subdomínio e trata estabelecimento indisponível. |
| 3 | Conta do cliente | Login, cadastro global, saída e retorno à barbearia escolhida após autenticação. | A mesma identidade pode iniciar reservas em duas barbearias; validação, erros e sessão expirada têm estados definidos. |
| 4 | Agendamento | Serviço, profissional, data, horário disponível, revisão e confirmação. | Ao trocar serviço, profissional ou data, escolhas dependentes são invalidadas. Trata falta de horários, conflito na confirmação e falha de envio. |
| 5 | Meus agendamentos | Próximas reservas, detalhes, histórico, cancelamento e reagendamento. | Cada reserva identifica a barbearia. O cliente acompanha apenas suas reservas e recebe feedback das alterações, conforme regras acordadas. |
| 6 | Agenda do barbeiro | Agenda própria, conclusão, falta e bloqueios. | O profissional opera apenas sua agenda no tenant autorizado. |

O primeiro trabalho é o catálogo público. A landing comercial do BarberHub
continua apresentando o produto para proprietários; catálogo e página da
barbearia atendem à descoberta e à reserva pelo cliente. O cadastro de cliente
deve ser distinguido do cadastro de um proprietário/estabelecimento.

## Organização sugerida

Criar as features conforme cada entrega avançar, dentro de `frontend/src/features`:

- `barbershop-catalog`: busca, filtros e apresentação dos estabelecimentos.
- `public-barbershop`: informações públicas de uma barbearia.
- `auth`: acesso à conta e retorno ao fluxo iniciado.
- `booking`: seleção e confirmação da reserva.
- `client-appointments`: acompanhamento das reservas pessoais.

Usar Server Components por padrão e Client Components nos controles e etapas
interativas. Reutilizar componentes de navegação e apresentação existentes,
mantendo permissões e ações específicas de cada papel. As URLs das novas páginas
e a resolução entre domínio da plataforma e subdomínios serão detalhadas na
respectiva entrega; este plano não define endpoints REST.

## Desenvolvimento demonstrativo e integração

Enquanto o OpenAPI tiver `paths: {}`, desenvolver somente a experiência
demonstrativa, com fixtures e modelos de apresentação explicitamente locais.
Eles não representam DTOs aprovados nem garantem persistência, autenticação real
ou isolamento de dados. Não inventar rotas HTTP para sustentar os protótipos.

Antes de integrar cada entrega, acordar os comportamentos e schemas com o backend,
registrá-los no OpenAPI, gerar o cliente com Orval e desenvolver contra MSW.
Disponibilidade, prevenção de concorrência, autorização e titularidade são
responsabilidades do backend. Uma confirmação real só aparece após sucesso da
API; a demonstração deve deixar claro seu caráter local.

## Decisões necessárias para a integração

- Dados públicos e critérios de publicação, suspensão e retirada do catálogo;
  formato da busca e paginação.
- Modelagem da identidade global do cliente e do perfil por barbearia, incluindo
  quando esse perfil é criado e quais dados o estabelecimento pode consultar.
- Contratos de login, cadastro, sessão e armazenamento do JWT. Preservar o destino
  após login usando somente destinos internos validados.
- Resolução e validação do contexto da barbearia nas operações do cliente,
  consulta de reservas próprias entre tenants e limites de acesso da equipe.
- Regras de disponibilidade, datas e fuso horário, cancelamento, reagendamento,
  conflitos e tratamento de envios repetidos.

## Validação da entrega integrada

O cliente deve conseguir reservar em duas barbearias com a mesma conta e ver
ambas em sua área pessoal. Outro cliente não pode consultar ou alterar essas
reservas. O admin de uma barbearia não pode acessar histórico ou reputação da
outra. Dois clientes disputando o mesmo horário devem receber o resultado
validado pelo backend, sem confirmação duplicada.

## Etapas posteriores

Geolocalização, avaliações, rankings e favoritos ficam para depois da jornada
inicial. Pagamentos e fidelidade seguem o roadmap pós-MVP do ADR.
