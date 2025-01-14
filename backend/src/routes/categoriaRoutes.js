import express from "express";
import CategoriaController from "../controllers/categoriaController.js";

const router = express.Router();

// Rotas de categorias
router.post("/", CategoriaController.criar);              // Criar categoria
router.get("/", CategoriaController.listar);              // Listar categorias
router.get("/:id", CategoriaController.buscarPorId);      // Buscar categoria por ID
router.put("/:id", CategoriaController.atualizar);        // Atualizar categoria
router.delete("/:id", CategoriaController.deletar);       // Deletar categoria

export default router;
