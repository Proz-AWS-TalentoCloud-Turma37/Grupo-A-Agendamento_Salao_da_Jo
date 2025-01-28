// Classe responsável por gerenciar o registro e o login
class AuthManager {
    constructor() {
        this.formRegister = document.getElementById("cadastroForm");
        this.formLogin = document.getElementById("loginForm");
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
        const showPasswordCheckboxes = document.querySelectorAll("#showPassword");

        showPasswordCheckboxes.forEach((checkbox) => {
            checkbox.addEventListener("change", (event) => {
                const senhaId = checkbox.closest("#agendamentoModal") ? "senhaLogin" : "senhaCadastro";
                this.togglePasswordVisibility(event, senhaId);
            });
        });

        this.inicializarMascaras();
    }

    // Inicializa máscaras de forma isolada
    inicializarMascaras() {
        const celular = document.getElementById("celular");
        if (celular) {
            this.aplicarMascaraTelefone(celular);
        }

        const cpf = document.getElementById("cpf");
        if (cpf) {
            this.aplicarMascaraCPF(cpf);
        }
    }

    // Alterna visibilidade da senha
    togglePasswordVisibility(event, senhaId) {
        const senha = document.getElementById(senhaId);
        if (senha) {
            senha.type = event.target.checked ? "text" : "password";
        }
    }

    // Validação de campos
    validarCampos(campos) {
        let valido = true;
        campos.forEach(({ campo, mensagem }) => {
            if (!campo || !campo.value.trim()) {
                this.marcarInvalido(campo, mensagem);
                valido = false;
            }
        });
        return valido;
    }

    marcarInvalido(campo, mensagem) {
        campo.classList.add("is-invalid");
        let errorDiv = campo.nextElementSibling;
        if (!errorDiv || !errorDiv.classList.contains("error-message")) {
            errorDiv = document.createElement("div");
            errorDiv.className = "error-message text-danger";
            campo.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = mensagem;
    }

    limparErros(form) {
        const campos = form.querySelectorAll(".is-invalid");
        campos.forEach((campo) => campo.classList.remove("is-invalid"));
        const mensagens = form.querySelectorAll(".error-message");
        mensagens.forEach((msg) => msg.remove());
    }

    // Cadastro de usuário
    async cadastrarUsuario() {
        const nome = document.getElementById("nomeusuario");
        const email = document.getElementById("email");
        const senha = document.getElementById("senhaCadastro");
        const celular = document.getElementById("celular");
        const cpf = document.getElementById("cpf");

        this.limparErros(this.formRegister);

        // Validações
        if (
            !this.validarCampos([
                { campo: nome, mensagem: "Nome é obrigatório" },
                { campo: email, mensagem: "Email é obrigatório" },
                { campo: senha, mensagem: "Senha é obrigatória" },
                { campo: cpf, mensagem: "CPF é obrigatório" },
            ])
        )
            return;

        try {
            const response = await fetch("http://localhost:3000/api/usuarios/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome.value,
                    email: email.value,
                    senha: senha.value,
                    celular: celular.value,
                    cpf: cpf.value,
                    tipo: "CLIENTE",
                }),
            });

            if (response.ok) {
                console.log("Conta criada com sucesso!");

                const sucessoDiv = document.createElement("div");
                sucessoDiv.className = "alert alert-success mt-3";
                sucessoDiv.textContent = "Conta criada com sucesso! Faça login para continuar.";
                this.formRegister.appendChild(sucessoDiv);

                setTimeout(() => {
                    const cadastroModal = bootstrap.Modal.getInstance(document.getElementById("cadastroModal"));
                    if (cadastroModal) cadastroModal.hide();

                    const agendamentoModal = new bootstrap.Modal(document.getElementById("agendamentoModal"));
                    agendamentoModal.show();

                    sucessoDiv.remove();
                }, 2000);
            } else {
                const result = await response.text();

                const erroDiv = document.createElement("div");
                erroDiv.className = "alert alert-danger mt-3";
                erroDiv.textContent = `Erro ao criar conta: ${result}`;
                this.formRegister.appendChild(erroDiv);

                setTimeout(() => erroDiv.remove(), 5000);
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Erro ao conectar com o servidor. Tente novamente mais tarde.");
        }
    }

    // Login do usuário
    async fazerLogin() {
        const email = document.getElementById("username");
        const senha = document.getElementById("senhaLogin");

        this.limparErros(this.formLogin);

        // Validações
        if (
            !this.validarCampos([
                { campo: email, mensagem: "Email é obrigatório" },
                { campo: senha, mensagem: "Senha é obrigatória" },
            ])
        )
            return;

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

                // Armazena o token no localStorage
                localStorage.setItem("token", result.token);

                // Decodifica o token JWT para obter informações do usuário
                const payload = JSON.parse(atob(result.token.split(".")[1]));
                const userType = payload.tipo;

                alert("Login realizado com sucesso!");

                // Redireciona para diferentes áreas com base no tipo de usuário
                if (userType === "CLIENTE") {
                    window.location.href = "dashboard_area_do_usuario.html";
                } else if (userType === "PROFISSIONAL") {
                    window.location.href = "dashboard_area_do_profissional.html";
                } else if (userType === "ADMINISTRADOR") {
                    window.location.href = "admin.html";
                } else {
                    alert("Tipo de usuário inválido. Entre em contato com o suporte.");
                }
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
        input.addEventListener("input", function () {
            let valor = input.value.replace(/\D/g, "");
            if (valor.length > 10) {
                valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
            } else {
                valor = valor.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
            }
            input.value = valor;
        });
    }

    // Aplica máscara ao CPF
    aplicarMascaraCPF(input) {
        input.addEventListener("input", function () {
            let valor = input.value.replace(/\D/g, "");
            if (valor.length > 11) valor = valor.slice(0, 11);
            valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
            input.value = valor;
        });
    }
}

document.addEventListener("DOMContentLoaded", () => new AuthManager());
