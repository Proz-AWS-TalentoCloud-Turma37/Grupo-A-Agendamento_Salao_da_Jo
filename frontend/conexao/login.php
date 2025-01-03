<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Conexão com o banco de dados
    $mysqli = new mysqli("localhost", "root", "", "salao");

    if ($mysqli->connect_error) {
        die("Erro ao conectar ao banco de dados: " . $mysqli->connect_error);
    }

    // Captura os dados enviados pelo formulário
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // Verifica se os campos estão preenchidos
    if (empty($username) || empty($password)) {
        header("Location: ../sing_in.php?error=Preencha todos os campos");
        exit;
    }

    // Prepara a consulta SQL para buscar o usuário pelo username
    $stmt = $mysqli->prepare("SELECT id, nome, password_hash, nivel_acesso FROM usuarios WHERE username = ?");
    if (!$stmt) {
        die("Erro na preparação da consulta: " . $mysqli->error);
    }

    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    // Verifica se o usuário existe
    if ($stmt->num_rows === 1) {
        $stmt->bind_result($id, $nome, $stored_password_hash, $nivel_acesso);
        $stmt->fetch();

        // Verifica a senha usando password_verify
        if (password_verify($password, $stored_password_hash)) {
            // Inicia a sessão do usuário
            $_SESSION['user_id'] = $id;
            $_SESSION['username'] = $username;
            $_SESSION['nome'] = $nome; // Armazena o nome completo na sessão
            $_SESSION['nivel_acesso'] = $nivel_acesso;

            // Redireciona com base no nível de acesso
            if ($nivel_acesso == 1) {
                header("Location: ../areaSegura/admin/admin_dashboard.php");
            } else if ($nivel_acesso == 0) {
                header("Location: ../areaSegura/user/user_dashboard.php");
            }
            exit;
        } else {
            // Senha incorreta
            header("Location: ../sing_in.php?error=Senha incorreta");
            exit;
        }
    } else {
        // Usuário não encontrado
        header("Location: ../sing_in.php?error=Usuário não encontrado");
        exit;
    }

    // Fecha a conexão com o banco de dados
    $stmt->close();
    $mysqli->close();
} else {
    // Se não for uma requisição POST, redirecione para o login
    header("Location: ../sing_in.php");
    exit;
}
?>