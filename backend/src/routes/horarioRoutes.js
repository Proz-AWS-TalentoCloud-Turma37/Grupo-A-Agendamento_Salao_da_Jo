import express from "express";
import HorarioController from "../controllers/horarioController.js";

import jwt from "jsonwebtoken";
import env from "../environment.js"; // Certifique-se de que environment.js contém JWT_SECRET

const router = express.Router();

// Middleware para autenticação e autorização
function verificarToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).send("Acesso negado");

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);
        req.user = decoded; // Adiciona o usuário decodificado na requisição
        next();
    } catch (error) {
        return res.status(403).send("Token inválido");
    }
}

// Middleware para verificar se o usuário é um profissional ou administrador
function verificarPermissao(req, res, next) {
    if (req.user.tipo !== "PROFISSIONAL" && req.user.tipo !== "ADMINISTRADOR") {
        return res.status(403).send("Apenas profissionais ou administradores podem acessar essa rota");
    }
    next();
}

// Rotas de horários
router.post("/", verificarToken, verificarPermissao, HorarioController.criar); // Criar horário (Somente Profissional/Admin)
router.get("/", HorarioController.listar); // Listar todos os horários disponíveis (Qualquer usuário)
router.get("/:id", HorarioController.buscarPorId); // Buscar horário por ID (Qualquer usuário)
router.put("/:id", verificarToken, verificarPermissao, HorarioController.atualizar); // Atualizar horário (Somente Profissional/Admin)
router.delete("/:id", verificarToken, verificarPermissao, HorarioController.deletar); // Deletar horário (Somente Profissional/Admin)

export default router;
