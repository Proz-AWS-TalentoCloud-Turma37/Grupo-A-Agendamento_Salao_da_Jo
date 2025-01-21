import { PrismaClient } from "@prisma/client";
import { body, param, validationResult } from "express-validator";

const prisma = new PrismaClient();

class AgendamentoController {
    // Criar um agendamento
    async criar(req, res) {
        // Validar dados com express-validator
        await body("horarioId").isInt().withMessage("ID do horário deve ser um número inteiro").run(req);
        await body("clienteId").isInt().withMessage("ID do cliente deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { horarioId, clienteId, observacao } = req.body;

        try {
            // Verificar se o horário está disponível
            const horario = await prisma.horario.findUnique({
                where: { id: parseInt(horarioId) },
            });

            if (!horario || !horario.disponivel) {
                return res.status(400).send("Horário não está disponível");
            }

            // Criar o agendamento
            const agendamento = await prisma.agendamento.create({
                data: {
                    horarioId: parseInt(horarioId),
                    clienteId: parseInt(clienteId),
                    observacao: observacao || null,
                },
            });

            // Marcar o horário como indisponível
            await prisma.horario.update({
                where: { id: parseInt(horarioId) },
                data: { disponivel: false },
            });

            return res.status(201).json(agendamento);
        } catch (error) {
            console.error(`Erro ao criar agendamento: ${error.message}`);
            return res.status(500).send("Erro ao criar agendamento");
        }
    }

    // Listar todos os agendamentos
    async listar(req, res) {
        try {
            const agendamentos = await prisma.agendamento.findMany({
                include: {
                    horario: { include: { profissional: true } }, // Inclui informações do profissional e horário
                    cliente: true, // Inclui informações do cliente
                },
            });

            return res.status(200).json(agendamentos);
        } catch (error) {
            console.error(`Erro ao listar agendamentos: ${error.message}`);
            return res.status(500).send("Erro ao listar agendamentos");
        }
    }

    // Buscar agendamento por ID
    async buscarPorId(req, res) {
        // Validação de ID com express-validator
        await param("id").isInt().withMessage("ID deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const agendamento = await prisma.agendamento.findUnique({
                where: { id: parseInt(id) },
                include: {
                    horario: { include: { profissional: true } }, // Inclui informações do profissional
                    cliente: true, // Inclui informações do cliente
                },
            });

            if (!agendamento) {
                return res.status(404).send("Agendamento não encontrado");
            }

            return res.status(200).json(agendamento);
        } catch (error) {
            console.error(`Erro ao buscar agendamento por ID: ${error.message}`);
            return res.status(500).send("Erro ao buscar agendamento");
        }
    }

    // Atualizar um agendamento
    async atualizar(req, res) {
        // Validação de dados com express-validator
        await param("id").isInt().withMessage("ID deve ser um número inteiro").run(req);
        await body("observacao").optional().isString().withMessage("Observação deve ser um texto").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { observacao } = req.body;

        try {
            const agendamentoAtualizado = await prisma.agendamento.update({
                where: { id: parseInt(id) },
                data: { observacao },
            });

            return res.status(200).json(agendamentoAtualizado);
        } catch (error) {
            console.error(`Erro ao atualizar agendamento: ${error.message}`);
            return res.status(500).send("Erro ao atualizar agendamento");
        }
    }

    // Deletar (cancelar) um agendamento
    async deletar(req, res) {
        // Validação de ID com express-validator
        await param("id").isInt().withMessage("ID deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const agendamento = await prisma.agendamento.findUnique({
                where: { id: parseInt(id) },
                include: { horario: true },
            });

            if (!agendamento) {
                return res.status(404).send("Agendamento não encontrado");
            }

            // Excluir o agendamento
            await prisma.agendamento.delete({ where: { id: parseInt(id) } });

            // Liberar o horário associado
            await prisma.horario.update({
                where: { id: agendamento.horarioId },
                data: { disponivel: true },
            });

            return res.status(200).send("Agendamento cancelado com sucesso");
        } catch (error) {
            console.error(`Erro ao deletar agendamento: ${error.message}`);
            return res.status(500).send("Erro ao deletar agendamento");
        }
    }
}

export default new AgendamentoController();
