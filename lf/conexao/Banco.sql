CREATE DATABASE salao;
-- Criação da tabela de usuários (caso esteja implementada para controle de login)

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,        -- Primeiro nome
    sobrenome VARCHAR(50) NOT NULL,   -- Sobrenome
    username VARCHAR(50) NOT NULL UNIQUE, -- Armazena o e-mail
    celular VARCHAR(15),
    whatsapp VARCHAR(15),
    endereco VARCHAR(255),
    estado VARCHAR(50),
    cidade VARCHAR(50),
    cpf VARCHAR(14) UNIQUE,
    data_nascimento DATE,
    password_hash VARCHAR(255) NOT NULL,
    nivel_acesso TINYINT DEFAULT 0
);

-- Criação da tabela de categorias
CREATE TABLE categorias (
    cat_id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL
) 

CREATE TABLE servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(255) NOT NULL,
    imagem VARCHAR(255) NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT NOT NULL,
    observacao TEXT,
    duracao INT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    categoria_id INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(cat_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
)

CREATE TABLE depoimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,                   -- Chave estrangeira para usuários
    comentario TEXT NOT NULL,               -- Texto do depoimento
    aprovacao INT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Data de criação
    FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
