import jwt from "jsonwebtoken";
import env from "../environment.js";

function autenticarToken(req, res, next) {
    const cabecalhoAutorizacao = req.headers['authorization'];
    const token = cabecalhoAutorizacao && cabecalhoAutorizacao.split(' ')[1];

    if (token == null) {
        console.log('Token ausente');
        return res.sendStatus(401);  // Não autorizado
    }

    jwt.verify(token, env.JWT_SECRET, (err, usuario) => {
        if (err) {
            console.log('Falha na verificação do token:', err.message);
            return res.sendStatus(403);  // Proibido
        }

        console.log('Usuário autenticado:', usuario);
        req.user = usuario;
        next();
    });
}

export default autenticarToken;