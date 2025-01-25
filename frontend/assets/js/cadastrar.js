document.addEventListener('DOMContentLoaded', function () {
    const cadastroForm = document.getElementById('cadastroForm');
    const API_URL = "http://localhost:3000"; // Substitua pela URL correta do seu servidor

    // Função para exibir alertas
    function exibirAlerta(container, mensagem, tipo = 'danger') {
        container.classList.remove('d-none', 'alert-danger', 'alert-success');
        container.classList.add(`alert-${tipo}`);
        container.innerHTML = `<li>${mensagem}</li>`;
    }

    // Função para limpar alertas
    function limparAlerta(container) {
        container.classList.add('d-none');
        container.innerHTML = '';
    }

    // Função para mostrar ou ocultar a senha
    const mostrarSenhaCheckbox = document.getElementById('showPassword');
    if (mostrarSenhaCheckbox) {
        mostrarSenhaCheckbox.addEventListener('change', function () {
            const senhaInput = document.getElementById('senha');
            senhaInput.type = this.checked ? 'text' : 'password';
        });
    }

    // Requisição para cadastrar usuário
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            // Limpar alertas anteriores
            const alertCadastro = document.getElementById('alertCadastro');
            limparAlerta(alertCadastro);

            // Captura os dados do formulário
            const nome = document.getElementById('nomeusuario').value.trim();
            const email = document.getElementById('email').value.trim();
            const senha = document.getElementById('senha').value.trim();
            const celular = document.getElementById('celular').value.trim();
            const cpf = document.getElementById('cpf').value.trim();
            const tipo = 'CLIENTE'; // Tipo fixo para simplificação

            // Validação básica antes de enviar ao servidor
            if (!nome || !email || !senha || !celular || !cpf) {
                exibirAlerta(alertCadastro, 'Todos os campos são obrigatórios.', 'danger');
                return;
            }

            // Validação de formato do CPF (000.000.000-00)
            const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
            if (!cpfRegex.test(cpf)) {
                exibirAlerta(alertCadastro, 'O CPF deve estar no formato 000.000.000-00.', 'danger');
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/usuarios`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nome,
                        email,
                        senha,
                        celular,
                        cpf,
                        tipo,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erro ao cadastrar usuário');
                }

                exibirAlerta(alertCadastro, 'Usuário cadastrado com sucesso!', 'success');
                cadastroForm.reset(); // Limpa o formulário após sucesso
            } catch (error) {
                exibirAlerta(alertCadastro, error.message, 'danger');
            }
        });
    }
});
