import { useEffect, useState } from "react";
import { ArrowLeft, Camera, Save, Trash, UserPlus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { createUsuario, getUsuario, removerFotoUsuario, updateUsuario, uploadFotoUsuario } from "../../services/usuarioService";

const formularioInicial = { nome: "", email: "", senha: "" };

function CadastroUsuario() {
    const navigate = useNavigate();
    const { id } = useParams();
    const editando = Boolean(id);
    const [formulario, setFormulario] = useState(formularioInicial);
    const [previewFoto, setPreviewFoto] = useState(null);
    const [fotoSelecionada, setFotoSelecionada] = useState(null);
    const [fotoRemovida, setFotoRemovida] = useState(false);
    const [loading, setLoading] = useState(editando);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!editando) return;

        const carregarUsuario = async () => {
            try {
                const usuario = await getUsuario(id);
                if (!usuario) {
                    setError("Usuário não encontrado.");
                    return;
                }
                setFormulario({ nome: usuario.nome || "", email: usuario.email || "", senha: "" });
                setPreviewFoto(usuario.foto || null);
            } catch (requestError) {
                console.error("Erro ao carregar usuário:", requestError);
                setError("Não foi possível carregar o usuário.");
            } finally {
                setLoading(false);
            }
        };

        carregarUsuario();
    }, [editando, id]);

    useEffect(() => () => {
        if (previewFoto?.startsWith("blob:")) URL.revokeObjectURL(previewFoto);
    }, [previewFoto]);

    const handleFotoChange = (event) => {
        const arquivo = event.target.files?.[0];
        event.target.value = "";
        if (!arquivo) return;

        const tiposPermitidos = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!tiposPermitidos.includes(arquivo.type)) {
            setError("Formato de imagem inválido. Use JPG, PNG, GIF ou WEBP.");
            return;
        }
        if (arquivo.size > 5 * 1024 * 1024) {
            setError("A imagem deve ter no máximo 5MB.");
            return;
        }

        if (previewFoto?.startsWith("blob:")) URL.revokeObjectURL(previewFoto);
        setPreviewFoto(URL.createObjectURL(arquivo));
        setFotoSelecionada(arquivo);
        setFotoRemovida(false);
        setError(null);
    };

    const handleRemoverFoto = () => {
        if (previewFoto?.startsWith("blob:")) URL.revokeObjectURL(previewFoto);
        setPreviewFoto(null);
        setFotoSelecionada(null);
        setFotoRemovida(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        try {
            if (editando) {
                await updateUsuario(id, { nome: formulario.nome, email: formulario.email });
                if (fotoSelecionada) {
                    await uploadFotoUsuario(id, fotoSelecionada);
                } else if (fotoRemovida) {
                    await removerFotoUsuario(id);
                }
            } else {
                await createUsuario(formulario);
            }
            navigate("/usuarios");
        } catch (requestError) {
            console.error("Erro ao salvar usuário:", requestError);
            setError("Não foi possível salvar o usuário. Por favor, tente novamente.");
        }
    };

    if (loading) return <p>Carregando usuário...</p>;

    return (
        <div className="usuarios-page cadastro-page">
            <div className="page-heading">
                <div>
                    <span className="eyebrow">GERENCIAMENTO</span>
                    <h1>{editando ? "Editar usuário" : "Cadastrar usuário"}</h1>
                    <p>{editando ? "Atualize os dados do usuário selecionado." : "Preencha os dados para criar um novo acesso."}</p>
                </div>
                <button className="secondary-button" type="button" onClick={() => navigate("/usuarios")}>
                    <ArrowLeft size={17} /> Voltar para pesquisa
                </button>
            </div>

            <form className="cadastro-card" onSubmit={handleSubmit}>
                <div className="cadastro-card-heading">
                    <div className="cadastro-icon"><UserPlus size={20} /></div>
                    <div>
                        <h2>Dados do usuário</h2>
                        <p>Todos os campos obrigatórios devem ser preenchidos.</p>
                    </div>
                </div>
                <div className="cadastro-fields">
                    <label htmlFor="nome-usuario">Nome<input id="nome-usuario" required value={formulario.nome} onChange={(event) => setFormulario({ ...formulario, nome: event.target.value })} /></label>
                    <label htmlFor="email-usuario">E-mail<input id="email-usuario" required type="email" value={formulario.email} onChange={(event) => setFormulario({ ...formulario, email: event.target.value })} /></label>
                    {!editando && <label htmlFor="senha-usuario">Senha<input id="senha-usuario" required type="password" value={formulario.senha} onChange={(event) => setFormulario({ ...formulario, senha: event.target.value })} /></label>}
                </div>
                {editando && (
                    <div className="foto-field">
                        <Avatar nome={formulario.nome} foto={previewFoto} className="avatar avatar-lg" />
                        <label className="secondary-button foto-input-button">
                            <Camera size={16} />
                            {previewFoto ? "Trocar foto" : "Escolher foto"}
                            <input type="file" hidden accept="image/jpeg, image/png, image/gif, image/webp" onChange={handleFotoChange} />
                        </label>
                        {previewFoto && (
                            <button type="button" className="secondary-button foto-remove-button" onClick={handleRemoverFoto}>
                                <Trash size={16} /> Remover foto
                            </button>
                        )}
                    </div>
                )}
                {error && <p className="error-message" role="alert">{error}</p>}
                <div className="cadastro-actions">
                    <button className="secondary-button" type="button" onClick={() => navigate("/usuarios")}>Cancelar</button>
                    <button className="primary-button" type="submit"><Save size={17} /> {editando ? "Salvar alterações" : "Cadastrar usuário"}</button>
                </div>
            </form>
        </div>
    );
}

export default CadastroUsuario;
