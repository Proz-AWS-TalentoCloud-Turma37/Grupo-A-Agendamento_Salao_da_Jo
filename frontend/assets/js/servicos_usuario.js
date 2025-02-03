const API_CATEGORIAS = "http://localhost:3000/api/categorias";
const API_SERVICOS = "http://localhost:3000/api/servicos";

document.addEventListener("DOMContentLoaded", async () => {
    await carregarCategorias();
});

// Carrega as categorias no dropdown
async function carregarCategorias() {
    try {
        const response = await fetch(API_CATEGORIAS);
        if (!response.ok) throw new Error("Erro ao carregar categorias");

        const categorias = await response.json();
        const dropdownCategoria = document.getElementById("dropdownCategoria");
        const categoriaLista = document.getElementById("categoriaLista");

        categoriaLista.innerHTML = "";

        categorias.forEach(categoria => {
            const itemCategoria = document.createElement("li");
            const linkCategoria = document.createElement("a");

            linkCategoria.classList.add("dropdown-item");
            linkCategoria.textContent = categoria.nome;
            linkCategoria.href = "#";
            linkCategoria.dataset.id = categoria.id;

            linkCategoria.addEventListener("click", (event) => {
                event.preventDefault();
                dropdownCategoria.textContent = categoria.nome;
                dropdownCategoria.dataset.id = categoria.id;
                carregarServicos(categoria.id);
            });

            itemCategoria.appendChild(linkCategoria);
            categoriaLista.appendChild(itemCategoria);
        });

    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
    }
}

// Carrega os serviços da categoria selecionada
async function carregarServicos(categoriaId) {
    try {
        const response = await fetch(`${API_SERVICOS}?categoriaId=${categoriaId}`);
        if (!response.ok) throw new Error("Erro ao carregar serviços");

        const servicos = await response.json();
        const servicoContainer = document.getElementById("servicoContainer");
        servicoContainer.innerHTML = ""; 

        if (servicos.length === 0) {
            servicoContainer.innerHTML = "<p>Nenhum serviço disponível para esta categoria.</p>";
            return;
        }

        servicos.forEach(servico => {
            const divServico = document.createElement("div");
            divServico.classList.add("form-check");

            const inputServico = document.createElement("input");
            inputServico.classList.add("form-check-input");
            inputServico.type = "checkbox";
            inputServico.id = `servico-${servico.id}`;
            inputServico.dataset.id = servico.id;
            inputServico.dataset.nome = servico.titulo;
            inputServico.dataset.descricao = servico.descricao || "Sem descrição";
            inputServico.dataset.duracao = servico.duracao ? `${servico.duracao} min` : "Indefinido";
            inputServico.dataset.valor = servico.valor ? `R$ ${parseFloat(servico.valor).toFixed(2)}` : "Preço não informado";

            const labelServico = document.createElement("label");
            labelServico.classList.add("form-check-label");
            labelServico.setAttribute("for", `servico-${servico.id}`);
            labelServico.textContent = servico.titulo;

            inputServico.addEventListener("change", () => toggleServicoCarrinho(inputServico));

            divServico.appendChild(inputServico);
            divServico.appendChild(labelServico);
            servicoContainer.appendChild(divServico);
        });

        verificarBotaoSolicitar();

    } catch (error) {
        console.error("Erro ao carregar serviços:", error);
    }
}

// Adiciona ou remove serviço do carrinho e exibe os detalhes
function toggleServicoCarrinho(input) {
    if (input.checked) {
        adicionarAoCarrinho(input.dataset.id, input.dataset.nome, input.dataset.valor);
        adicionarDetalhesServico(input);
    } else {
        removerDoCarrinho(input.dataset.id);
        removerDetalhesServico(input.dataset.id);
    }

    verificarBotaoSolicitar();
}

// Adiciona os detalhes do serviço selecionado (sem apagar os outros)
function adicionarDetalhesServico(input) {
    const servicoInfo = document.getElementById("servicoInfo");
    const detalheId = `detalhe-servico-${input.dataset.id}`;

    // Evita duplicação se já estiver na lista
    if (document.getElementById(detalheId)) return;

    const detalheServico = document.createElement("div");
    detalheServico.id = detalheId;
    detalheServico.innerHTML = `
        <h5>${input.dataset.nome}</h5>
        <p><strong>Descrição:</strong> ${input.dataset.descricao}</p>
        <p><strong>Duração:</strong> ${input.dataset.duracao}</p>
        <p><strong>Preço:</strong> ${input.dataset.valor}</p>
        <hr>
    `;

    servicoInfo.appendChild(detalheServico);
    servicoInfo.style.display = "block";
}

// Remove os detalhes do serviço desmarcado
function removerDetalhesServico(id) {
    const detalheServico = document.getElementById(`detalhe-servico-${id}`);
    if (detalheServico) {
        detalheServico.remove();
    }

    // Se não houver mais detalhes, esconde a seção
    if (document.getElementById("servicoInfo").children.length === 0) {
        document.getElementById("servicoInfo").style.display = "none";
    }
}

// Adiciona um serviço ao carrinho
function adicionarAoCarrinho(id, nome, valor) {
    const listaCarrinho = document.getElementById("listaCarrinho");

    // Verifica se o serviço já está no carrinho para evitar duplicatas
    if (document.querySelector(`[data-servico-id='${id}']`)) return;

    const item = document.createElement("li");
    item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    item.dataset.servicoId = id;
    item.innerHTML = `
        ${nome} - ${valor}
        <button class="btn btn-danger btn-sm" onclick="removerDoCarrinho('${id}')">Remover</button>
    `;

    listaCarrinho.appendChild(item);
}

// Remove um item do carrinho
function removerDoCarrinho(id) {
    const itemRemovido = document.querySelector(`[data-servico-id='${id}']`);
    if (itemRemovido) {
        itemRemovido.remove();
    }

    // Também desmarca a checkbox associada
    const checkbox = document.getElementById(`servico-${id}`);
    if (checkbox) {
        checkbox.checked = false;
    }

    verificarBotaoSolicitar();
}

// Verifica se há serviços no carrinho para exibir ou ocultar o botão "Solicitar"
function verificarBotaoSolicitar() {
    const listaCarrinho = document.getElementById("listaCarrinho");
    const btnSolicitar = document.getElementById("btnSolicitar");

    if (listaCarrinho.children.length > 0) {
        btnSolicitar.style.display = "block";
    } else {
        btnSolicitar.style.display = "none";
    }
}
