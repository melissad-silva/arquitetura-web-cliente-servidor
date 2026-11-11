const { upload } = require('../services/storageService');

const uploadImagem = (campo) => (req, res, next) => {
    upload.single(campo)(req, res, (err) => {
        if(!err) return next();
        if(err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ erro: 'A imagem deve ter no máximo 5MB' });
        if(err.message === 'TIPO_INVALIDO') return res.status(415).json({ erro: 'Formato de imagem inválido. Use JPG, PNG, WEBP ou GIF' });
        console.error(err);
        return res.status(400).json({ erro: 'Erro ao processar a imagem' });
    });
};

module.exports = { uploadImagem };