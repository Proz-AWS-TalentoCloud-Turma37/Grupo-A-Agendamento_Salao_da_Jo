document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("register-form");

    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();
            await cadastrarUsuario();
        });
    }

    const showPasswordCheckbox = document.getElementById("showPassword");
    if (showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener("change", togglePasswordVisibility);
    }
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
