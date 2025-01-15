import express from "express";
import HorarioController from "../controllers/horarioController.js";

const router = express.Router();

// Verifique se todas as funções do HorarioController estão definidas
if (!HorarioController.criar || !HorarioController.listar || !HorarioController.buscarPorId || !HorarioController.atualizar || !HorarioController.deletar) {
    throw new Error("Uma ou mais funções do HorarioController não estão definidas");
}

// Rotas de horários
router.post("/", HorarioController.criar);          // Criar horário
router.get("/", HorarioController.listar);          // Listar todos os horários
router.get("/:id", HorarioController.buscarPorId);  // Buscar horário por ID
router.put("/:id", HorarioController.atualizar);    // Atualizar horário
router.delete("/:id", HorarioController.deletar);   // Deletar horário

export default router;