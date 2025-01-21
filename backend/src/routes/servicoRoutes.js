import express from "express";
import ServicoController from "../controllers/servicoController.js";

const router = express.Router();

// Rotas de serviços
router.post("/", ServicoController.criar);              // Criar serviço
router.get("/", ServicoController.listar);              // Listar serviços
router.get("/:id", ServicoController.buscarPorId);      // Buscar serviço por ID
router.put("/:id", ServicoController.atualizar);        // Atualizar serviço
router.delete("/:id", ServicoController.deletar);       // Deletar serviço

export default router;
