import { useState, useEffect } from 'react';
import estilo from './app.module.css';
import axios from 'axios';

function App() {
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [erro, setErro] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [repositorios, setRepositorios] = useState([]);
  const [seguidores, setSeguidores] = useState([]);

  useEffect(() => {
    axios.get("https://api.github.com/users")
      .then((res) => {
        setUsuarios(res.data);
      })
      .catch((err) => {
        setErro('Erro ao carregar usuários');
      });
  }, []);

  function mudaUsuario(usuarioBuscado) {
    const usuarioFiltrado = usuarios.filter(usuario => usuario.login === usuarioBuscado);
    if (usuarioFiltrado.length === 0) {
      setErro(`Usuário '${usuarioBuscado}' não encontrado`);
    } else {
      setErro(null);
      setUsuarioSelecionado(usuarioFiltrado[0]);
      setRepositorios([]);
      setSeguidores([]);
    }
  }

  function voltar() {
    setUsuarioSelecionado(null);
    setRepositorios([]);
    setSeguidores([]);
  }

  function repos(event) {
    event.preventDefault();

    if (repositorios.length > 0) {
      setRepositorios([]);
    } else if (event.target.href) {
      axios.get(event.target.href)
        .then((res) => {
          setRepositorios(res.data);
        })
        .catch((err) => {
          setErro('Erro ao carregar repositórios');
        });
    }
  }

  function handleFollowers(event) {
    event.preventDefault();
    setRepositorios([]);

    if (seguidores.length > 0) {
      setSeguidores([]);
    } else if (event.target.href) {
      axios.get(event.target.href)
        .then((res) => {
          setSeguidores(res.data);
        })
        .catch((err) => {
          setErro('Erro ao carregar seguidores');
        });
    }
  }

  return (
    <div className='container mt-4'>
      {erro && (
        <p className='alert alert-danger'>{erro}</p>
      )}
      {!usuarioSelecionado && (
        <ul className='list-group'>
          {usuarios.map(usuario => (
            <li key={usuario.login} onClick={() => mudaUsuario(usuario.login)} className={'list-group-item ' + estilo.cursor}>
              {usuario.login}
            </li>
          ))}
        </ul>
      )}
      {usuarioSelecionado && (
        <>
          <h2>
            <img src={usuarioSelecionado.avatar_url} className={'img-fluid rounded-pill ' + estilo.avatar} alt='avatar' />
            {usuarioSelecionado.login}
            <span onClick={voltar} className={'mx-3 fs-6 btn btn-secondary btn-sm'}>Voltar</span>
          </h2>
          <p><strong>URLs:</strong></p>
          <ul>
            <li>
              <a target='_blank' rel="noopener noreferrer" href={usuarioSelecionado.html_url}>Perfil</a>
            </li>
            <li>
              <a onClick={repos} target="_blank" rel="noopener noreferrer" href={usuarioSelecionado.repos_url}>Repositórios</a>
            </li>
            <li>
              <a onClick={handleFollowers} target="_blank" rel="noopener noreferrer" href={usuarioSelecionado.followers_url}>Seguidores</a>
            </li>
          </ul>

          {repositorios.length > 0 && (
            repositorios.map(repo => (
              <div key={repo.name}>
                <p>{repo.name}</p>
                <p><a target='_blank' rel="noopener noreferrer" href={repo.html_url}>{repo.html_url}</a></p>
              </div>
            ))
          )}

          {seguidores.length > 0 && (
            <div>
              <h3>Seguidores</h3>
              <ul>
                {seguidores.map(seg => (
                  <li key={seg.login}>
                    <p>{seg.login}</p>
                    <p><a target='_blank' rel="noopener noreferrer" href={seg.html_url}>{seg.html_url}</a></p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
