import React, { useEffect, useState } from 'react';
import api from './services/api';
import './global.css';
import './Sidebar.css';
import './App.css';
import './Main.css';

function App() {
  const [devs, setDevs] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [github_username, setGithub_username] = useState('');
  const [techs, setTechs] = useState('');

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);
      },
      (err) => {
        console.log(err);
      },
      {
        timeout: 3000
      }
    );
  }, []);
  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');
      setDevs(response.data);
    }
    loadDevs();
  }, [])

  async function handleAddNewDev(e) {
    e.preventDefault();

    const response = await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude
    });
    if (response.data.result === 'success') {
      alert('Cadastro concluido com sucesso!');
      setGithub_username('');
      setTechs('');
      setDevs([...devs, response.data.dev]);
    }

    if (response.data.result === 'fail')
      alert('Esse usuário do Github já é cadastrado na plataforma, tente com um usúario diferente.');
  }

  return (
    <div id='app'>
      <aside>
        <strong>Cadastrar</strong>
        <form>
          <div className='input-block'>
            <label htmlFor='github_username'>Usuário do Github</label>
            <input
              name='github_username'
              id='github_username'
              required
              onChange={e => setGithub_username(e.target.value)} />
          </div>

          <div className='input-block'>
            <label htmlFor='techs'>Tecnologias</label>
            <input
              name='techs'
              id='techs'
              required
              onChange={e => setTechs(e.target.value)}
            />
          </div>

          <div className="input-group">

            <div className='input-block'>
              <label htmlFor='latitude'>Latitude</label>
              <input
                type='number'
                name='latitude'
                id='latitude'
                required
                value={latitude}
                onChange={e => setLatitude(e.target.value)} />
            </div>

            <div className='input-block'>
              <label htmlFor='longitude'>Longitude</label>
              <input type='number'
                name='longitude'
                id='longitude'
                required
                value={longitude}
                onChange={e => setLongitude(e.target.value)} />
            </div>

          </div>
          <button
            type='submit'
            onClick={handleAddNewDev}>Salvar</button>
        </form>
      </aside>
      <main>
        <ul>
          {devs.map(dev => {
            return (<li key={dev._id}
              className='dev-item'>
              <header>
                <img src={dev.avatar_url} alt={dev.name} />
                <div className="user-info">
                  <strong>{dev.name}</strong>
                  <span>{dev.techs.join(', ')}</span>
                </div>
              </header>
              <p>{dev.bio}</p>
              <a href={`https://github.com/${dev.github_username}`}>Acessar perfil no Github</a>
            </li>);
          })}
        </ul>
      </main>
    </div>
  );
}

export default App;
