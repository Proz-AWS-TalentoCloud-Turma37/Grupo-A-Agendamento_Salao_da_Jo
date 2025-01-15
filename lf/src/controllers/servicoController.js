import { PrismaClient } from "@prisma/client";
import { body, param, validationResult } from "express-validator";

const prisma = new PrismaClient();

class ServicoController {
    // Criar um novo serviço
    async criar(req, res) {
        await body("titulo").isString().notEmpty().withMessage("O título é obrigatório").run(req);
        await body("descricao").isString().optional().run(req);
        await body("duracao").isInt().withMessage("A duração deve ser um número inteiro").run(req);
        await body("valor").isFloat().withMessage("O valor deve ser um número").run(req);
        await body("categoriaId").isInt().withMessage("ID da categoria deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { titulo, descricao, duracao, valor, categoriaId } = req.body;

        try {
            const servico = await prisma.servico.create({
                data: {
                    titulo,
                    descricao: descricao || null,
                    duracao,
                    valor: parseFloat(valor),
                    categoriaId: parseInt(categoriaId),
                },
            });

            return res.status(201).json(servico);
        } catch (error) {
            console.error(`Erro ao criar serviço: ${error.message}`);
            return res.status(500).send("Erro ao criar o serviço");
        }
    }

    // Listar todos os serviços (opcionalmente filtrados por categoria)
    async listar(req, res) {
        const { categoriaId } = req.query;

        try {
            const filtros = categoriaId ? { categoriaId: parseInt(categoriaId) } : {};
            const servicos = await prisma.servico.findMany({
                where: filtros,
                include: { categoria: true },
            });

            return res.status(200).json(servicos);
        } catch (error) {
            console.error(`Erro ao listar serviços: ${error.message}`);
            return res.status(500).send("Erro ao listar serviços");
        }
    }

    // Buscar serviço por ID
    async buscarPorId(req, res) {
        await param("id").isInt().withMessage("O ID deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const servico = await prisma.servico.findUnique({
                where: { id: parseInt(id) },
                include: { categoria: true },
            });

            if (!servico) {
                return res.status(404).send("Serviço não encontrado");
            }

            return res.status(200).json(servico);
        } catch (error) {
            console.error(`Erro ao buscar serviço por ID: ${error.message}`);
            return res.status(500).send("Erro ao buscar serviço");
        }
    }

    // Atualizar um serviço
    async atualizar(req, res) {
        await param("id").isInt().withMessage("O ID deve ser um número inteiro").run(req);
        await body("titulo").isString().optional().run(req);
        await body("descricao").isString().optional().run(req);
        await body("duracao").isInt().optional().run(req);
        await body("valor").isFloat().optional().run(req);
        await body("categoriaId").isInt().optional().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { titulo, descricao, duracao, valor, categoriaId } = req.body;

        try {
            const servicoAtualizado = await prisma.servico.update({
                where: { id: parseInt(id) },
                data: {
                    titulo: titulo || undefined,
                    descricao: descricao || undefined,
                    duracao: duracao || undefined,
                    valor: valor ? parseFloat(valor) : undefined,
                    categoriaId: categoriaId ? parseInt(categoriaId) : undefined,
                },
            });

            return res.status(200).json(servicoAtualizado);
        } catch (error) {
            console.error(`Erro ao atualizar serviço: ${error.message}`);
            return res.status(500).send("Erro ao atualizar o serviço");
        }
    }

    // Deletar um serviço
    async deletar(req, res) {
        await param("id").isInt().withMessage("O ID deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await prisma.servico.delete({ where: { id: parseInt(id) } });
            return res.status(200).send("Serviço deletado com sucesso");
        } catch (error) {
            console.error(`Erro ao deletar serviço: ${error.message}`);
            return res.status(500).send("Erro ao deletar o serviço");
        }
    }
}

export default new ServicoController();
