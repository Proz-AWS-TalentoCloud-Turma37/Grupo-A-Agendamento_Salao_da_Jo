import { PrismaClient } from "@prisma/client";
import { body, param, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../environment.js";

const prisma = new PrismaClient();

class UsuarioController {
    // Middleware para verificar se o usuário é administrador
    isAdmin(req, res, next) {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(403).send("Acesso negado");
        }

        try {
            const decoded = jwt.verify(token, env.JWT_SECRET);
            if (decoded.tipo !== "ADMINISTRADOR") {
                return res.status(403).send("Acesso negado");
            }
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(403).send("Acesso negado");
        }
    }

    // Login do usuário
    async login(req, res) {
        const { email, senha } = req.body;

        try {
            if (!email || !senha) {
                return res.status(400).send("Email e senha são obrigatórios");
            }

            const usuario = await prisma.usuario.findUnique({ where: { email } });
            if (!usuario) {
                return res.status(401).send("Credenciais inválidas");
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).send("Credenciais inválidas");
            }

            const token = jwt.sign(
                { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
                env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            return res.status(200).json({ token });
        } catch (error) {
            console.error("Erro ao efetuar login:", error);
            return res.status(500).send("Erro no servidor");
        }
    }

    // Criar um novo usuário
    async criar(req, res) {
        await body("nome").notEmpty().withMessage("Nome é obrigatório").run(req);
        await body("email").isEmail().withMessage("Email inválido").run(req);
        await body("senha").isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres").run(req);
        await body("tipo")
            .isIn(["CLIENTE", "PROFISSIONAL", "ADMINISTRADOR"])
            .withMessage("Tipo de usuário inválido")
            .run(req);
        await body("cpf")
            .isLength({ min: 11, max: 14 })
            .withMessage("CPF inválido")
            .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
            .withMessage("Formato de CPF inválido")
            .run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nome, email, senha, celular, tipo, cpf } = req.body;

        try {
            const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
            if (usuarioExistente) {
                return res.status(400).send("Email já está em uso");
            }

            const cpfExistente = await prisma.usuario.findUnique({ where: { cpf } });
            if (cpfExistente) {
                return res.status(400).send("CPF já está em uso");
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            const usuario = await prisma.usuario.create({
                data: { nome, email, senha: senhaCriptografada, celular, tipo, cpf },
            });

            return res.status(201).json({
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo,
                cpf: usuario.cpf,
            });
        } catch (error) {
            console.error(`Erro ao criar usuário: ${error.message}`);
            return res.status(500).send("Erro ao criar o usuário");
        }
    }

    // Listar todos os usuários
    async listar(req, res) {
        try {
            const usuarios = await prisma.usuario.findMany({
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    celular: true,
                    tipo: true,
                    cpf: true,
                    createdAt: true,
                },
            });
            return res.status(200).json(usuarios);
        } catch (error) {
            console.error(`Erro ao listar usuários: ${error.message}`);
            return res.status(500).send("Erro ao listar usuários");
        }
    }

    // Buscar um usuário por ID
    async buscarPorId(req, res) {
        await param("id").isInt().withMessage("ID deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const usuario = await prisma.usuario.findUnique({
                where: { id: parseInt(id) },
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    celular: true,
                    tipo: true,
                    cpf: true,
                    createdAt: true,
                },
            });

            if (!usuario) {
                return res.status(404).send("Usuário não encontrado");
            }

            return res.status(200).json(usuario);
        } catch (error) {
            console.error(`Erro ao buscar usuário: ${error.message}`);
            return res.status(500).send("Erro ao buscar usuário");
        }
    }

    // Atualizar informações de um usuário
    async atualizar(req, res) {
        await param("id").isInt().withMessage("ID deve ser um número inteiro").run(req);
        await body("email").optional().isEmail().withMessage("Email inválido").run(req);
        await body("senha").optional().isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres").run(req);
        await body("cpf")
            .optional()
            .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
            .withMessage("Formato de CPF inválido")
            .run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { nome, email, senha, celular, tipo, cpf } = req.body;

        try {
            const dadosAtualizados = {
                nome: nome || undefined,
                email: email || undefined,
                celular: celular || undefined,
                tipo: tipo || undefined,
                cpf: cpf || undefined,
            };

            if (senha) {
                dadosAtualizados.senha = await bcrypt.hash(senha, 10);
            }

            const usuarioAtualizado = await prisma.usuario.update({
                where: { id: parseInt(id) },
                data: dadosAtualizados,
            });

            return res.status(200).json(usuarioAtualizado);
        } catch (error) {
            console.error(`Erro ao atualizar usuário: ${error.message}`);
            return res.status(500).send("Erro ao atualizar usuário");
        }
    }

    // Deletar um usuário
    async deletar(req, res) {
        const { id } = req.params;

        try {
            const usuario = await prisma.usuario.findUnique({ where: { id: parseInt(id) } });

            if (!usuario) {
                return res.status(404).send("Usuário não encontrado");
            }

            await prisma.usuario.delete({ where: { id: parseInt(id) } });

            return res.status(200).send("Usuário deletado com sucesso");
        } catch (error) {
            console.error(`Erro ao deletar usuário: ${error.message}`);
            return res.status(500).send("Erro ao deletar usuário");
        }
    }
}

export default new UsuarioController();