const apiUrl = 'http://localhost:3000/api/horarios';

// Função para obter o token armazenado
function getToken() {
    return localStorage.getItem('token');
}

// Função para decodificar o token JWT e obter o ID do usuário logado
function getUserFromToken() {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
        return payload; // Retorna todas as informações do usuário autenticado
    } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
    }
}

// Função para exibir mensagens
function showMessage(message, type) {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.textContent = message;
    messageContainer.className = `alert alert-${type}`;
    messageContainer.style.display = 'block';

    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 4000);
}

// Função para listar horários disponíveis
async function getHorarios() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Falha ao listar horários');

        return await response.json();
    } catch (error) {
        console.error('Erro ao listar horários:', error);
        showMessage('Erro ao listar horários.', 'danger');
        return [];
    }
}

// Função para criar horários com base no intervalo
async function createHorario(horarioData) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(horarioData),
        });

        if (!response.ok) throw new Error('Falha ao criar horário');

        showMessage('Horário criado com sucesso!', 'success');
        refreshHorarioList();
    } catch (error) {
        console.error('Erro ao criar horário:', error);
        showMessage('Erro ao criar horário.', 'danger');
    }
}

// Função para deletar um horário
async function deleteHorario(horarioId) {
    try {
        const response = await fetch(`${apiUrl}/${horarioId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });

        if (!response.ok) throw new Error('Falha ao deletar horário');

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
            ${getToken() ? `<button class="btn btn-danger btn-sm" onclick="deleteHorario(${horario.id})">Excluir</button>` : ''}
        `;

        horarioListDiv.appendChild(horarioDiv);
    });
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    refreshHorarioList();

    // Evento para criar novo horário (somente para profissionais/admins)
    if (document.getElementById('createHorarioForm')) {
        document.getElementById('createHorarioForm').addEventListener('submit', event => {
            event.preventDefault();
            const user = getUserFromToken(); // Obtém o usuário autenticado
            if (!user) {
                showMessage('Erro: usuário não autenticado.', 'danger');
                return;
            }

            const horarioData = {
                data: document.getElementById('createData').value,
                horaInicio: document.getElementById('createHoraInicio').value,
                horaFim: document.getElementById('createHoraFim').value,
                duracaoServico: document.getElementById('createDuracao').value,
                profissionalId: user.id // Obtém o ID do profissional do token
            };

            createHorario(horarioData);
        });
    }
});
