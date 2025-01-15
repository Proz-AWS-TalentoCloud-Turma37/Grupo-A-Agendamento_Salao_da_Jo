<?php
// Verifica se o formulário foi enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Configura a conexão com o banco de dados usando PDO
    try {
        $pdo = new PDO("mysql:host=localhost;dbname=salao", "root", "");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        die("Erro ao conectar ao banco de dados: " . $e->getMessage());
    }

    // Recebe os dados do formulário
    $nome = trim($_POST['nome']);
    $sobrenome = trim($_POST['sobrenome']);
    $username = trim($_POST['username']); // O e-mail do usuário
    $celular = trim($_POST['celular']);
    $whatsapp = trim($_POST['whatsapp']);
    $endereco = trim($_POST['endereco']);
    $estado = trim($_POST['estado']);
    $cidade = trim($_POST['cidade']);
    $cpf = trim($_POST['cpf']);
    $data_nascimento = trim($_POST['data_nascimento']);
    $senha = trim($_POST['senha']);

    try {
        // Criptografa a senha
        $password_hash = password_hash($senha, PASSWORD_DEFAULT);

        // Prepara o comando SQL para inserção
        $sql = "INSERT INTO usuarios (nome, sobrenome, username, celular, whatsapp, endereco, estado, cidade, cpf, data_nascimento, password_hash)
                VALUES (:nome, :sobrenome, :username, :celular, :whatsapp, :endereco, :estado, :cidade, :cpf, :data_nascimento, :password_hash)";

        // Prepara a execução no banco de dados
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':nome' => $nome,
            ':sobrenome' => $sobrenome,
            ':username' => $username,
            ':celular' => $celular,
            ':whatsapp' => $whatsapp,
            ':endereco' => $endereco,
            ':estado' => $estado,
            ':cidade' => $cidade,
            ':cpf' => $cpf,
            ':data_nascimento' => $data_nascimento,
            ':password_hash' => $password_hash
        ]);

        // Redireciona para a página de sucesso ou exibe uma mensagem
        header("Location: ../sing_in.php");
        exit;
    } catch (PDOException $e) {
        // Trata erros de chave única violada
        if ($e->getCode() == 23000) {
            echo "Erro: O e-mail ou CPF já está cadastrado.";
        } else {
            echo "Erro ao cadastrar: " . $e->getMessage();
        }
    }
} else {
    // Caso o acesso não seja via POST, redireciona para o formulário
    header("Location: ../sing_up.php");
    exit;
}
?>
