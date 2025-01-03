console.log('Script carregado com sucesso!');
// Alterna a visibilidade da senha
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const icon = document.getElementById(`${fieldId}-icon`);
    if (field.type === 'password') {
        field.type = 'text';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
        field.type = 'password';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
    }
}

// Validação do formulário de troca de senha
document.getElementById('btnSalvarAlteracoes').addEventListener('click', function (event) {
    event.preventDefault(); // Previne o comportamento padrão de envio do formulário
    const senha_atual = document.getElementById('senha_atual').value.trim();
    const novaSenha = document.getElementById('nova_senha').value.trim();
    const confirmarSenha = document.getElementById('confirmar_senha').value.trim();
    const alertaErro = document.getElementById('alertaErro');

    alertaErro.classList.add('d-none'); // Esconde o alerta inicialmente

    if (!senha_atual || !novaSenha || !confirmarSenha) {
        alertaErro.textContent = 'Preencha todos os campos.';
        alertaErro.classList.remove('d-none');
        return;
    }
    if (novaSenha.length < 8) {
        alertaErro.textContent = 'A nova senha deve ter pelo menos 8 caracteres.';
        alertaErro.classList.remove('d-none');
        return;
    }
    if (novaSenha !== confirmarSenha) {
        alertaErro.textContent = 'As senhas não coincidem.';
        alertaErro.classList.remove('d-none');
        return;
    }
    // Se tudo estiver válido, submete o formulário
    document.getElementById('formTrocarSenha').submit();
});

 
// Remover parâmetros da URL após carregar a página
document.addEventListener('DOMContentLoaded', function () {
    const url = new URL(window.location.href);
    if (url.searchParams.has('modal')) {
    url.searchParams.delete('modal');
    window.history.replaceState({}, document.title, url.toString());
    }
});