import { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Sun, Moon, Activity, UserPlus, Search } from 'lucide-react';
import Home from './pages/Home/Home';
import Usuarios from './pages/Usuarios/Usuarios';
import CadastroUsuario from './pages/Usuarios/CadastroUsuario';
import PesquisaUsuarios from './pages/Usuarios/PesquisaUsuarios';
import Login from './pages/Login/Login';
import RotaPrivada from './components/RotaPrivada.jsx';
import Header from './components/Header.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

function App() {
  const [theme, setTheme] = useState('light');
  const { usuario, sair } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    sair();
    navigate('/login', { replace: true });
  };

  return (
      <Routes>
        <Route path="/login" element={usuario ? <Navigate to="/usuarios" replace /> : <Login />} />
        <Route path="*" element={
          <RotaPrivada>
            <div className="app-layout">
              <aside className="sidebar">
                <div className="sidebar-header">
                  <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={24} color="var(--primary-color)" />
                    WEB III
                  </div>
                </div>
                <span className="sidebar-section-title">Visão geral</span>
                <Link to="/" className={`sidebar-link ${location.pathname === '/' ? 'active' : ''}`}>
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <span className="sidebar-section-title">Administração</span>
                <Link to="/usuarios" className={`sidebar-link ${location.pathname === '/usuarios' ? 'active' : ''}`}>
                  <Users size={20} />
                  Lista de usuários
                </Link>
                <Link to="/usuarios/pesquisa" className={`sidebar-link ${location.pathname === '/usuarios/pesquisa' ? 'active' : ''}`}>
                  <Search size={20} />
                  Pesquisar usuário
                </Link>
                <Link to="/usuarios/cadastro" className={`sidebar-link ${location.pathname.startsWith('/usuarios/cadastro') ? 'active' : ''}`}>
                  <UserPlus size={20} />
                  Cadastrar usuário
                </Link>
                <Link to="/configuracoes" className={`sidebar-link ${location.pathname === '/configuracoes' ? 'active' : ''}`}>
                  <Settings size={20} />
                  Configurações
                </Link>
                <button type="button" onClick={handleLogout} className="sidebar-link logout-link">
                  <LogOut size={20} />
                  Sair
                </button>
              </aside>

              <div className="right-area">
                <nav className="top-navbar">
                  <div className="navbar-right">
                    <button type="button" onClick={toggleTheme} className="theme-toggle-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                    <Header />
                  </div>
                </nav>
                <main className="page-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="/usuarios/pesquisa" element={<PesquisaUsuarios />} />
                    <Route path="/usuarios/cadastro" element={<CadastroUsuario />} />
                    <Route path="/usuarios/cadastro/:id" element={<CadastroUsuario />} />
                    <Route path="/configuracoes" element={<p>Configurações em construção.</p>} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          </RotaPrivada>
        } />
      </Routes>
  );
}

export default App;