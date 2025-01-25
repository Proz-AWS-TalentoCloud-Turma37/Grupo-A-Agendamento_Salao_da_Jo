const apiUrl = 'http://localhost:3000/api/usuarios';

// Função para mostrar mensagens no contêiner
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.textContent = message;
    messageContainer.className = `alert alert-${type}`;
    messageContainer.style.display = 'block';

    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 4000); // A mensagem será ocultada após 4 segundos
}

// Função para obter usuários
async function getUsers() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao obter usuários');
        }

        const users = await response.json();
        return users;
    } catch (error) {
        console.error('Erro ao obter usuários:', error);
        showMessage('Erro ao carregar usuários.', 'danger');
        return [];
    }
}

// Função para atualizar usuário
async function updateUser(userId, userData) {
    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Falha ao atualizar usuário');
        }

        showMessage('Usuário atualizado com sucesso!', 'success');
        refreshUserList();
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        showMessage('Erro ao atualizar usuário.', 'danger');
    }
}

// Função para deletar usuário
async function deleteUser(userId) {
    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao deletar usuário');
        }

        showMessage('Usuário deletado com sucesso!', 'success');
        refreshUserList();
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        showMessage('Erro ao deletar usuário.', 'danger');
    }
}

// Função para editar um usuário
async function editUser(userId) {
    try {
        const response = await fetch(`${apiUrl}/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao carregar usuário');
        }

        const user = await response.json();

        // Preenche os campos do modal com as informações do usuário
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editName').value = user.nome;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editCelular').value = user.celular;
        document.getElementById('editCpf').value = user.cpf;
        document.getElementById('editTipo').value = user.tipo;

        const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
        editModal.show();
    } catch (error) {
        console.error('Erro ao editar usuário:', error);
        showMessage('Erro ao carregar usuário.', 'danger');
    }
}

// Função para salvar alterações do usuário
async function saveUserChanges() {
    const userId = document.getElementById('editUserId').value;
    const updatedUser = {
        nome: document.getElementById('editName').value,
        email: document.getElementById('editEmail').value,
        celular: document.getElementById('editCelular').value,
        cpf: document.getElementById('editCpf').value,
        tipo: document.getElementById('editTipo').value,
    };

    await updateUser(userId, updatedUser);

    const editModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
    editModal.hide();
}

// Função para exibir lista de usuários
async function refreshUserList() {
    const users = await getUsers();
    const userListDiv = document.getElementById('userList');
    userListDiv.innerHTML = '';

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.classList.add('user-item');

        userDiv.innerHTML = `
            <p>Nome: ${user.nome}</p>
            <p>Email: ${user.email}</p>
            <p>CPF: ${user.cpf}</p>
            <button class="btn btn-primary btn-sm" onclick="editUser(${user.id})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Excluir</button>
        `;

        userListDiv.appendChild(userDiv);
    });
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    refreshUserList();

    // Evento para salvar alterações no usuário
    document.getElementById('formEditUser').addEventListener('submit', event => {
        event.preventDefault();
        saveUserChanges();
    });
});
