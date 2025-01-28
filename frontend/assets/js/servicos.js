const API_URL = "http://localhost:3000/api/servicos";

// Função para carregar e exibir os serviços
async function carregarServicos() {
    try {
        // Requisição para buscar os serviços
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Erro ao carregar os serviços");
        }

        // Processa a resposta JSON
        const servicos = await response.json();

        // Seleciona o elemento onde os serviços serão exibidos
        const listaServicos = document.getElementById("listaServicos");
        listaServicos.innerHTML = ""; // Limpa o conteúdo anterior

        // Verifica se há serviços disponíveis
        if (servicos.length === 0) {
            listaServicos.innerHTML = `<p class="text-center text-muted">Nenhum serviço disponível no momento.</p>`;
            return;
        }

        // Cria os cards para cada serviço
        servicos.forEach((servico) => {
            const card = document.createElement("div");
            card.classList.add("card", "mb-4", "shadow-sm");
            card.style.width = "100%";

            card.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${servico.titulo}</h5>
                    <p class="card-text">Descrição: ${servico.descricao || "Não informada"}</p>
                    <p class="card-text">Duração: ${servico.duracao} minutos</p>
                    <p class="card-text">Valor: R$ ${servico.valor.toFixed(2)}</p>
                    <p class="card-text">Categoria: ${servico.categoria?.nome || "Sem categoria"}</p>
                    <button class="btn btn-primary btn-sm mt-2" onclick="adicionarServico(${servico.id})">Adicionar</button>
                </div>
            `;

            listaServicos.appendChild(card);
        });
    } catch (error) {
        console.error("Erro ao carregar serviços:", error);
        const listaServicos = document.getElementById("listaServicos");
        listaServicos.innerHTML = `<p class="text-center text-danger">Erro ao carregar os serviços. Tente novamente mais tarde.</p>`;
    }
}

// Função para adicionar o serviço (placeholder para implementar lógica futura)
function adicionarServico(servicoId) {
    alert(`Serviço com ID ${servicoId} adicionado!`);
    // Aqui você pode implementar a lógica para adicionar o serviço ao carrinho ou outra funcionalidade
}

// Carrega os serviços assim que a página for carregada
document.addEventListener("DOMContentLoaded", carregarServicos);
