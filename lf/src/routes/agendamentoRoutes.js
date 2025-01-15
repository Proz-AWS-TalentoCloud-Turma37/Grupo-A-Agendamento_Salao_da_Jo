import express from "express";
import AgendamentoController from "../controllers/agendamentoController.js";

const router = express.Router();

// Rotas de agendamentos
router.post("/", AgendamentoController.criar);          // Criar agendamento
router.get("/", AgendamentoController.listar);          // Listar todos os agendamentos
router.get("/:id", AgendamentoController.buscarPorId);  // Buscar agendamento por ID
router.put("/:id", AgendamentoController.atualizar);    // Atualizar agendamento
router.delete("/:id", AgendamentoController.deletar);   // Deletar agendamento

export default router;
