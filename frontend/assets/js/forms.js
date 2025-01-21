// Classe responsável por gerenciar o registro e o login
class AuthManager {
    constructor() {
        this.formRegister = document.getElementById("register-form");
        this.formLogin = document.getElementById("login-form");
        this.init();
    }

    // Inicializa os eventos necessários
    init() {
        if (this.formRegister) {
            this.formRegister.addEventListener("submit", async (event) => {
                event.preventDefault();
                await this.cadastrarUsuario();
            });
        }

        if (this.formLogin) {
            this.formLogin.addEventListener("submit", async (event) => {
                event.preventDefault();
                await this.fazerLogin();
            });
        }

        // Configurar eventos adicionais
        this.configurarEventosAdicionais();
    }

    // Configura eventos como alternar visibilidade da senha
    configurarEventosAdicionais() {
        const showPasswordCheckbox = document.getElementById("showPassword");
        if (showPasswordCheckbox) {
            showPasswordCheckbox.addEventListener("change", (event) => this.togglePasswordVisibility(event));
        }

        const celular = document.getElementById('celular');
        if (celular) this.aplicarMascaraTelefone(celular);
    }

    // Alterna visibilidade da senha
    togglePasswordVisibility(event) {
        const senha = document.getElementById("senha");
        const confirmSenha = document.getElementById("confirmSenha");
        const type = event.target.checked ? "text" : "password";
        if (senha) senha.type = type;
        if (confirmSenha) confirmSenha.type = type;
    }

    // Validação de campos
    validarCampos(campos) {
        let valido = true;
        campos.forEach(({ campo, mensagem }) => {
            if (!campo.value.trim()) {
                this.marcarInvalido(campo, mensagem);
                valido = false;
            }
        });
        return valido;
    }

    marcarInvalido(campo, mensagem) {
        campo.classList.add('is-invalid');
        let errorDiv = campo.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains('error-message')) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message text-danger';
            campo.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = mensagem;
    }

    limparErros(form) {
        const campos = form.querySelectorAll('.is-invalid');
        campos.forEach(campo => campo.classList.remove('is-invalid'));
        const mensagens = form.querySelectorAll('.error-message');
        mensagens.forEach(msg => msg.remove());
    }

    // Cadastro de usuário
    async cadastrarUsuario() {
        const nome = document.getElementById("nomeusuario");
        const email = document.getElementById("email");
        const senha = document.getElementById("senha");
        const confirmSenha = document.getElementById("confirmSenha");
        const celular = document.getElementById("celular");
        const tipo = document.getElementById("tipo");

        this.limparErros(this.formRegister);

        // Validações
        if (!this.validarCampos([
            { campo: nome, mensagem: "Nome é obrigatório" },
            { campo: email, mensagem: "Email é obrigatório" },
            { campo: senha, mensagem: "Senha é obrigatória" },
            { campo: tipo, mensagem: "Tipo de usuário é obrigatório" }
        ])) return;

        if (senha.value !== confirmSenha.value) {
            this.marcarInvalido(confirmSenha, "As senhas não coincidem");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/usuarios/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome.value,
                    email: email.value,
                    senha: senha.value,
                    celular: celular.value,
                    tipo: tipo.value.toUpperCase(),
                }),
            });

            if (response.ok) {
                alert("Conta criada com sucesso!");
                window.location.href = "login.html";
            } else {
                const result = await response.text();
                alert(`Erro ao criar conta: ${result}`);
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
        }
    }

    // Login do usuário
    async fazerLogin() {
        const email = document.getElementById("email");
        const senha = document.getElementById("senha");

        this.limparErros(this.formLogin);

        // Validações
        if (!this.validarCampos([
            { campo: email, mensagem: "Email é obrigatório" },
            { campo: senha, mensagem: "Senha é obrigatória" }
        ])) return;

        try {
            const response = await fetch("http://localhost:3000/api/usuarios/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email.value,
                    senha: senha.value,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                alert("Login realizado com sucesso!");
                localStorage.setItem("token", result.token);
                window.location.href = "index.html";
            } else {
                const result = await response.text();
                alert(`Erro ao fazer login: ${result}`);
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
        }
    }

    // Aplica máscara ao telefone
    aplicarMascaraTelefone(input) {
        input.addEventListener('input', function () {
            let valor = input.value.replace(/\D/g, '');
            if (valor.length > 10) {
                valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else {
                valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
            }
            input.value = valor;
        });
    }
}

// Inicializa o AuthManager quando o documento estiver carregado
document.addEventListener("DOMContentLoaded", () => new AuthManager());
