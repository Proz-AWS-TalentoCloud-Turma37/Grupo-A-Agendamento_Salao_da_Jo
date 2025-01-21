// Função que é executada quando o documento HTML é carregado
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            await cadastrarUsuario();
        });
    }

    // Adiciona um evento para alternar a visibilidade da senha
    const showPasswordCheckbox = document.getElementById("showPassword");
    if (showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener("change", togglePasswordVisibility);
    }

    // Aplicar máscara no campo celular
    const celular = document.getElementById('celular');
    if (celular) aplicarMascaraTelefone(celular);
});

// Função para alternar visibilidade da senha
function togglePasswordVisibility() {
    const senha = document.getElementById("senha");
    const confirmSenha = document.getElementById("confirmSenha");
    const type = this.checked ? "text" : "password";
    senha.type = type;
    confirmSenha.type = type;
}

// Função para cadastrar um novo usuário
async function cadastrarUsuario() {
    const nome = document.getElementById("nomeusuario").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const confirmSenha = document.getElementById("confirmSenha").value;
    const celular = document.getElementById("celular").value;
    const tipo = document.getElementById("tipo").value.toUpperCase();

    try {
        if (!nome || !email || !senha || !tipo) {
            alert("Todos os campos obrigatórios devem ser preenchidos.");
            return;
        }

        if (senha !== confirmSenha) {
            alert("As senhas não coincidem.");
            return;
        }

        // Envia a requisição para o servidor
        const response = await fetch("http://localhost:3000/api/usuarios/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha, celular, tipo }),
        });

        // Processa a resposta do servidor
        if (response.ok) {
            alert("Conta criada com sucesso!");
            window.location.href = "login.html"; // Redireciona para a página de login
        } else {
            const result = await response.text();
            alert(`Erro ao criar conta: ${result}`);
        }
    } catch (error) {
        alert("Não foi possível criar a conta. Tente novamente mais tarde.");
    }
}

// Função para aplicar máscara de telefone
function aplicarMascaraTelefone(input) {
    input.addEventListener('input', function () {
        let valor = input.value.replace(/\D/g, ''); // Remove tudo que não é número
        if (valor.length > 10) {
            valor = valor.replace(/^\(\d{2}\)\d{5}-\d{4}$/); // Formata o número
        } else {
            valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1)$2-$3');
        }
        input.value = valor.substring(0, 14); // Limita ao tamanho máximo
    });
}

// Função para marcar campos inválidos
function marcarInvalido(campo) {
    campo.classList.add('is-invalid');
}

// Função para limpar marcações de erro
function limparErros(form) {
    const campos = form.querySelectorAll('.is-invalid');
    campos.forEach(campo => campo.classList.remove('is-invalid'));
}
