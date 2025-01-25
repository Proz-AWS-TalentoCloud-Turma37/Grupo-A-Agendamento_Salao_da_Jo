const apiUrl = 'http://localhost:3000/api/agendamentos';

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

// Função para listar agendamentos
async function getAgendamentos() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao listar agendamentos');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao listar agendamentos:', error);
        showMessage('Erro ao listar agendamentos.', 'danger');
        return [];
    }
}

// Função para criar um novo agendamento
async function createAgendamento(agendamentoData) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(agendamentoData),
        });

        if (!response.ok) {
            throw new Error('Falha ao criar agendamento');
        }

        showMessage('Agendamento criado com sucesso!', 'success');
        refreshAgendamentoList();
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        showMessage('Erro ao criar agendamento.', 'danger');
    }
}

// Função para atualizar um agendamento
async function updateAgendamento(agendamentoId, updatedData) {
    try {
        const response = await fetch(`${apiUrl}/${agendamentoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Falha ao atualizar agendamento');
        }

        showMessage('Agendamento atualizado com sucesso!', 'success');
        refreshAgendamentoList();
    } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        showMessage('Erro ao atualizar agendamento.', 'danger');
    }
}

// Função para deletar um agendamento
async function deleteAgendamento(agendamentoId) {
    try {
        const response = await fetch(`${apiUrl}/${agendamentoId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao deletar agendamento');
        }

        showMessage('Agendamento cancelado com sucesso!', 'success');
        refreshAgendamentoList();
    } catch (error) {
        console.error('Erro ao deletar agendamento:', error);
        showMessage('Erro ao cancelar agendamento.', 'danger');
    }
}

// Função para exibir a lista de agendamentos
async function refreshAgendamentoList() {
    const agendamentos = await getAgendamentos();
    const agendamentoListDiv = document.getElementById('agendamentoList');
    agendamentoListDiv.innerHTML = '';

    agendamentos.forEach(agendamento => {
        const agendamentoDiv = document.createElement('div');
        agendamentoDiv.classList.add('agendamento-item');

        agendamentoDiv.innerHTML = `
            <p>Cliente: ${agendamento.cliente.nome}</p>
            <p>Horário: ${new Date(agendamento.horario.dataHora).toLocaleString()}</p>
            <p>Profissional: ${agendamento.horario.profissional.nome}</p>
            <p>Observação: ${agendamento.observacao || 'Nenhuma'}</p>
            <button class="btn btn-primary btn-sm" onclick="editAgendamento(${agendamento.id})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteAgendamento(${agendamento.id})">Cancelar</button>
        `;

        agendamentoListDiv.appendChild(agendamentoDiv);
    });
}

// Função para editar um agendamento
async function editAgendamento(agendamentoId) {
    try {
        const response = await fetch(`${apiUrl}/${agendamentoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao carregar agendamento');
        }

        const agendamento = await response.json();

        // Preenche os campos do modal com os dados do agendamento
        document.getElementById('editAgendamentoId').value = agendamento.id;
        document.getElementById('editObservacao').value = agendamento.observacao;

        const editModal = new bootstrap.Modal(document.getElementById('editAgendamentoModal'));
        editModal.show();
    } catch (error) {
        console.error('Erro ao editar agendamento:', error);
        showMessage('Erro ao carregar agendamento.', 'danger');
    }
}

// Função para salvar as alterações de um agendamento
async function saveAgendamentoChanges() {
    const agendamentoId = document.getElementById('editAgendamentoId').value;
    const updatedAgendamento = {
        observacao: document.getElementById('editObservacao').value,
    };

    await updateAgendamento(agendamentoId, updatedAgendamento);

    const editModal = bootstrap.Modal.getInstance(document.getElementById('editAgendamentoModal'));
    editModal.hide();
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    refreshAgendamentoList();

    // Evento para criar novo agendamento
    document.getElementById('createAgendamentoForm').addEventListener('submit', event => {
        event.preventDefault();
        const agendamentoData = {
            horarioId: document.getElementById('createHorarioId').value,
            clienteId: document.getElementById('createClienteId').value,
            observacao: document.getElementById('createObservacao').value,
        };
        createAgendamento(agendamentoData);
    });

    // Evento para salvar alterações no agendamento
    document.getElementById('editAgendamentoForm').addEventListener('submit', event => {
        event.preventDefault();
        saveAgendamentoChanges();
    });
});
