const API_CATEGORIAS = "http://localhost:3000/api/categorias";
const API_SERVICOS = "http://localhost:3000/api/servicos";

// Criar um elemento para exibir os logs na página
const logContainer = document.createElement("pre");
logContainer.id = "logOutput";
document.body.insertBefore(logContainer, document.body.firstChild);

function logMessage(message) {
    console.log(message);
    logContainer.innerHTML += message + "\n";
}

document.addEventListener("DOMContentLoaded", () => {
    logMessage("🔄 Página carregada. Iniciando carregamento de categorias...");

    const selectCategoria = document.getElementById("categoria");
    const selectServico = document.getElementById("servico");
    const btnSolicitar = document.getElementById("btnSolicitar");
    const listaCarrinho = document.getElementById("listaCarrinho");

    if (!selectCategoria || !selectServico || !btnSolicitar || !listaCarrinho) {
        logMessage("❌ Erro: Elementos do DOM não encontrados. Verifique os IDs no HTML.");
        return;
    }

    carregarCategorias();
    configurarSelecaoServicos();
});

// Função para carregar as categorias no select
async function carregarCategorias() {
    try {
        logMessage("📡 Buscando categorias na API...");
        const response = await fetch(API_CATEGORIAS);
        if (!response.ok) {
            throw new Error("Erro ao carregar categorias");
        }

        const categorias = await response.json();
        logMessage(`✅ Categorias carregadas: ${JSON.stringify(categorias)}`);

        const selectCategoria = document.getElementById("categoria");
        selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';

        categorias.forEach(categoria => {
            const option = document.createElement("option");
            option.value = categoria.id;
            option.textContent = categoria.nome;
            selectCategoria.appendChild(option);
        });

        selectCategoria.disabled = false;
        logMessage("🎯 Categorias carregadas com sucesso!");
    } catch (error) {
        logMessage(`❌ Erro ao carregar categorias: ${error.message}`);
    }
}

// Função para carregar os serviços de acordo com a categoria selecionada
async function carregarServicos(categoriaId) {
    try {
        logMessage(`📡 Buscando serviços para a categoria ID ${categoriaId}...`);
        const response = await fetch(`${API_SERVICOS}?categoriaId=${categoriaId}`);
        if (!response.ok) {
            throw new Error("Erro ao carregar serviços");
        }

        const servicos = await response.json();
        logMessage(`✅ Serviços carregados: ${JSON.stringify(servicos)}`);

        const selectServico = document.getElementById("servico");
        selectServico.innerHTML = '<option value="">Selecione um serviço</option>';

        servicos.forEach(servico => {
            const option = document.createElement("option");
            option.value = servico.id;
            option.textContent = `${servico.titulo} - R$ ${servico.valor.toFixed(2)}`;
            selectServico.appendChild(option);
        });

        selectServico.disabled = false;
        logMessage("🎯 Serviços carregados com sucesso!");
    } catch (error) {
        logMessage(`❌ Erro ao carregar serviços: ${error.message}`);
    }
}

// Função para configurar a seleção dinâmica de serviços com base na categoria
function configurarSelecaoServicos() {
    const selectCategoria = document.getElementById("categoria");
    const selectServico = document.getElementById("servico");
    const btnSolicitar = document.getElementById("btnSolicitar");

    selectCategoria.addEventListener("change", (event) => {
        const categoriaId = event.target.value;
        if (categoriaId) {
            logMessage(`🔄 Categoria selecionada: ID ${categoriaId}`);
            carregarServicos(categoriaId);
        } else {
            selectServico.innerHTML = '<option value="">Selecione um serviço</option>';
            selectServico.disabled = true;
            logMessage("⚠️ Nenhuma categoria selecionada.");
        }
    });

    selectServico.addEventListener("change", (event) => {
        btnSolicitar.disabled = !event.target.value;
        if (event.target.value) {
            logMessage(`✔️ Serviço selecionado: ID ${event.target.value}`);
        }
    });
}

// Função para adicionar um serviço ao carrinho
function adicionarAoCarrinho() {
    const selectServico = document.getElementById("servico");
    const servicoId = selectServico.value;
    const servicoNome = selectServico.options[selectServico.selectedIndex].textContent;

    if (!servicoId) return;

    logMessage(`🛒 Adicionando serviço ao carrinho: ID ${servicoId} - ${servicoNome}`);

    const listaCarrinho = document.getElementById("listaCarrinho");

    const item = document.createElement("li");
    item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    item.dataset.servicoId = servicoId;
    item.innerHTML = `
        ${servicoNome}
        <button class="btn btn-danger btn-sm" onclick="removerDoCarrinho(this)">Remover</button>
    `;

    listaCarrinho.appendChild(item);
}

// Função para remover um item do carrinho
function removerDoCarrinho(botao) {
    const itemRemovido = botao.parentElement;
    const servicoId = itemRemovido.dataset.servicoId;
    logMessage(`🗑️ Removendo serviço do carrinho: ID ${servicoId}`);
    itemRemovido.remove();
}

// Configurar evento de clique no botão "Solicitar Serviço"
document.getElementById("btnSolicitar")?.addEventListener("click", adicionarAoCarrinho);
