<?php if (isset($_SESSION['mensagem_erro'])): ?>
    <div id="mensagem-erro" class="alert alert-danger mt-5 d-flex justify-content-between" role="alert">
        <?= $_SESSION['mensagem_erro'] ?>
        <button type="button" class="btn-close" aria-label="Close" onclick="this.parentElement.style.display='none';">
            <span aria-hidden="true"></span>
        </button>
    </div>
    <?php unset($_SESSION['mensagem_erro']); ?>
<?php endif; ?>
<!-- Mensagem de sucesso -->
<?php if (isset($_SESSION['mensagem_sucesso'])): ?>
    <div id="mensagem-sucesso" class="alert alert-success mt-5 d-flex justify-content-between" role="alert">
        <?= $_SESSION['mensagem_sucesso'] ?>
        <button type="button" class="btn-close" aria-label="Close" onclick="this.parentElement.style.display='none';">
            <span aria-hidden="true"></span>
        </button>
    </div>
    <?php unset($_SESSION['mensagem_sucesso']); ?>
<?php endif; ?>
<script>
    // Ocultar a mensagem de sucesso 2s e de erro após 4 segundos
    document.addEventListener('DOMContentLoaded', function () {
        const mensagemSucesso = document.getElementById('mensagem-sucesso');
        const mensagemErro = document.getElementById('mensagem-erro');
        if (mensagemSucesso) {
            setTimeout(() => {
                mensagemSucesso.style.transition = 'opacity 0.5s';
                mensagemSucesso.style.opacity = '0';
                setTimeout(() => mensagemSucesso.remove(), 500); // Remove completamente o elemento
            }, 2000); // 2000 ms = 2 segundos
        } else if (mensagemErro) {
            setTimeout(() => {
                mensagemErro.style.transition = 'opacity 0.5s';
                mensagemErro.style.opacity = '0';
                setTimeout(() => mensagemErro.remove(), 500); // Remove completamente o elemento
            }, 4000); // 4000 ms = 4 segundos
        }
    });
</script
