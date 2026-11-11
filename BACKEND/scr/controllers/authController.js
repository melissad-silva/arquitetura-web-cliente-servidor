const authService = require('../services/authService');

const login = async (req, res) => {
    try {
        const { email, senha } = req.body || {};

        if (!email || !senha) {
            return res.status(400).json({ error: 'Erro, email e senha são obrigatórios...' });
        }

        const usuario = await authService.login(email, senha);
        return res.status(200).json({data: usuario});
        
    } catch (error) {
        if (error.message === 'CREDENCIAIS_INVALIDAS') {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }
        console.error('Erro no login:', error);
        return res.status(500).json({ error: 'Erro interno no login' });
    }
};

const loginGoogle = async (req, res) => {
    try {
        const { tokenId } = req.body || {};

        if (!tokenId) {
            return res.status(400).json({ error: 'Erro, token do Google é obrigatório...' });
        }

        const usuario = await authService.loginGoogle(tokenId);
        return res.status(200).json({data: usuario});
        
    } catch (error) {
        if (error.message === 'CREDENCIAIS_INVALIDAS') {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }
        if (error.message === 'EMAIL_NAO_VERIFICADO') {
            return res.status(401).json({ error: 'Email não verificado' });
        }
        console.error('Erro no login com Google:', error);
        return res.status(500).json({ error: 'Erro interno no login com Google' });
    }
};
module.exports = { login, loginGoogle };
