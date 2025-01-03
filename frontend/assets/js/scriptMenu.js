console.log('Script menu carregado com sucesso!');
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

