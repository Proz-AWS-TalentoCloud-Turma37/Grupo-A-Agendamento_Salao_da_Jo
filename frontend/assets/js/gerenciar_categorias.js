const apiUrl = 'http://localhost:3000/api/categorias';

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

// Função para listar categorias
async function getCategories() {
    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao listar categorias');
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao listar categorias:', error);
        showMessage('Erro ao listar categorias.', 'danger');
        return [];
    }
}

// Função para criar uma nova categoria
async function createCategory(categoryData) {
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoryData),
        });

        if (!response.ok) {
            throw new Error('Falha ao criar categoria');
        }

        showMessage('Categoria criada com sucesso!', 'success');
        refreshCategoryList();
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        showMessage('Erro ao criar categoria.', 'danger');
    }
}

// Função para atualizar uma categoria
async function updateCategory(categoryId, updatedData) {
    try {
        const response = await fetch(`${apiUrl}/${categoryId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
            throw new Error('Falha ao atualizar categoria');
        }

        showMessage('Categoria atualizada com sucesso!', 'success');
        refreshCategoryList();
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        showMessage('Erro ao atualizar categoria.', 'danger');
    }
}

// Função para deletar uma categoria
async function deleteCategory(categoryId) {
    try {
        const response = await fetch(`${apiUrl}/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao deletar categoria');
        }

        showMessage('Categoria deletada com sucesso!', 'success');
        refreshCategoryList();
    } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        showMessage('Erro ao deletar categoria.', 'danger');
    }
}

// Função para exibir a lista de categorias
async function refreshCategoryList() {
    const categories = await getCategories();
    const categoryListDiv = document.getElementById('categoryList');
    categoryListDiv.innerHTML = '';

    categories.forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.classList.add('category-item');

        categoryDiv.innerHTML = `
            <p>Nome: ${category.nome}</p>
            <button class="btn btn-primary btn-sm" onclick="editCategory(${category.id})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id})">Excluir</button>
        `;

        categoryListDiv.appendChild(categoryDiv);
    });
}

// Função para editar uma categoria
async function editCategory(categoryId) {
    try {
        const response = await fetch(`${apiUrl}/${categoryId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao carregar categoria');
        }

        const category = await response.json();

        // Preenche os campos do modal com os dados da categoria
        document.getElementById('editCategoryId').value = category.id;
        document.getElementById('editCategoryName').value = category.nome;

        const editModal = new bootstrap.Modal(document.getElementById('editCategoryModal'));
        editModal.show();
    } catch (error) {
        console.error('Erro ao editar categoria:', error);
        showMessage('Erro ao carregar categoria.', 'danger');
    }
}

// Função para salvar as alterações de uma categoria
async function saveCategoryChanges() {
    const categoryId = document.getElementById('editCategoryId').value;
    const updatedCategory = {
        nome: document.getElementById('editCategoryName').value,
    };

    await updateCategory(categoryId, updatedCategory);

    const editModal = bootstrap.Modal.getInstance(document.getElementById('editCategoryModal'));
    editModal.hide();
}

// Inicializa a página
document.addEventListener('DOMContentLoaded', () => {
    refreshCategoryList();

    // Evento para criar nova categoria
    document.getElementById('createCategoryForm').addEventListener('submit', event => {
        event.preventDefault();
        const categoryName = document.getElementById('createCategoryName').value;
        createCategory({ nome: categoryName });
    });

    // Evento para salvar alterações em uma categoria
    document.getElementById('editCategoryForm').addEventListener('submit', event => {
        event.preventDefault();
        saveCategoryChanges();
    });
});
