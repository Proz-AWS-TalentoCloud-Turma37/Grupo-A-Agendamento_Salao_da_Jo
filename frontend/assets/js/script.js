
console.log('Script carregado com sucesso!');
document.addEventListener('DOMContentLoaded', function () {
    // Seleção dos formulários
    const loginForm = document.getElementById('loginForm');
    const cadastroForm = document.getElementById('cadastroForm');

    // Seleção dos alertas
    const alertLogin = document.getElementById('alertContainer'); // Para login
    const alertCadastro = document.getElementById('alert'); // Para cadastro

    // Função para aplicar máscara de telefone
    function aplicarMascaraTelefone(input) {
        input.addEventListener('input', function () {
            let valor = input.value.replace(/\D/g, ''); // Remove tudo que não é número
            if (valor.length > 10) {
                valor = valor.replace(/^(\d{2})(\d{5})(\d{4})/, '($1)$2-$3');
            } else {
                valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1)$2-$3');
            }
            input.value = valor.substring(0, 14); // Limita ao tamanho máximo
        });
    }

    // Função para aplicar máscara de CPF
    function aplicarMascaraCPF(input) {
        input.addEventListener('input', function () {
            let valor = input.value.replace(/\D/g, ''); // Remove tudo que não é número
            valor = valor.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4');
            input.value = valor.substring(0, 14); // Limita ao tamanho máximo
        });
    }

    // Aplicar máscaras nos campos
    const celular = document.getElementById('celular');
    const whatsapp = document.getElementById('whatsapp');
    const cpf = document.getElementById('cpf');

    if (celular) aplicarMascaraTelefone(celular);
    if (whatsapp) aplicarMascaraTelefone(whatsapp);
    if (cpf) aplicarMascaraCPF(cpf);

    // Função para marcar campos inválidos
    function marcarInvalido(campo) {
        campo.classList.add('is-invalid');
    }

    // Função para limpar marcações de erro
    function limparErros(form) {
        const campos = form.querySelectorAll('.is-invalid');
        campos.forEach(campo => campo.classList.remove('is-invalid'));
    }

    // Validação do Login
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Impede envio automático do formulário
            limparErros(loginForm);

            const username = document.getElementById('username');
            const password = document.getElementById('password');
            let errors = [];

            if (!username.value.trim()) {
                errors.push('O campo Email é obrigatório.');
                marcarInvalido(username);
            }
            if (!password.value.trim()) {
                errors.push('O campo Senha é obrigatório.');
                marcarInvalido(password);
            }

            if (errors.length > 0) {
                alertLogin.classList.remove('d-none');
                alertLogin.classList.add('alert-danger');
                alertLogin.innerHTML = errors.map(err => `<li>${err}</li>`).join('');
            } else {
                alertLogin.classList.add('d-none');
                loginForm.submit(); // Enviar formulário
            }
        });
    }

    // Validação do Cadastro
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Impede envio automático do formulário
            limparErros(cadastroForm);

            const nome = document.getElementById('nome');
            const sobrenome = document.getElementById('sobrenome');
            const endereco = document.getElementById('endereco');
            const estado = document.querySelector('select[name="estado"]');
            const cidade = document.getElementById('cidade');
            const dataNascimento = document.getElementById('dataNascimento');
            const email = document.getElementById('email');
            const senha = document.getElementById('senha');
            const confirmarSenha = document.getElementById('confirmarSenha');
            let errors = [];

            // Validações de cadastro
            if (!nome.value.trim()) {
                errors.push('O campo Nome é obrigatório.');
                marcarInvalido(nome);
            }
            if (!sobrenome.value.trim()) {
                errors.push('O campo Sobrenome é obrigatório.');
                marcarInvalido(sobrenome);
            }
            if (!celular.value.match(/^\(\d{2}\)\d{5}-\d{4}$/)) {
                errors.push('O número de celular deve estar no formato (00)00000-0000.');
                marcarInvalido(celular);
            }
            if (!whatsapp.value.match(/^\(\d{2}\)\d{5}-\d{4}$/)) {
                errors.push('O número de WhatsApp deve estar no formato (00)00000-0000.');
                marcarInvalido(whatsapp);
            }
            if (!endereco.value.trim()) {
                errors.push('O campo Endereço é obrigatório.');
                marcarInvalido(endereco);
            }
            if (!estado.value) {
                errors.push('O campo Estado é obrigatório.');
                marcarInvalido(estado);
            }
            if (!cidade.value.trim()) {
                errors.push('O campo Cidade é obrigatório.');
                marcarInvalido(cidade);
            }
            if (!cpf.value.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
                errors.push('O CPF deve estar no formato 000.000.000-00.');
                marcarInvalido(cpf);
            }
            if (!dataNascimento.value.trim()) {
                errors.push('O campo Data de Nascimento é obrigatório.');
                marcarInvalido(dataNascimento);
            }
            if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                errors.push('O campo Email deve conter um endereço de email válido.');
                marcarInvalido(email);
            }
            if (senha.value.length < 8) {
                errors.push('A senha deve ter no mínimo 8 caracteres.');
                marcarInvalido(senha);
            }
            if (senha.value !== confirmarSenha.value) {
                errors.push('As senhas não coincidem.');
                marcarInvalido(confirmarSenha);
            }

            // Exibir erros ou enviar o formulário
            if (errors.length > 0) {
                alertCadastro.classList.remove('d-none');
                alertCadastro.classList.add('alert-danger');
                alertCadastro.innerHTML = errors.map(err => `<li>${err}</li>`).join('');
            } else {
                alertCadastro.classList.add('d-none');
                cadastroForm.submit(); // Enviar formulário
            }
        });
    }
});


