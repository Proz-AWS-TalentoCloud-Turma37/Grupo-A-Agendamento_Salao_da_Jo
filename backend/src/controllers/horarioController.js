import { PrismaClient } from "@prisma/client";
import { body, param, validationResult } from "express-validator";
import dayjs from "dayjs";
import jwt from "jsonwebtoken";
import env from "../environment.js"; // Arquivo contendo JWT_SECRET

const prisma = new PrismaClient();

class HorarioController {
    // Criar horários automaticamente com base no intervalo e duração
    async criar(req, res) {
        // Verificar se o usuário tem permissão para criar horários
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(403).send("Acesso negado");

        let profissionalId;
        try {
            const decoded = jwt.verify(token, env.JWT_SECRET);
            if (decoded.tipo !== "PROFISSIONAL" && decoded.tipo !== "ADMINISTRADOR") {
                return res.status(403).send("Apenas profissionais ou administradores podem cadastrar horários");
            }
            profissionalId = decoded.id; // Pega o ID do usuário logado
        } catch (error) {
            return res.status(403).send("Token inválido");
        }

        // Validando os dados recebidos
        await body("data").isISO8601().withMessage("Data inválida").run(req);
        await body("horaInicio").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("Hora de início inválida").run(req);
        await body("horaFim").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage("Hora de término inválida").run(req);
        await body("duracaoServico").isInt({ min: 1 }).withMessage("Duração do serviço deve ser maior que zero").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { data, horaInicio, horaFim, duracaoServico } = req.body;

        try {
            // Converter para objetos de data com dayjs
            const inicio = dayjs(`${data}T${horaInicio}:00`);
            const fim = dayjs(`${data}T${horaFim}:00`);

            if (!inicio.isBefore(fim)) {
                return res.status(400).send("Hora de início deve ser antes da hora de término");
            }

            // Verificar se já existem horários cadastrados nesse intervalo
            const existeHorario = await prisma.horario.findFirst({
                where: {
                    profissionalId,
                    dataHora: {
                        gte: inicio.toDate(),
                        lte: fim.toDate(),
                    }
                }
            });

            if (existeHorario) {
                return res.status(400).send("Já existem horários cadastrados para esse profissional nesse período");
            }

            const horarios = [];
            let atual = inicio;

            // Gerar os horários dentro do intervalo
            while (atual.isBefore(fim)) {
                horarios.push({
                    dataHora: atual.toDate(),
                    disponivel: true,
                    profissionalId,
                });
                atual = atual.add(duracaoServico, 'minute');
            }

            // Criar os horários no banco de dados
            await prisma.horario.createMany({ data: horarios });
            return res.status(201).json({ message: "Horários criados com sucesso", horarios });
        } catch (error) {
            console.error(`Erro ao criar horários: ${error.message}`);
            return res.status(500).send("Erro ao criar os horários");
        }
    }

    // Listar horários disponíveis
    async listar(req, res) {
        try {
            const horarios = await prisma.horario.findMany({
                where: { disponivel: true },
                include: { profissional: true }, // Inclui informações do profissional
            });

            return res.status(200).json(horarios);
        } catch (error) {
            console.error(`Erro ao listar horários disponíveis: ${error.message}`);
            return res.status(500).send("Erro ao listar horários disponíveis");
        }
    }

    // Buscar horário por ID
    async buscarPorId(req, res) {
        await param("id").isInt().withMessage("ID deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const horario = await prisma.horario.findUnique({
                where: { id: parseInt(id) },
                include: { profissional: true }, // Inclui informações do profissional
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

    // Atualizar um horário (Apenas para alterar disponibilidade)
    async atualizar(req, res) {
        // Validação de ID
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
        // Validação de ID
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
