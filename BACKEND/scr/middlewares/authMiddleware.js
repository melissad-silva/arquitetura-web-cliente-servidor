const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'chave-secreta-desenvolvimento';

const autenticar = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de acesso obrigatorio' });
    }

    const token = authorization.substring(7);

    try {
        req.usuario = jwt.verify(token, jwtSecret);
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalido ou expirado' });
    }
};

const autorizar = (...perfisPermitidos) => (req, res, next) => {
    if (!req.usuario || !perfisPermitidos.includes(req.usuario.perfil)) {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    return next();
};

module.exports = { autenticar, autorizar };