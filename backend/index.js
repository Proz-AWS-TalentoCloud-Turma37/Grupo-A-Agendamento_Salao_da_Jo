import env from "./src/environment.js";
import express from "express";
import { PrismaClient } from "@prisma/client"; // Importa o Prisma Client

const app = express();
const prisma = new PrismaClient(); // Instância do Prisma Client

// Configurações básicas do Express
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// Testar conexão com o banco de dados
async function testDatabaseConnection() {
    try {
        console.log("Testando conexão com o banco de dados...");
        await prisma.$connect(); // Conecta ao banco
        console.log("Conexão com o banco de dados bem-sucedida!");
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:", error.message);
    } finally {
        await prisma.$disconnect(); // Fecha a conexão após o teste
    }
}

// Chamar a função de teste ao iniciar o servidor
testDatabaseConnection();

// Aplicar todas as rotas (ainda não implementadas)
app.use("/", (req, res) => {
    res.send("API funcionando, mas rotas ainda não configuradas.");
});

// Middleware de tratamento de erro
app.use((err, req, res, next) => {
    console.error("Erro no servidor:", err.message);
    res.status(500).send("Erro no servidor");
});

// Iniciar o servidor
app.listen(env.PORT, () => {
    console.log(`Servidor ativo na porta ${env.PORT}`);
});
