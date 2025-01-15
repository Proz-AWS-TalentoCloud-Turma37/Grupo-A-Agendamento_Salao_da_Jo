<?php
// Inicia a sessão
session_start();

// Destrói todas as sessões ativas
session_unset();
session_destroy();

// Redireciona para a página inicial ou de login
header("Location: ../index.php");
exit();
?>
