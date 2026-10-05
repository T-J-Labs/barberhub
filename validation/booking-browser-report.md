# Agendamento — QA no projeto aberto no VS Code

Data: 2026-10-05. Projeto: `C:/Users/Felipe Tajima/projetosportfolio/barberhub`.
Servidor existente de desenvolvimento na porta 3000. Navegador integrado.

- Esquina: perfil → CTA → introdução → serviço → Rafael → 12/10 → 09:00 → revisão.
- Cenário conflito: voltou ao horário, removeu 09:00, preservou antecedentes e deixou
  todas as opções desmarcadas. Aviso com role alert e aria-describedby nos radios;
  foco no título. Continuar sem escolha mostrou erro e manteve a etapa.
- Escolher 10:30 permitiu concluir com aviso explícito de nenhuma reserva.
- Navalha: entrada direta com identidade e retorno próprios; três serviços completos.
  Barba na navalha apresentou somente Lucas; 12/10 mostrou 10:00, 13:30 e 16:30.
  Escolher 10:00, revisar e concluir apresentou resultado explícito sem reserva.
- Cards da Esquina em 320px: preços com coluna de 80px e coordenada x igual a 143,2px
  nos três serviços; descrições na linha inteira. Sem rolagem horizontal.
- Capturas: `booking-service-320.png`, `booking-conflict.png`.
- Resultado da Navalha verificado em 320, 390, 768 e 1440px sem rolagem horizontal;
  `booking-responsive-results.json` e `booking-navalha-result.png` registram a inspeção.

Testes automatizados cobrem invalidação de dependências, validação da revisão,
fixtures isoladas, ausência de dados e navegação/contexto. A validação semântica
de alertas e foco não representa teste com leitor de tela real. DNS, TLS e OAuth
não são exercitados pelos testes HTTP locais. Nenhum backend ou reserva real.
