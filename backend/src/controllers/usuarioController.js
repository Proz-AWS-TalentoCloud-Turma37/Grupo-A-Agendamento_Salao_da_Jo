import { PrismaClient } from "@prisma/client";
import { body, param, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "../environment.js";

const prisma = new PrismaClient();

class UsuarioController {
    // Login do usuário
    async login(req, res) {
        const { email, senha } = req.body;

        try {
            if (!email || !senha) {
                return res.status(400).send("Email e senha são obrigatórios");
            }

            // Verificar se o usuário existe
            const usuario = await prisma.usuario.findUnique({ where: { email } });
            if (!usuario) {
                return res.status(401).send("Credenciais inválidas");
            }

            // Validar a senha
            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).send("Credenciais inválidas");
            }

            // Gerar o token JWT
            const token = jwt.sign(
                { id: usuario.id, email: usuario.email, tipo: usuario.tipo },
                env.JWT_SECRET,
                { expiresIn: "1h" } // Token válido por 1 hora
            );

            return res.status(200).json({ token });
        } catch (error) {
            console.error("Erro ao efetuar login:", error);
            return res.status(500).send("Erro no servidor");
        }
    }

    // Criar um novo usuário
    async criar(req, res) {
        // Validação de dados com express-validator
        await body("nome").notEmpty().withMessage("Nome é obrigatório").run(req);
        await body("email").isEmail().withMessage("Email inválido").run(req);
        await body("senha").isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres").run(req);
        await body("tipo")
            .isIn(["CLIENTE", "PROFISSIONAL", "ADMINISTRADOR"])
            .withMessage("Tipo de usuário inválido")
            .run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { nome, email, senha, celular, tipo } = req.body;

        try {
            // Verificar se o e-mail já está em uso
            const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
            if (usuarioExistente) {
                return res.status(400).send("Email já está em uso");
            }

            // Criptografar a senha
            const senhaCriptografada = await bcrypt.hash(senha, 10);

            // Criar o usuário
            const usuario = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    senha: senhaCriptografada,
                    celular,
                    tipo,
                },
            });

            return res.status(201).json({ 
                id: usuario.id, 
                nome: usuario.nome, 
                email: usuario.email, 
                tipo: usuario.tipo 
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
        // Validação de ID
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
        // Validação de dados
        await param("id").isInt().withMessage("ID deve ser um número inteiro").run(req);
        await body("email").optional().isEmail().withMessage("Email inválido").run(req);
        await body("senha").optional().isLength({ min: 6 }).withMessage("Senha deve ter pelo menos 6 caracteres").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { nome, email, senha, celular, tipo } = req.body;

        try {
            const dadosAtualizados = {
                nome: nome || undefined,
                email: email || undefined,
                celular: celular || undefined,
                tipo: tipo || undefined,
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
        // Validação de ID
        await param("id").isInt().withMessage("ID deve ser um número inteiro").run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

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
