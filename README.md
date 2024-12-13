# Site com Sistema de Agendamento de Salão Essencia (salão da Jo)

## Sistema desenvolvido por:
- **Igor Alves Palmeira**
- **Flavio José dos Santos Joaquim**
- **Luan Alves Lisboa**
- **Bruna Fernanda D’Amaral**
- **Filipe Freitas de Souza**

### SASJ Sistema de Agendamento Salão da Jó

Trata-se de um projeto real da inclusão digital do Salão Essencia (salão da Jo). Esse sistema de agendamento do Salão da Jó é uma aplicação voltada para gerenciar horários, serviços e clientes de forma eficiente. Seu objetivo principal é oferecer uma interface intuitiva para que os clientes possam agendar serviços e para que o salão consiga organizar os atendimentos, otimizando o fluxo de trabalho.

## Estrutura Geral do Projeto
### Estrutura de Arquivos

```plaintext
arenaplay/
├── public/
│   ├── index.html           # Página inicial com listagem de jogos
│   ├── login.html           # Login do sistema
│   ├── criarConta.html      # Cadastro de usuário
│   ├── admin.html           # Página de administração
│   ├── asset/
│   │   ├── css/
│   │   │   └── style.css    # Estilos para a página
│   │   ├── js/
│   │   │   └── script.js    # Scripts principais
│   │   └── img/
└── README.md
```

Funcionalidades Principais
1. Cadastro de Usuários
- Clientes: Nome, telefone, e-mail e histórico de agendamentos.
- Profissionais: Nome, especialização, horários disponíveis.
- Administrador: Acesso total ao sistema para gerenciamento de todos os recursos.
2. Serviços Oferecidos
- Cadastro e edição dos serviços disponíveis, como cortes de cabelo, coloração, manicure, pedicure e tratamentos capilares.
- Especificação de preços e duração de cada serviço.
3. Agendamento
- Para Clientes:
  - Interface amigável para selecionar data, horário, profissional e serviço.
  - Visualização de horários disponíveis em tempo real.
- Para Administradores:
  - Painel de controle para gerenciar agendamentos, alocar profissionais e visualizar a agenda completa do salão.
4. Notificações
- Lembretes automáticos via e-mail, SMS ou WhatsApp para confirmar ou lembrar os clientes do agendamento.
- Notificações de cancelamento ou reagendamento.
5. Relatórios e Análise
- Histórico de atendimentos.
- Relatórios de faturamento e desempenho dos profissionais.
- Gráficos para análise de serviços mais populares.
6. Pagamentos
- Integração com gateways de pagamento para pagamento online no momento do agendamento (opcional).
- Registro de pagamentos realizados no salão.


## Requisitos Funcionais:
Os requisitos funcionais descrevem o que o sistema deve fazer para atender às necessidades dos usuários.

Gerenciamento de Usuários

O sistema deve permitir o cadastro de clientes, profissionais e administradores.
Deve ser possível atualizar ou excluir dados dos usuários.
Gerenciamento de Serviços

O sistema deve permitir o cadastro de serviços com informações como nome, duração, preço e profissionais habilitados.
Deve ser possível alterar ou excluir os serviços cadastrados.
Agendamento de Horários

O cliente deve conseguir visualizar os horários disponíveis para agendamento.
O cliente deve poder selecionar um serviço, um horário e um profissional específico.
O sistema deve bloquear horários já ocupados.
Gerenciamento de Agendamentos

O administrador deve visualizar a agenda completa do salão.
O sistema deve permitir o cancelamento e o reagendamento.
O profissional deve acessar sua agenda individual para conferir atendimentos.
Notificações

O sistema deve enviar lembretes automáticos para os clientes por e-mail ou SMS antes do horário agendado.
O sistema deve notificar os profissionais sobre os atendimentos agendados.
Relatórios e Estatísticas

O administrador deve gerar relatórios sobre:
Atendimentos realizados.
Serviços mais solicitados.
Faturamento por período.
Pagamentos

Deve ser possível registrar pagamentos realizados presencialmente.
O sistema deve permitir pagamentos online por cartão de crédito, débito ou Pix.
Multiplataforma

O sistema deve funcionar tanto em navegadores desktop quanto em dispositivos móveis.


## Requisitos Não Funcionais:

Os requisitos não funcionais definem as características de qualidade e desempenho do sistema.

Desempenho

O sistema deve responder às solicitações em até 2 segundos em condições normais de uso.
Deve suportar até 1.000 usuários simultâneos sem degradação do desempenho.
Escalabilidade

O sistema deve ser escalável para suportar o crescimento do número de usuários e serviços.
Usabilidade

O sistema deve ser intuitivo e fácil de usar, mesmo para usuários sem familiaridade com tecnologia.
A interface deve ser responsiva e adaptável a diferentes tamanhos de tela.
Confiabilidade

O sistema deve garantir que os dados dos agendamentos não sejam perdidos, mesmo em caso de falha do servidor.
Deve apresentar disponibilidade de 99,9% ao longo do ano.
Segurança

Os dados dos usuários devem ser protegidos por criptografia.
O sistema deve implementar autenticação segura (ex.: senha forte e autenticação de dois fatores).
Os dados de pagamento devem seguir as normas PCI DSS.
Compatibilidade

O sistema deve ser compatível com os principais navegadores (Chrome, Firefox, Safari) e sistemas operacionais (Windows, macOS, Android, iOS).
Manutenibilidade

O código do sistema deve ser modular e bem documentado, facilitando atualizações e correções.
Disponibilidade

O sistema deve estar disponível 24/7, com tolerância a falhas e backup diário.
Integração

Deve permitir integração com ferramentas externas, como calendários (Google Calendar) e sistemas de pagamento (PayPal, Stripe).

### Telas do Sistema:
*Link para protótipos e telas do sistema (em branco)*
