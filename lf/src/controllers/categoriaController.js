import { PrismaClient } from "@prisma/client";
import { body, param, validationResult } from "express-validator";

const prisma = new PrismaClient();

class CategoriaController {
    // Criar uma nova categoria
    async criar(req, res) {
        await body("nome").isString().notEmpty().withMessage("O nome da categoria é obrigatório").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nome } = req.body;

        try {
            const categoria = await prisma.categoria.create({
                data: {
                    nome,
                },
            });

            return res.status(201).json(categoria);
        } catch (error) {
            console.error(`Erro ao criar categoria: ${error.message}`);
            return res.status(500).send("Erro ao criar a categoria");
        }
    }

    // Listar todas as categorias
    async listar(req, res) {
        try {
            const categorias = await prisma.categoria.findMany({
                include: { servicos: true }, // Inclui os serviços relacionados, se necessário
            });

            return res.status(200).json(categorias);
        } catch (error) {
            console.error(`Erro ao listar categorias: ${error.message}`);
            return res.status(500).send("Erro ao listar categorias");
        }
    }

    // Buscar categoria por ID
    async buscarPorId(req, res) {
        await param("id").isInt().withMessage("O ID deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const categoria = await prisma.categoria.findUnique({
                where: { id: parseInt(id) },
                include: { servicos: true }, // Inclui os serviços relacionados
            });

            if (!categoria) {
                return res.status(404).send("Categoria não encontrada");
            }

            return res.status(200).json(categoria);
        } catch (error) {
            console.error(`Erro ao buscar categoria por ID: ${error.message}`);
            return res.status(500).send("Erro ao buscar categoria");
        }
    }

    // Atualizar uma categoria
    async atualizar(req, res) {
        await param("id").isInt().withMessage("O ID deve ser um número inteiro").run(req);
        await body("nome").isString().optional().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { nome } = req.body;

        try {
            const categoriaAtualizada = await prisma.categoria.update({
                where: { id: parseInt(id) },
                data: {
                    nome: nome || undefined,
                },
            });

            return res.status(200).json(categoriaAtualizada);
        } catch (error) {
            console.error(`Erro ao atualizar categoria: ${error.message}`);
            return res.status(500).send("Erro ao atualizar a categoria");
        }
    }

    // Deletar uma categoria
    async deletar(req, res) {
        await param("id").isInt().withMessage("O ID deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await prisma.categoria.delete({
                where: { id: parseInt(id) },
            });

            return res.status(200).send("Categoria deletada com sucesso");
        } catch (error) {
            console.error(`Erro ao deletar categoria: ${error.message}`);
            return res.status(500).send("Erro ao deletar a categoria");
        }
    }
}

export default new CategoriaController();
