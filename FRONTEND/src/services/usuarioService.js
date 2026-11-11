import api from './api';

export const getUsuarios = async (search = '') => {
    const response = await api.get('/usuarios', {
        params: { search }, 
    });
    return response.data.data;
}

export const getUsuario = async (id) => {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
};

export const createUsuario = async (usuario) => {
    const response = await api.post('/usuarios', usuario);
    return response.data;
};

export const updateUsuario = async (id, usuario) => {
    const response = await api.put(`/usuarios/${id}`, usuario);
    return response.data;
};

export const deleteUsuario = async (id) => {
    const response = await api.delete(`/usuarios/${id}`);
    return response.data;
};

export const uploadFotoUsuario = async (id,arquivo) => {
    const formData = new FormData();
    formData.append('foto', arquivo);
    const res = await api.put(`/usuarios/${id}/foto`, formData);
    return res.data;
};

export const removerFotoUsuario = async (id) => {
    await api.delete(`/usuarios/${id}/foto`);
};