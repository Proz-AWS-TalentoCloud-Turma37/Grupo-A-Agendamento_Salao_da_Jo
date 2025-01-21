import cors from "cors";
import express from "express";
import path from "path";
import env from "./src/environment.js";
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import horarioRoutes from "./src/routes/horarioRoutes.js";
import agendamentoRoutes from "./src/routes/agendamentoRoutes.js";
import servicoRoutes from "./src/routes/servicoRoutes.js"; // Importa as rotas de serviços
import categoriaRoutes from "./src/routes/categoriaRoutes.js"; // Importa as rotas de categorias
import indexRoutes from "./src/routes/indexRoutes.js";

const app = express();
const PORT = env.PORT || 3000;

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(process.cwd(), "frontend")));

// Configuração do CORS
app.use(cors());

// Configuração do Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas públicas (index e similares)
app.use("/", indexRoutes);

// Rotas protegidas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/horarios", horarioRoutes);
app.use("/api/agendamentos", agendamentoRoutes);
app.use("/api/servicos", servicoRoutes);
app.use("/api/categorias", categoriaRoutes);

// Middleware de erro
app.use((err, req, res, next) => {
    console.error("Erro no servidor:", err.message);
    res.status(500).send("Erro no servidor");
});

// Ativar o servidor e exibir mensagem no console
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
