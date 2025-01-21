import express from "express";
import UsuarioController from "../controllers/usuarioController.js";

const router = express.Router();

// Rotas de usuários
router.post("/", UsuarioController.criar);          // Criar usuário
router.get("/", UsuarioController.listar);          // Listar todos os usuários
router.get("/:id", UsuarioController.buscarPorId);  // Buscar usuário por ID
router.put("/:id", UsuarioController.atualizar);    // Atualizar usuário
router.delete("/:id", UsuarioController.deletar);   // Deletar usuário

// Adicionar rota para login
router.post("/login", UsuarioController.login);

export default router;
