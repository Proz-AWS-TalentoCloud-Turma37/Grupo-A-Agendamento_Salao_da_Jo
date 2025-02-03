const API_URL = "http://localhost:3000/api/agendamentos";

// ✅ Função para exibir mensagens com AlertifyJS
function showMessage(message, type = "success") {
    alertify.set("notifier", "position", "top-right");
    alertify.notify(message, type, 5);
}

// ✅ Função para carregar agendamentos e exibir na tabela
async function carregarAgendamentos() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Erro ao carregar agendamentos.");

        const agendamentos = await response.json();
        const tabelaAgendamentos = document.getElementById("tabelaAgendamentos");

        // Limpa a tabela antes de preenchê-la
        tabelaAgendamentos.innerHTML = "";

        // Adiciona os agendamentos na tabela
        agendamentos.forEach(agendamento => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${agendamento.id}</td>
                <td>${agendamento.cliente?.nome || "Cliente não encontrado"}</td>
                <td>${agendamento.horario?.profissional?.nome || "Profissional não encontrado"}</td>
                <td>${agendamento.horario ? new Date(agendamento.horario.dataHora).toLocaleString() : "Horário não encontrado"}</td>
                <td>${agendamento.observacao || "Sem observação"}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editarAgendamento(${agendamento.id})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deletarAgendamento(${agendamento.id})">Excluir</button>
                </td>
            `;

            tabelaAgendamentos.appendChild(row);
        });

        showMessage("Agendamentos carregados com sucesso!", "success");

    } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        showMessage("Erro ao carregar agendamentos.", "error");
    }
}

// ✅ Função para buscar um agendamento e preencher o modal de edição
async function editarAgendamento(agendamentoId) {
    try {
        const response = await fetch(`${API_URL}/${agendamentoId}`);
        if (!response.ok) throw new Error("Erro ao buscar detalhes do agendamento.");

        const agendamento = await response.json();

        // Preenche os campos do modal
        document.getElementById("editAgendamentoId").value = agendamento.id;
        document.getElementById("editObservacao").value = agendamento.observacao || "";

        // Abre o modal
        const modal = new bootstrap.Modal(document.getElementById("modalEditarAgendamento"));
        modal.show();

    } catch (error) {
        console.error("Erro ao carregar dados do agendamento:", error);
        showMessage("Erro ao carregar dados do agendamento.", "error");
    }
}

// ✅ Função para salvar alterações no agendamento
async function salvarEdicaoAgendamento(event) {
    event.preventDefault();

    const agendamentoId = document.getElementById("editAgendamentoId").value;
    const observacaoAtualizada = document.getElementById("editObservacao").value;

    try {
        const response = await fetch(`${API_URL}/${agendamentoId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ observacao: observacaoAtualizada })
        });

        if (!response.ok) throw new Error("Erro ao atualizar agendamento.");

        showMessage("Agendamento atualizado com sucesso!", "success");
        carregarAgendamentos();

        // Fecha o modal após salvar
        const modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarAgendamento"));
        modal.hide();

    } catch (error) {
        console.error("Erro ao salvar edição do agendamento:", error);
        showMessage("Erro ao atualizar agendamento.", "error");
    }
}

// ✅ Função para excluir um agendamento
async function deletarAgendamento(agendamentoId) {
    alertify.confirm(
        "Excluir Agendamento",
        "Tem certeza que deseja excluir este agendamento?",
        async function () {
            try {
                const response = await fetch(`${API_URL}/${agendamentoId}`, {
                    method: "DELETE"
                });

                if (!response.ok) throw new Error("Erro ao excluir agendamento.");

                showMessage("Agendamento excluído com sucesso!", "success");
                carregarAgendamentos();

            } catch (error) {
                console.error("Erro ao excluir agendamento:", error);
                showMessage("Erro ao excluir agendamento.", "error");
            }
        },
        function () {
            showMessage("Exclusão cancelada.", "info");
        }
    );
}

// ✅ Adiciona evento para salvar edição do agendamento
document.getElementById("formEditarAgendamento").addEventListener("submit", salvarEdicaoAgendamento);

// ✅ Carrega os agendamentos quando a página for carregada
document.addEventListener("DOMContentLoaded", carregarAgendamentos);
