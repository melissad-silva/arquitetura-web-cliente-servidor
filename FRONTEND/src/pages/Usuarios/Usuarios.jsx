import { useState, useEffect } from "react";
import { getUsuarios } from "../../services/usuarioService";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        const fetchUsuarios = async () => {
        try {
            const dados = await getUsuarios();
            console.log(dados);
            setUsuarios(dados.data || dados || []); // cobre ambos os casos
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
        }
        };
        fetchUsuarios();
    }, []);

    return (
        <div>
        <h1>Lista de Usuários</h1>
        <ul>
            {Array.isArray(usuarios) && usuarios.map(usuario => (
            <li key={usuario.id}>
                <span>Nome:</span> {usuario.nome} <br />
                <span>Email:</span> {usuario.email}
            </li>
            ))}
        </ul>
        </div>
    );
}

export default Usuarios;
