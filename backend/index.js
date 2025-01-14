import express from "express";
import env from "./src/environment.js";
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import horarioRoutes from "./src/routes/horarioRoutes.js";
import agendamentoRoutes from "./src/routes/agendamentoRoutes.js";
import servicoRoutes from "./src/routes/servicoRoutes.js"; // Importa as rotas de serviços
import categoriaRoutes from "./src/routes/categoriaRoutes.js"; // Importa as rotas de categorias

const app = express();
const PORT = env.PORT || 3000; // Usa a porta do arquivo .env ou 3000 como padrão

// Configuração do Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/horarios", horarioRoutes);
app.use("/api/agendamentos", agendamentoRoutes);
app.use("/api/servicos", servicoRoutes); // Adiciona a rota de serviços
app.use("/api/categorias", categoriaRoutes); // Adiciona a rota de categorias

// Middleware de erro
app.use((err, req, res, next) => {
    console.error("Erro no servidor:", err.message);
    res.status(500).send("Erro no servidor");
});

// Ativar o servidor e exibir mensagem no console
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
