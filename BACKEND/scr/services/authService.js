const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const {OAuth2Client} = require('google-auth-library');  

const jwtSecret = process.env.JWT_SECRET || 'chave-secreta-desenvolvimento';
const googleClientId = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

    return {
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil,
            foto: usuario.foto,
        },
    };
};

const loginGoogle = async (tokenId) => {

    // 1) Verifica a assinatura do token JWT do Google
    const ticket = await googleClientId.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID, // confere se o token é mesmo para o nosso app 
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture, email_verified } = payload;

    if(!email_verified) {
        throw new Error('EMAIL_NAO_VERIFICADO');
    }

    //procura o usuario primeiro pelo googleId, se não achar procura pelo email
    let usuario = await Usuario.findOne({ where: { googleId: sub } });
    if (!usuario) {
        usuario = await Usuario.findOne({ where: { email } });

        if(usuario){
            usuario.googleId = sub;
            await usuario.save();
        } else {
            usuario = await Usuario.create({
                nome: name,
                email: email,
                googleId: sub,
            });
        }
    }
    
    if(!usuario.foto && picture) {
        usuario.foto = picture;
        await usuario.save();
    }

    const token = jwt.sign({ 
        id: usuario.id, 
        perfil: usuario.perfil , // payload
        }, jwtSecret, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );
    
    return {
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil,
            foto: usuario.foto,
        },
    };

}

module.exports = { login, loginGoogle };

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
    
