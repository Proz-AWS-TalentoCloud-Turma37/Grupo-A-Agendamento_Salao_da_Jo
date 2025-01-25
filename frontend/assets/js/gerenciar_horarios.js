const apiUrl = 'http://localhost:3000/api/horarios';

// Função para exibir mensagens no contêiner
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.textContent = message;
    messageContainer.className = `alert alert-${type}`;
    messageContainer.style.display = 'block';

    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 4000); // A mensagem será ocultada após 4 segundos
}

// Função para listar horários disponíveis
async function getHorarios() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao listar horários');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao listar horários:', error);
        showMessage('Erro ao listar horários.', 'danger');
        return [];
    }
}

// Função para criar um novo horário
async function createHorario(horarioData) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(horarioData),
        });

        if (!response.ok) {
            throw new Error('Falha ao criar horário');
        }

        showMessage('Horário criado com sucesso!', 'success');
        refreshHorarioList();
    } catch (error) {
        console.error('Erro ao criar horário:', error);
        showMessage('Erro ao criar horário.', 'danger');
    }
}

// Função para atualizar um horário
async function updateHorario(horarioId, updatedData) {
    try {
        const response = await fetch(`${apiUrl}/${horarioId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Falha ao atualizar horário');
        }

        showMessage('Horário atualizado com sucesso!', 'success');
        refreshHorarioList();
    } catch (error) {
        console.error('Erro ao atualizar horário:', error);
        showMessage('Erro ao atualizar horário.', 'danger');
    }
}

// Função para deletar um horário
async function deleteHorario(horarioId) {
    try {
        const response = await fetch(`${apiUrl}/${horarioId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao deletar horário');
        }

        showMessage('Horário deletado com sucesso!', 'success');
        refreshHorarioList();
    } catch (error) {
        console.error('Erro ao deletar horário:', error);
        showMessage('Erro ao deletar horário.', 'danger');
    }
}

// Função para exibir a lista de horários
async function refreshHorarioList() {
    const horarios = await getHorarios();
    const horarioListDiv = document.getElementById('horarioList');
    horarioListDiv.innerHTML = '';

    horarios.forEach(horario => {
        const horarioDiv = document.createElement('div');
        horarioDiv.classList.add('horario-item');

        horarioDiv.innerHTML = `
            <p>Data e Hora: ${new Date(horario.dataHora).toLocaleString()}</p>
            <p>Disponível: ${horario.disponivel ? 'Sim' : 'Não'}</p>
            <p>Profissional: ${horario.profissional ? horario.profissional.nome : 'N/A'}</p>
            <button class="btn btn-primary btn-sm" onclick="editHorario(${horario.id})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteHorario(${horario.id})">Excluir</button>
        `;

        horarioListDiv.appendChild(horarioDiv);
    });
}

// Função para editar um horário
async function editHorario(horarioId) {
    try {
        const response = await fetch(`${apiUrl}/${horarioId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao carregar horário');
        }

        const horario = await response.json();

        // Preenche os campos do modal com os dados do horário
        document.getElementById('editHorarioId').value = horario.id;
        document.getElementById('editDataHora').value = new Date(horario.dataHora).toISOString().slice(0, 16);
        document.getElementById('editDisponivel').checked = horario.disponivel;

        const editModal = new bootstrap.Modal(document.getElementById('editHorarioModal'));
        editModal.show();
    } catch (error) {
        console.error('Erro ao editar horário:', error);
        showMessage('Erro ao carregar horário.', 'danger');
    }
}

// Função para salvar as alterações de um horário
async function saveHorarioChanges() {
    const horarioId = document.getElementById('editHorarioId').value;
    const updatedHorario = {
        dataHora: document.getElementById('editDataHora').value,
        disponivel: document.getElementById('editDisponivel').checked,
    };

    await updateHorario(horarioId, updatedHorario);

    const editModal = bootstrap.Modal.getInstance(document.getElementById('editHorarioModal'));
    editModal.hide();
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    refreshHorarioList();

    // Evento para criar novo horário
    document.getElementById('createHorarioForm').addEventListener('submit', event => {
        event.preventDefault();
        const horarioData = {
            dataHora: document.getElementById('createDataHora').value,
            profissionalId: document.getElementById('createProfissionalId').value,
        };
        createHorario(horarioData);
    });

    // Evento para salvar alterações no horário
    document.getElementById('editHorarioForm').addEventListener('submit', event => {
        event.preventDefault();
        saveHorarioChanges();
    });
});
