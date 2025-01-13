import { PrismaClient } from "@prisma/client";
import { body, param, validationResult } from "express-validator";

const prisma = new PrismaClient();

class HorarioController {
    // Criar um novo horário
    async criar(req, res) {
        // Validando dados com express-validator
        await body("dataHora").isISO8601().withMessage("Data e hora inválidas").toDate().run(req);
        await body("cabeleireiraId").isInt().withMessage("ID da cabeleireira deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { dataHora, cabeleireiraId } = req.body;

        try {
            // Criar o horário
            const horario = await prisma.horario.create({
                data: {
                    dataHora,
                    disponivel: true,
                    cabelereiraId: parseInt(cabeleireiraId),
                },
            });

            return res.status(201).json(horario);
        } catch (error) {
            console.error(`Erro ao criar horário: ${error.message}`);
            return res.status(500).send("Erro ao criar o horário");
        }
    }

    // Listar horários disponíveis
    async listar(req, res) {
        try {
            const horarios = await prisma.horario.findMany({
                where: { disponivel: true },
                include: { cabelereira: true },
            });

            return res.status(200).json(horarios);
        } catch (error) {
            console.error(`Erro ao listar horários disponíveis: ${error.message}`);
            return res.status(500).send("Erro ao listar horários disponíveis");
        }
    }

    // Buscar horário por ID
    async buscarPorId(req, res) {
        // Validação de ID com express-validator
        await param("id").isInt().withMessage("ID deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const horario = await prisma.horario.findUnique({
                where: { id: parseInt(id) },
                include: { cabelereira: true },
            });

            if (!horario) {
                return res.status(404).send("Horário não encontrado");
            }

            return res.status(200).json(horario);
        } catch (error) {
            console.error(`Erro ao buscar horário por ID: ${error.message}`);
            return res.status(500).send("Erro ao buscar horário");
        }
    }

    // Atualizar um horário
    async atualizar(req, res) {

        await param("id").isInt().withMessage("ID deve ser um número inteiro").run(req);
        await body("disponivel").isBoolean().withMessage("Disponível deve ser um valor booleano").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { disponivel } = req.body;

        try {
            const horarioAtualizado = await prisma.horario.update({
                where: { id: parseInt(id) },
                data: { disponivel },
            });

            return res.status(200).json(horarioAtualizado);
        } catch (error) {
            console.error(`Erro ao atualizar horário: ${error.message}`);
            return res.status(500).send("Erro ao atualizar horário");
        }
    }

    // Deletar um horário
    async deletar(req, res) {
        // Validação de ID com express-validator
        await param("id").isInt().withMessage("ID deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            await prisma.horario.delete({ where: { id: parseInt(id) } });
            return res.status(200).send("Horário deletado com sucesso");
        } catch (error) {
            console.error(`Erro ao deletar horário: ${error.message}`);
            return res.status(500).send("Erro ao deletar horário");
        }
    }
}

export default new HorarioController();
