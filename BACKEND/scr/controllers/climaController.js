const climaService = require('../services/climaService');

const consultar = async (req, res) => {
    const cidade = typeof req.query.cidade === 'string' ? req.query.cidade.trim() : '';
    if (!cidade || cidade.length > 100) {
        return res.status(400).json({ error: 'Informe uma cidade válida.' });
    }

    try {
        const clima = await climaService.consultarClima(cidade, req.usuario.id);
        return res.status(200).json(clima);
    } catch (error) {
        if (error.statusCode === 404 || error.message === 'CIDADE_NAO_ENCONTRADA') {
            return res.status(404).json({ error: 'Cidade não encontrada.' });
        }
        console.error('Erro ao consultar Open-Meteo:', error);
        return res.status(502).json({ error: 'Não foi possível consultar a previsão do tempo.' });
    }
};

const historico = async (req, res) => {
    try {
        const consultas = await climaService.obterHistorico(req.usuario.id);
        return res.status(200).json({ data: consultas });
    } catch (error) {
        console.error('Erro ao buscar histórico do clima:', error);
        return res.status(500).json({ error: 'Não foi possível buscar o histórico do clima.' });
    }
};

module.exports = { consultar, historico };
