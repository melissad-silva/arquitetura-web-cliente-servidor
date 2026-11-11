import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function RotaPrivada ({ children, perfilNecessario }) {
    const { usuario } = useAuth();

    // não está logado, redireciona para a página de login
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    // está logado, mas não tem o perfil necessário, redireciona para a página de acesso negado
    if (perfilNecessario && usuario.perfil !== perfilNecessario) {
        return <Navigate to="/acesso-negado" replace />;
    }

    return children;
}

export default RotaPrivada;