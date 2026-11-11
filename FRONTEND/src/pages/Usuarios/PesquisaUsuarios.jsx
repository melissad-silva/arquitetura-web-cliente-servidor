import { useState } from "react";
import { Search, UserPlus, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsuario } from "../../services/usuarioService";

function PesquisaUsuarios() {
    const navigate = useNavigate();
    const [idUsuario, setIdUsuario] = useState("");
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleBuscarUsuario = async (event) => {
        event.preventDefault();
        if (!idUsuario.trim()) {
            setError("Informe o ID do usuário para realizar a pesquisa.");
            setUsuario(null);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const resultado = await getUsuario(idUsuario);
            setUsuario(resultado || null);
            if (!resultado) setError("Nenhum usuário encontrado para o ID informado.");
        } catch (requestError) {
            console.error("Erro ao buscar usuário:", requestError);
            setUsuario(null);
            setError("Erro ao buscar usuário. Por favor, tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="usuarios-page">
            <div className="page-heading">
                <div>
                    <span className="eyebrow">GERENCIAMENTO</span>
                    <h1>Pesquisar usuários</h1>
                    <p>Encontre um usuário específico informando seu ID.</p>
                </div>
                <button className="primary-button" type="button" onClick={() => navigate("/usuarios/cadastro")}>
                    <UserPlus size={17} /> Novo usuário
                </button>
            </div>

            <section className="search-panel">
                <form className="search-form" onSubmit={handleBuscarUsuario}>
                    <label htmlFor="id-usuario">ID do usuário</label>
                    <div className="search-row">
                        <input id="id-usuario" type="number" min="1" value={idUsuario} onChange={(event) => setIdUsuario(event.target.value)} placeholder="Ex.: 1" />
                        <button className="secondary-button" type="submit" disabled={loading}>
                            <Search size={17} /> {loading ? "Buscando..." : "Buscar usuário"}
                        </button>
                    </div>
                </form>
            </section>

            {error && <p className="error-message" role="alert">{error}</p>}
            {usuario && (
                <article className="usuario-card search-result-card">
                    <div className="usuario-avatar">{(usuario.nome || "?").charAt(0).toUpperCase()}</div>
                    <div className="usuario-info">
                        <h2>{usuario.nome}</h2>
                        <p>{usuario.email}</p>
                        <span>ID #{usuario.id}</span>
                    </div>
                    <div className="card-actions">
                        <button className="icon-button" type="button" onClick={() => navigate(`/usuarios/cadastro/${usuario.id}`)} title="Editar usuário" aria-label={`Editar ${usuario.nome}`}>
                            <Pencil size={17} />
                        </button>
                    </div>
                </article>
            )}
        </div>
    );
}

export default PesquisaUsuarios;
