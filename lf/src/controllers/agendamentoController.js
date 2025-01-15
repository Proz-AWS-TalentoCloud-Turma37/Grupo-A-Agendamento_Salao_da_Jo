import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class AgendamentoController {
    // Criar um agendamento
    async criar(req, res) {
        const { horarioId, clienteId, observacao } = req.body;

        try {
            if (!horarioId || !clienteId) {
                return res.status(400).send("ID do horário e ID do cliente são obrigatórios");
            }

            // Verificar se o horário está disponível
            const horario = await prisma.horario.findUnique({ where: { id: parseInt(horarioId) } });

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
                include: { horario: true },
            });

            return res.status(200).json(agendamentos);
        } catch (error) {
            console.error(`Erro ao listar agendamentos: ${error.message}`);
            return res.status(500).send("Erro ao listar agendamentos");
        }
    }

    // Buscar agendamento por ID
    async buscarPorId(req, res) {
        const { id } = req.params;

        try {
            const agendamento = await prisma.agendamento.findUnique({
                where: { id: parseInt(id) },
                include: { horario: true }, // Inclui informações do horário no resultado
 // Inclui informações do horário no resultado
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
