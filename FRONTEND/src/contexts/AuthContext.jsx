import {createContext, useContext, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // lê o que já estav a salvo, para não deslogar ao atualizar  a página
    const [usuario, setUsuario] = useState(() => {
        const salvo = localStorage.getItem('usuario');
        return salvo ? JSON.parse(salvo) : null;
    });

    const [carregado, setCarregado] = useState(false);
    const [erro, setErro] = useState('');

    const entrar = async (email, senha) => {
        setCarregado(true);
        setErro('');
        try {
            const dados = await authService.login(email, senha);
            setUsuario(dados.usuario);
            return true;
        } catch (error) {
            setErro('Email ou senha inválidos. Tente novamente.');
            return false; 
        } finally {
            setCarregado(false);
        }
    };

    const entrarGoogle = async (tokenId) => {
        setCarregado(true);
        setErro('');
        try {
            const dados = await authService.loginGoogle(tokenId);
            setUsuario(dados.usuario);
            return true;
        }
        catch (error) {
            setErro('Falha ao autenticar com o Google. Tente novamente.');
            return false;
        }
        finally {
            setCarregado(false);
        }
    };

    const sair = () => {
        authService.logout();
        setUsuario(null);
    };

    return (
        <AuthContext.Provider value={{ usuario, carregado, erro, entrar, entrarGoogle, sair }}>
            {children}
        </AuthContext.Provider>
    );
};

// atalho para os componentes consumirem o contexto
export const useAuth = () => useContext(AuthContext);