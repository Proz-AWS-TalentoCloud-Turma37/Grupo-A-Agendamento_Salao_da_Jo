import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import logger from '../../logger.js';

const prisma = new PrismaClient();

class UserController {
    async criar(req, res) {
        const { name, email, password } = req.body;

        try {
            if (!name || !email || !password) {
                logger.error(`Campos obrigatórios faltando: name=${name}, email=${email}, password=${password}`);
                return res.status(400).send("Nome, email e senha são obrigatórios");
            }

            const usuarioExistente = await prisma.user.findUnique({ where: { email } });

            if (usuarioExistente) {
                logger.error(`Tentativa de criar usuário com email já existente: ${email}`);
                return res.status(400).send("Email já está em uso");
            }

            const senhaCriptografada = bcrypt.hashSync(password, 10);

            const usuario = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: senhaCriptografada,
                    role: 'user'
                },
            });

            logger.info(`Usuário criado com sucesso: ${usuario.email}`);
            return res.status(201).json({ 
                id: usuario.id, 
                name: usuario.name, 
                email: usuario.email, 
                role: usuario.role
            });
        } catch (error) {
            logger.error(`Erro ao criar usuário: ${error.message}`);
            return res.status(500).send('Erro ao criar o usuário');
        }
    }

    async definirRole(req, res) {
        if (!(req.user && req.user.role === 'admin')) {
            logger.error(`Acesso negado para usuário: ${req.user ? req.user.name : 'desconhecido'}`);
            return res.status(403).send('Acesso negado');
        }

        const { id } = req.params;
        const { novoRole } = req.body;

        try {
            const usuario = await prisma.user.findUnique({ where: { id: parseInt(id) } });

            if (!usuario) {
                logger.error(`Usuário não encontrado para ID: ${id}`);
                return res.status(404).send('Usuário não encontrado');
            }

            const usuarioAtualizado = await prisma.user.update({
                where: { id: parseInt(id) },
                data: { role: novoRole },
            });

            logger.info(`Role do usuário atualizado com sucesso: ${usuarioAtualizado.email} para ${novoRole}`);
            return res.status(200).json({ mensagem: 'Role do usuário atualizado com sucesso', usuario: usuarioAtualizado });
        } catch (error) {
            logger.error(`Erro ao atualizar o role do usuário: ${error.message}`);
            return res.status(500).send('Erro ao atualizar o role do usuário');
        }
    }

    async listar(req, res) {
        try {
            const filtroStatus = req.query.status;
            let condicoesFiltro = {};

            if (filtroStatus) {
                condicoesFiltro.status = filtroStatus;
            }

            const usuarios = await prisma.user.findMany({ where: condicoesFiltro });

            logger.info(`Usuários listados com sucesso. Total: ${usuarios.length}`);
            return res.status(200).json(usuarios);
        } catch (error) {
            logger.error(`Erro ao ler usuários: ${error.message}`);
            return res.status(500).send('Erro ao ler usuários');
        }
    }

    async buscarPorId(req, res) {
        const { id } = req.params;
        logger.info(`Buscando usuário com ID: ${id}`);

        try {
            const usuario = await prisma.user.findUnique({ where: { id: parseInt(id) } });

            if (!usuario) {
                logger.warn(`Usuário não encontrado para ID: ${id}`);
                return res.status(404).send('Usuário não encontrado');
            }

            logger.info(`Usuário encontrado: ${usuario.email}`);
            return res.status(200).json(usuario);
        } catch (error) {
            logger.error(`Erro ao buscar usuário: ${error.message}`);
            return res.status(500).send('Erro ao buscar usuário');
        }
    }

    async atualizar(req, res) {
        if (!(req.user && req.user.role === 'admin')) {
            logger.error(`Acesso negado para usuário: ${req.user ? req.user.name : 'desconhecido'}`);
            return res.status(403).send('Acesso negado');
        }

        const { id } = req.params;
        const { name, email, password, role } = req.body;
        const senhaCriptografada = password ? bcrypt.hashSync(password, 10) : undefined;
        logger.info(`Atualizando usuário com ID: ${id}`);

        try {
            const usuarioAtualizado = await prisma.user.update({
                where: { id: parseInt(id) },
                data: {
                    name: name || undefined,
                    email: email || undefined,
                    password: senhaCriptografada,
                    role: role || undefined,
                },
            });

            logger.info(`Usuário atualizado com sucesso: ${usuarioAtualizado.email}`);
            return res.status(200).json(usuarioAtualizado);
        } catch (error) {
            logger.error(`Erro ao atualizar usuário: ${error.message}`);
            return res.status(500).send('Erro ao atualizar usuário');
        }
    }

    async deletar(req, res) {
        if (!(req.user && req.user.role === 'admin')) {
            logger.error(`Acesso negado para usuário: ${req.user ? req.user.name : 'desconhecido'}`);
            return res.status(403).send('Acesso negado');
        }

        const { id } = req.params;
        logger.info(`Deletando usuário com ID: ${id}`);

        try {
            const usuario = await prisma.user.findUnique({ where: { id: parseInt(id) } });
            if (!usuario) {
                logger.warn(`Usuário não encontrado para ID: ${id}`);
                return res.status(404).send('Usuário não encontrado');
            }

            await prisma.user.delete({ where: { id: parseInt(id) } });

            logger.info(`Usuário deletado com sucesso: ID ${id}`);
            return res.status(200).send('Usuário deletado com sucesso');
        } catch (error) {
            logger.error(`Erro ao deletar usuário: ${error.message}`);
            return res.status(500).send('Erro ao deletar usuário');
        }
    }
}

export default UserController;
