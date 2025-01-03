<?php
// Verifica o nível de acesso
define('ADMIN', 1);
define('USER', 0);

function menuSeguro($nivel_acesso, $usuario_logado) {
    // HTML do menu com estilo Bootstrap
    ?>
    <section container-fluid>
        <nav class="navbar navbar-expand-lg fixed-top bg-success bg-gradient">
            <div class="container-fluid">
                <div class="d-flex justify-content-start">
                    <a class="navbar-brand text-white" href="#">
                        Salão de Beleza
                    </a>
                </div>
                <div class="text-white d-flex justify-content-end">
                    <?php echo htmlspecialchars($_SESSION['nome']);?>
                </div>
                <div class="dropdown">
                    <button class="nav-link dropdown-toggle text-white" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-person-circle me-2 fs-4"></i> 
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">

                    <?php if ($nivel_acesso == ADMIN): ?>
                        <li>
                            <a class="dropdown-item" href="admin_dashboard.php"><i class="bi bi-house-check-fill"></i> Home</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="admin_servicos.php"><i class="bi bi-house-gear-fill"></i> Serviços</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="admin_relatorio.php"><i class="bi bi-graph-up-arrow"></i> Relatórios</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="admin_gerenciar_usuarios.php"><i class="bi bi-person-fill-gear"></i> Gerenciar Usuários</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="admin_agendamento.php"><i class="bi bi-person-lines-fill"></i> Agendamento</a>
                        </li>
                        <li>
                        <li>
                            <a class="dropdown-item" href="admin_perfil.php"><i class="bi bi-person-check-fill"></i> Meu Perfil</a>
                        </li>
                        <?php elseif ($nivel_acesso == USER): ?>
                        <li>
                            <a class="dropdown-item" href="user_dashboard.php"><i class="bi bi-house-check-fill"></i> Home</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="user_agendamento.php"><i class="bi bi-journal-bookmark-fill"></i> Agendamento</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="user_servicos.php"><i class="bi bi-house-gear-fill"></i> Serviços</a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="user_perfil.php"><i class="bi bi-person-check-fill"></i> Meu Perfil</a>
                        </li>
                    <?php endif; ?>
                        
                        <li>
                            <hr class="dropdown-divider">
                        </li>
                        <li>
                            <a class="dropdown-item" href="../../conexao/logout.php"><i class="bi bi-box-arrow-right"></i> Sair</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </section>
    <?php
}
// Exemplo de uso
menuSeguro(nivel_acesso: $_SESSION['nivel_acesso'], usuario_logado: $_SESSION['username']); // Exibe o menu com base no nível de acesso
?>
