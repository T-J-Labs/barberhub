# Revisão 2 — direção antes da composição

Proposta anterior rejeitada em 07/10/2026: hero sem presença, capturas mal
enquadradas e seções repetitivas. Esta revisão continua sendo somente design.

## Plano visual conforme frontend-design

Paleta preservada: base `#07111C`, alternado `#0A1521`, superfície `#0D1722`,
branco `#FFFFFF`, corpo `#B6C2D1`, ação `#0EA5E9` com texto escuro. Geist em
todas as funções. Título do hero 64–72px, seções 42–50px, corpo 17–18px.

O hero deve ser uma composição de entrada, com mensagem, ação e agenda visíveis
juntas. Capturas terminam nas bordas reais dos componentes e nunca no meio de
um atendimento, escolha, botão ou linha. A escala de exibição será próxima da
escala capturada. Molduras pertencem à apresentação, sem controles inventados.

```text
hero:        texto + CTA  |  agenda enquadrada inteira
presença:    perfil grande à esquerda  |  explicação à direita
agendamento: texto  |  serviço  |  profissional (etapas reais completas)
operação:    seletor vertical  |  tela completa correspondente
começar:     título  |  percurso vertical de três passos
preço:       bloco central com preço + escopo + indisponibilidade
FAQ:         coluna central, sem composição lateral repetida
fim:         convite curto + ação  /  rodapé com acessos
```

No mobile, as telas continuam completas e em escala própria. As duas etapas do
agendamento são alternadas por um seletor, sem enfileirar capturas gigantes.
Cada seção tem função e silhueta própria, em vez de variar apenas seu fundo.

## Revisão do plano contra o briefing

A primeira ideia de reduzir uma tabela desktop no lado direito do hero foi
descartada: prejudicaria a leitura novamente. A agenda do hero será capturada
no layout adaptativo real, com filtro existente que produz duas entradas
completas; filtros/estado serão documentados. No mobile, uma única entrada
completa evita o corte de uma terceira. A tela desktop completa fica disponível
para inspeção ampliada. Filtros não inventam dados ou funcionalidades.

O perfil não será uma faixa parcialmente cortada: será o componente completo de
apresentação, em um viewport que mantém sua composição desktop. As escolhas do
agendamento serão componentes completos, com seus botões existentes. A operação
terá lista/tabela inteira e enquadramento próprio por tela, sem esticar o mesmo
retângulo para todos os conteúdos.

Não implementar frontend, backend, domínio, contratação ou publicação. Aguardar
aprovação explícita da proposta revista.
