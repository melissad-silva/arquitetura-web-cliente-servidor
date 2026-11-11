import { useEffect, useState } from 'react';
import { CloudSun, Search } from 'lucide-react';
import { consultarClima, getHistoricoClima } from '../../services/climaService';

function Home() {
  const [cidade, setCidade] = useState('Curitiba');
  const [clima, setClima] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  const buscarClima = async (event) => {
    event?.preventDefault();
    setCarregando(true);
    setErro('');
    try {
      const resultado = await consultarClima(cidade);
      setClima(resultado);
      setHistorico((atual) => [resultado, ...atual.filter((item) => item.id !== resultado.id)].slice(0, 10));
    } catch (requestError) {
      setErro(requestError.response?.data?.error || 'Não foi possível consultar a previsão.');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    getHistoricoClima().then((consultas) => {
      setHistorico(consultas);
      if (consultas[0]) setClima(consultas[0]);
    }).catch(() => {
      // O histórico é opcional; a consulta manual continua disponível.
    });
  }, []);

  return (
    <div className="page-container">
      <div className="page-heading">
        <div>
          <span className="eyebrow">VISÃO GERAL</span>
          <h1>Bem-vindo ao Sistema</h1>
          <p>Consulte a previsão atual usando a API Open-Meteo.</p>
        </div>
      </div>

      <section className="weather-card">
        <div className="weather-card-heading">
          <div className="cadastro-icon"><CloudSun size={20} /></div>
          <div>
            <h2>Previsão do tempo</h2>
            <p>As consultas são salvas no histórico da sua conta.</p>
          </div>
        </div>
        <form className="weather-form" onSubmit={buscarClima}>
          <label htmlFor="cidade-clima">Cidade
            <input id="cidade-clima" value={cidade} onChange={(event) => setCidade(event.target.value)} placeholder="Ex.: Curitiba" />
          </label>
          <button className="primary-button" type="submit" disabled={carregando || !cidade.trim()}>
            <Search size={17} /> {carregando ? 'Consultando...' : 'Consultar'}
          </button>
        </form>
        {erro && <p className="error-message" role="alert">{erro}</p>}
        {clima && (
          <div className="weather-result">
            <div>
              <span className="weather-location">{clima.cidade}, {clima.pais}</span>
              <strong>{clima.temperatura} °C</strong>
              <span>Sensação de {clima.sensacaoTermica} °C</span>
            </div>
            <div className="weather-details">
              <span>Umidade: {clima.umidade}%</span>
              <span>Vento: {clima.velocidadeVento} km/h</span>
            </div>
          </div>
        )}
      </section>

      {historico.length > 0 && (
        <section className="weather-history">
          <h2>Últimas consultas</h2>
          {historico.map((consulta) => (
            <div className="weather-history-item" key={consulta.id}>
              <span>{consulta.cidade}, {consulta.pais}</span>
              <span>{consulta.temperatura} °C</span>
              <time dateTime={consulta.consultadoEm}>{new Date(consulta.consultadoEm).toLocaleString('pt-BR')}</time>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

export default Home;