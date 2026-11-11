import api from './api';

export const login = async (email, senha) => {
    const response = await api.post('/login', { email, senha });
    const sessao = response.data.data;

    saveSession(sessao.usuario, sessao.token);
    return sessao;
};

export const loginGoogle = async (tokenId) => {
    const response = await api.post('/auth/google', { tokenId });
    const sessao = response.data.data;

    saveSession(sessao.usuario, sessao.token);
    return sessao;
}

export const saveSession = (usuario, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
};