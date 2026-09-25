const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const jwtSecret = process.env.JWT_SECRET || 'chave-secreta-desenvolvimento';

const login = async (email, senha) => { 
    const usuario = await Usuario.scope('comSenha').findOne({ where: { email } });
    if (!usuario) throw new Error('CREDENCIAIS_INVALIDAS');
    if (typeof usuario.senha !== 'string' || !usuario.senha.startsWith('$2')) {
        throw new Error('CREDENCIAIS_INVALIDAS');
    }

    const confere = await bcrypt.compare(senha, usuario.senha);
    if (!confere) throw new Error('CREDENCIAIS_INVALIDAS');

    const token = jwt.sign (
        { id: usuario.id, perfil: usuario.perfil }, // payload
        jwtSecret,
        { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return { token, usuario: { id: usuario.id, nome: usuario.nome } };
};

module.exports = { login };

/*const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

const login = async (email, senha) => {
    const usuario = await Usuario.scope('comSenha').findOne({ where: { email } });
    if (!usuario)throw new Error('CREDENCIAIS_INVALIDAS');

    const confere = await bcrypt.compare(senha, usuario.senha);
    if (!confere) throw new Error('CREDENCIAIS_INVALIDAS');

    return usuario;
}

module.exports = { login };*/
    
