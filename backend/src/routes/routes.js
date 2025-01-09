import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import UserController from "../controllers/UserController.js";
import PostController from "../controllers/PostController.js";
import autenticarToken from "../middleware/authenticateToken.js";  // Middleware de autenticação

const prisma = new PrismaClient();
const userController = new UserController();
const postController = new PostController();
const router = express.Router();

// Rota de login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;  // Alterado para "password"
    try {
        const usuario = await prisma.user.findUnique({ where: { email } });
        if (usuario && bcrypt.compareSync(password, usuario.password)) {  // Alterado para "password"
            const token = jwt.sign(
                { userId: usuario.id, name: usuario.name, role: usuario.role },  // Alterado para "name"
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            res.json({ token });
        } else {
            res.status(401).send("Credenciais inválidas");
        }
    } catch (error) {
        res.status(500).send("Erro no servidor");
    }
});

// Rotas do UserController
router.post("/usuarios", userController.criar);  // Criar usuário
router.get("/usuarios", autenticarToken, userController.listar);  // Listar todos os usuários
router.get("/usuarios/:id", autenticarToken, userController.buscarPorId);  // Buscar usuário por ID
router.put("/usuarios/:id", autenticarToken, userController.atualizar);  // Atualizar usuário por ID
router.delete("/usuarios/:id", autenticarToken, userController.deletar);  // Deletar usuário por ID
router.put("/usuarios/:id/role", autenticarToken, userController.definirRole);  // Definir role do usuário

// Rotas do PostController
router.post("/posts", autenticarToken, postController.criar);  // Criar post
router.get("/posts", postController.listar);  // Listar todos os posts
router.get("/posts/:id", postController.buscarPorId);  // Buscar post por ID
router.put("/posts/:id", autenticarToken, postController.atualizar);  // Atualizar post por ID
router.delete("/posts/:id", autenticarToken, postController.deletar);  // Deletar post por ID

export default router;
