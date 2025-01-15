import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

class UsuarioController {
    // Criar um novo usuário
    async criar(req, res) {
        const { nome, email, senha, celular, tipo } = req.body;

        try {
            if (!nome || !email || !senha || !tipo) {
                return res.status(400).send("Nome, email, senha e tipo são obrigatórios");
            }

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
            const usuarios = await prisma.usuario.findMany();
            return res.status(200).json(usuarios);
        } catch (error) {
            console.error(`Erro ao listar usuários: ${error.message}`);
            return res.status(500).send("Erro ao listar usuários");
        }
    }

    // Buscar um usuário por ID
    async buscarPorId(req, res) {
        const { id } = req.params;

        try {
            const usuario = await prisma.usuario.findUnique({ where: { id: parseInt(id) } });

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
