const ConsultaClima = require('../models/ConsultaClima');

const OPEN_METEO_TIMEOUT_MS = 8000;

const consultarJson = async (url) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), OPEN_METEO_TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: { 'User-Agent': 'web-iii-clima/1.0' },
        });
        if (!response.ok) {
            throw new Error(`OPEN_METEO_HTTP_${response.status}`);
        }
        return await response.json();
    } finally {
        clearTimeout(timeout);
    }
};

const consultarClima = async (cidade, usuarioId) => {
    const cidadeNormalizada = cidade.trim();
    const geocodingUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
    geocodingUrl.search = new URLSearchParams({
        name: cidadeNormalizada,
        count: '1',
        language: 'pt',
        format: 'json',
    });

    const localizacao = await consultarJson(geocodingUrl);
    const resultado = localizacao.results?.[0];
    if (!resultado) {
        const error = new Error('CIDADE_NAO_ENCONTRADA');
        error.statusCode = 404;
        throw error;
    }

    const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
    forecastUrl.search = new URLSearchParams({
        latitude: String(resultado.latitude),
        longitude: String(resultado.longitude),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
        timezone: 'auto',
    });

    const previsao = await consultarJson(forecastUrl);
    const atual = previsao.current;
    if (!atual) {
        throw new Error('OPEN_METEO_RESPOSTA_INVALIDA');
    }

    const consulta = await ConsultaClima.create({
        usuarioId,
        cidade: resultado.name,
        pais: resultado.country,
        latitude: resultado.latitude,
        longitude: resultado.longitude,
        temperatura: atual.temperature_2m,
        sensacaoTermica: atual.apparent_temperature,
        umidade: atual.relative_humidity_2m,
        velocidadeVento: atual.wind_speed_10m,
        codigoTempo: atual.weather_code,
    });

    return consulta.toJSON();
};

const obterHistorico = async (usuarioId) => ConsultaClima.findAll({
    where: { usuarioId },
    order: [['consultadoEm', 'DESC']],
    limit: 10,
});

module.exports = { consultarClima, obterHistorico };
