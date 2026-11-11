import { useAuth } from "../contexts/AuthContext";

function Header () {
    const { usuario } = useAuth();

    if(!usuario) return null;

    return (
        <header>
            <span>
                Olá, {usuario.nome}
            </span>

            <div className="header-profile">
                {usuario.foto ? (<img
                    className="header-avatar"
                    src={usuario.foto}    
                    alt={`Foto de ${usuario.nome}`}
                    referrerPolicy="no-referrer"
                />) : (
                    <span className="header-avatar-placeholder">
                        {(usuario.nome || '?').charAt(0).toUpperCase()}
                    </span>
                )}     
                <div className="header-profile-info">
                    <span className="header-profile-name">{usuario.nome || 'Usuário'}</span>
                    <span className="header-profile-email">{usuario.email}</span>
                </div> 
            </div>
            
        </header>
    )
}

export default Header;