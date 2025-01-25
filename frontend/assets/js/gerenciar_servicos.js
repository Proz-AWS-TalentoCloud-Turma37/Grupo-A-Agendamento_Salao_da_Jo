const API_URL = "http://localhost:3000/api/servicos";

// Função para exibir mensagens no contêiner de mensagens
function exibirMensagem(mensagem, tipo = "info") {
    const messageContainer = document.getElementById("messageContainer");
    messageContainer.textContent = mensagem;
    messageContainer.className = `alert alert-${tipo}`;
    messageContainer.style.display = "block";

    setTimeout(() => {
        messageContainer.style.display = "none";
    }, 4000); // Mensagem desaparece após 4 segundos
}

// Função para carregar todos os serviços
async function carregarServicos() {
    try {
        const response = await fetch(`${API_URL}`);
        if (!response.ok) {
            throw new Error("Erro ao carregar serviços");
        }

        const servicos = await response.json();
        const listaServicos = document.getElementById("listaServicos");
        listaServicos.innerHTML = "";

        servicos.forEach(servico => {
            const servicoDiv = document.createElement("div");
            servicoDiv.classList.add("servico-item", "mb-3", "p-3", "border");

            servicoDiv.innerHTML = `
                <h5>${servico.titulo}</h5>
                <p>Descrição: ${servico.descricao || "Não informada"}</p>
                <p>Duração: ${servico.duracao} minutos</p>
                <p>Valor: R$ ${servico.valor.toFixed(2)}</p>
                <p>Categoria: ${servico.categoria.nome}</p>
                <button class="btn btn-warning btn-sm me-2" onclick="editarServico(${servico.id})">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deletarServico(${servico.id})">Excluir</button>
            `;

            listaServicos.appendChild(servicoDiv);
        });
    } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        exibirMensagem("Erro ao carregar serviços", "danger");
    }
}

// Função para criar um novo serviço
async function criarServico(dadosServico) {
    try {
        const response = await fetch(`${API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosServico),
        });

        if (!response.ok) {
            throw new Error("Erro ao criar serviço");
        }

        exibirMensagem("Serviço criado com sucesso!", "success");
        carregarServicos();
    } catch (error) {
        console.error("Erro ao criar serviço:", error);
        exibirMensagem("Erro ao criar serviço", "danger");
    }
}

// Função para editar um serviço
async function editarServico(servicoId) {
    try {
        const response = await fetch(`${API_URL}/${servicoId}`);
        if (!response.ok) {
            throw new Error("Erro ao carregar informações do serviço");
        }

        const servico = await response.json();
        document.getElementById("editServicoId").value = servico.id;
        document.getElementById("editTitulo").value = servico.titulo;
        document.getElementById("editDescricao").value = servico.descricao || "";
        document.getElementById("editDuracao").value = servico.duracao;
        document.getElementById("editValor").value = servico.valor;
        document.getElementById("editCategoriaId").value = servico.categoriaId;

        const modal = new bootstrap.Modal(document.getElementById("editarServicoModal"));
        modal.show();
    } catch (error) {
        console.error("Erro ao carregar informações do serviço:", error);
        exibirMensagem("Erro ao carregar informações do serviço", "danger");
    }
}

// Função para salvar alterações no serviço
async function salvarAlteracoesServico() {
    const servicoId = document.getElementById("editServicoId").value;
    const dadosServico = {
        titulo: document.getElementById("editTitulo").value,
        descricao: document.getElementById("editDescricao").value,
        duracao: parseInt(document.getElementById("editDuracao").value),
        valor: parseFloat(document.getElementById("editValor").value),
        categoriaId: parseInt(document.getElementById("editCategoriaId").value),
    };

    try {
        const response = await fetch(`${API_URL}/${servicoId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dadosServico),
        });

        if (!response.ok) {
            throw new Error("Erro ao salvar alterações do serviço");
        }

        exibirMensagem("Serviço atualizado com sucesso!", "success");
        carregarServicos();

        const modal = bootstrap.Modal.getInstance(document.getElementById("editarServicoModal"));
        modal.hide();
    } catch (error) {
        console.error("Erro ao salvar alterações do serviço:", error);
        exibirMensagem("Erro ao salvar alterações do serviço", "danger");
    }
}

// Função para deletar um serviço
async function deletarServico(servicoId) {
    try {
        const response = await fetch(`${API_URL}/${servicoId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Erro ao deletar serviço");
        }

        exibirMensagem("Serviço deletado com sucesso!", "success");
        carregarServicos();
    } catch (error) {
        console.error("Erro ao deletar serviço:", error);
        exibirMensagem("Erro ao deletar serviço", "danger");
    }
}

// Event listener para o formulário de criação de serviço
document.getElementById("formNovoServico").addEventListener("submit", async event => {
    event.preventDefault();

    const dadosServico = {
        titulo: document.getElementById("novoTitulo").value,
        descricao: document.getElementById("novaDescricao").value,
        duracao: parseInt(document.getElementById("novaDuracao").value),
        valor: parseFloat(document.getElementById("novoValor").value),
        categoriaId: parseInt(document.getElementById("novaCategoriaId").value),
    };

    await criarServico(dadosServico);
});

// Event listener para o botão de salvar alterações no modal de edição
document.getElementById("btnSalvarAlteracoesServico").addEventListener("click", salvarAlteracoesServico);

// Carregar os serviços ao carregar a página
document.addEventListener("DOMContentLoaded", carregarServicos);
