import { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { GoogleLogin } from '@react-oauth/google';
import { Activity, LogIn } from 'lucide-react';


function Login(){
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erroGoogle, setErroGoogle] = useState('');

    const { entrar, entrarGoogle, carregado, erro } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErroGoogle('');
        const sucesso = await entrar(email, senha);
        if (sucesso) {
            navigate('/usuarios');
        }
    };

    return (
        <main className="login-page">   
            <section className="login-panel">
                <div className="login-brand"><Activity size={26} /> WEB III</div>
                <span className="eyebrow">ÁREA ADMINISTRATIVA</span>
                <h1>Entrar no sistema</h1>
                <p className="login-description">Use suas credenciais para acessar o gerenciamento de usuários.</p>

                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="login-email">E-mail</label>
                    <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
                    <label htmlFor="login-senha">Senha</label>
                    <input id="login-senha" type="password" value={senha} onChange={(event) => setSenha(event.target.value)} required autoComplete="current-password" />
                    <button className="primary-button" type="submit" disabled={carregado}>
                        <LogIn size={17} /> {carregado ? 'Entrando...' : 'Entrar'}
                    </button>

                    <div className="login-divider">ou</div>
                    
                    <div className="login-google">
                        <GoogleLogin
                            useOneTap={false}
                            onSuccess={async (response) => {
                                setErroGoogle('');
                                const tokenId = response.credential;
                                if (!tokenId) {
                                    setErroGoogle('Não foi possível obter a credencial do Google. Tente novamente.');
                                    return;
                                }
                                const sucesso = await entrarGoogle(tokenId);
                                if (sucesso) {
                                    navigate('/usuarios');
                                }
                            }}
                            onError={() => {
                                setErroGoogle('Não foi possível autenticar com o Google. Tente novamente.');
                            }}
                        />
                    </div>
                    {(erro || erroGoogle) && (
                        <p className="error-message" role="alert">{erro || erroGoogle}</p>
                    )}
                </form>
            </section>
        </main>
    );
}

export default Login;