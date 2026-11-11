import { useEffect, useState } from "react";
import { RefreshCw, UserPlus, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { deleteUsuario, getUsuarios } from "../../services/usuarioService";

function Usuarios() {
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const carregarUsuarios = async () => {
        setLoading(true);
        setError(null);
        try {
            const dados = await getUsuarios();
            setUsuarios(Array.isArray(dados) ? dados : []);
        } catch (requestError) {
            console.error("Erro ao buscar usuários:", requestError);
            setError("Erro ao buscar usuários. Por favor, tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarUsuarios();
    }, []);

    const handleDeletarUsuario = async (id) => {
        if (!window.confirm("Tem certeza que deseja deletar este usuário?")) return;

        try {
            await deleteUsuario(id);
            await carregarUsuarios();
        } catch (requestError) {
            console.error("Erro ao deletar usuário:", requestError);
            setError("Erro ao deletar usuário. Por favor, tente novamente.");
        }
    };

    return (
        <div className="usuarios-page">
            <div className="page-heading">
                <div>
                    <span className="eyebrow">GERENCIAMENTO</span>
                    <h1>Lista de usuários</h1>
                    <p>Visualize, edite e remova os usuários cadastrados.</p>
                </div>
                <button className="primary-button" type="button" onClick={() => navigate("/usuarios/cadastro")}>
                    <UserPlus size={17} /> Novo usuário
                </button>
            </div>

            <div className="list-actions">
                <span>{usuarios.length} usuário(s) encontrado(s)</span>
                <button className="secondary-button" type="button" onClick={carregarUsuarios} title="Atualizar lista">
                    <RefreshCw size={17} /> Atualizar lista
                </button>
            </div>

            {loading && <p>Carregando usuários...</p>}
            {error && <p className="error-message" role="alert">{error}</p>}
            {!loading && !error && usuarios.length === 0 && <div className="empty-state">Nenhum usuário encontrado.</div>}

            <div className="usuarios-grid">
                {usuarios.map((usuario) => (
                    <article className="usuario-card" key={usuario.id}>
                        <Avatar nome={usuario.nome} foto={usuario.foto} className="usuario-avatar" />
                        <div className="usuario-info">
                            <h2>{usuario.nome}</h2>
                            <p>{usuario.email}</p>
                            <span>ID #{usuario.id}</span>
                        </div>
                        <div className="card-actions">
                            <button className="icon-button" type="button" onClick={() => navigate(`/usuarios/cadastro/${usuario.id}`)} title="Editar usuário" aria-label={`Editar ${usuario.nome}`}>
                                <Pencil size={17} />
                            </button>
                            <button className="icon-button danger" type="button" onClick={() => handleDeletarUsuario(usuario.id)} title="Excluir usuário" aria-label={`Excluir ${usuario.nome}`}>
                                <Trash2 size={17} />
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default Usuarios;
