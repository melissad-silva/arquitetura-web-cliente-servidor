import api from './api';

export const consultarClima = async (cidade) => {
    const response = await api.get('/clima', { params: { cidade } });
    return response.data;
};

export const getHistoricoClima = async () => {
    const response = await api.get('/clima/historico');
    return response.data.data;
};
