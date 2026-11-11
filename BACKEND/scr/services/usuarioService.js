const Usuario = require('../models/Usuario');
const storageService = require('./storageService');

const obterTodosUsuario = async () => {
    return await Usuario.findAll();
};

const obterUsuarioPorId = async (id) => {
    return await Usuario.findByPk(id);
};

const criarUsuario = async (data) => {
    return await Usuario.create(data);
};

const atualizarUsuario = async (id, data) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        return null;
    }

    await usuario.update(data);
    return usuario;
};

const deletarUsuario = async (id) => {
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        return null;
    }

    await usuario.destroy();
    return usuario;
};

const editarFotoUsuario = async (id, foto) => {
    const usuario = await obterUsuarioPorId(id);
    if (!usuario) return null;
    const fotoAntiga = usuario.foto;
    const chave = await storageService.enviarArquivo(foto.buffer, foto.mimetype, `usuarios/${id}`);
    await usuario.update({ foto: chave });
    await storageService.deletarArquivo(fotoAntiga);
    return await paraResposta(usuario);
};

const paraResposta = async (usuario) => {
    if (!usuario) return usuario;
    const dados = usuario.toJSON();
    dados.foto = await storageService.gerarLink(dados.foto);
    return dados;
}


module.exports = { obterTodosUsuario,
    obterUsuarioPorId,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario,
    editarFotoUsuario,
    paraResposta
};