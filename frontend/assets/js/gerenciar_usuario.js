const apiUrl = 'http://localhost:3000/api/usuarios';

// Função para obter o token JWT armazenado
function getToken() {
    return localStorage.getItem('token');
}

// Função para mostrar mensagens no contêiner
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.textContent = message;
    messageContainer.className = `alert alert-${type}`;
    messageContainer.style.display = 'block';

    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 4000);
}

// Função para obter usuários ordenados alfabeticamente
async function getUsers() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Falha ao obter usuários');

        let users = await response.json();
        return users.sort((a, b) => a.nome.localeCompare(b.nome));
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        showMessage('Erro ao carregar usuários.', 'danger');
        return [];
    }
}

// Função para exibir lista de usuários na tabela com filtros
async function refreshUserList(filter = 'ALL') {
    const users = await getUsers();
    const userListTable = document.getElementById('userList');
    userListTable.innerHTML = '';

    users.filter(user => filter === 'ALL' || user.tipo === filter).forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><button class="btn btn-link" onclick="openUserModal(${user.id}, '${user.nome}', '${user.email}', '${user.celular}', '${user.cpf}', '${user.tipo}')">${user.nome}</button></td>
        `;
        userListTable.appendChild(row);
    });
}

// Função para abrir o modal de informações do usuário
function openUserModal(userId, nome, email, celular, cpf, tipo) {
    document.getElementById('modalUserName').textContent = nome;
    document.getElementById('modalUserEmail').textContent = email;
    document.getElementById('modalUserCelular').textContent = celular;
    document.getElementById('modalUserCpf').textContent = cpf;
    document.getElementById('modalUserTipo').textContent = tipo;
    document.getElementById('editUserId').value = userId;
    document.getElementById('editUserButton').setAttribute('onclick', `toggleEditForm('${email}', '${celular}', '${tipo}')`);
    document.getElementById('deleteUserButton').setAttribute('onclick', `deleteUser(${userId})`);

    const modal = new bootstrap.Modal(document.getElementById('userActionsModal'));
    modal.show();
}

// Função para expandir/recolher o formulário de edição
function toggleEditForm(email, celular, tipo) {
    const editForm = document.getElementById('editUserForm');
    const saveButton = document.getElementById('saveUserChangesButton');
    document.getElementById('editEmail').value = email;
    document.getElementById('editCelular').value = celular;
    document.getElementById('editTipo').value = tipo;
    
    editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
    saveButton.style.display = saveButton.style.display === 'none' ? 'block' : 'none';
}

// Função para salvar alterações do usuário (Apenas Admin)
async function saveUserChanges() {
    const userId = document.getElementById('editUserId').value;
    const updatedUser = {
        email: document.getElementById('editEmail').value,
        celular: document.getElementById('editCelular').value,
        senha: document.getElementById('editSenha').value || undefined,
        tipo: document.getElementById('editTipo').value
    };

    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(updatedUser)
        });

        if (!response.ok) throw new Error('Falha ao atualizar usuário');

        showMessage('Usuário atualizado com sucesso!', 'success');
        refreshUserList();

        const editForm = document.getElementById('editUserForm');
        editForm.style.display = 'none';
        document.getElementById('saveUserChangesButton').style.display = 'none';
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        showMessage('Erro ao atualizar usuário.', 'danger');
    }
}

// Função para excluir usuário (Apenas Admin)
async function deleteUser(userId) {
    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        if (!response.ok) throw new Error('Falha ao deletar usuário');
        showMessage('Usuário removido com sucesso!', 'success');
        refreshUserList();
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        showMessage('Erro ao excluir usuário.', 'danger');
    }
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    refreshUserList();
    document.getElementById('filterAll').addEventListener('click', () => refreshUserList('ALL'));
    document.getElementById('filterClients').addEventListener('click', () => refreshUserList('CLIENTE'));
    document.getElementById('filterProfessionals').addEventListener('click', () => refreshUserList('PROFISSIONAL'));
    document.getElementById('filterAdmins').addEventListener('click', () => refreshUserList('ADMINISTRADOR'));
});

document.getElementById('formEditUser').addEventListener('submit', event => {
    event.preventDefault();
    saveUserChanges();
});
