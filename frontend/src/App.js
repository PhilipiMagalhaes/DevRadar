import React, { useEffect, useState } from 'react';
import api from './services/api';
import DevItem from './components/DevItem';
import DevForm from './components/DevForm';
import './global.css';
import './Sidebar.css';
import './App.css';
import './Main.css';


function App() {
  const [devs, setDevs] = useState([]);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');
      setDevs(response.data);
    }
    loadDevs();
  }, [])

  async function handleAddNewDev(data) {
    const response = await api.post('/devs', data);

    if (response.data.result === 'success') {
      alert('Cadastro concluido com sucesso!');
      setDevs([...devs, response.data.dev]);
    }

    if (response.data.result === 'fail')
      alert('Esse usuário do Github já é cadastrado na plataforma, tente com um usúario diferente.');
  }


  return (
    <div id='app'>
      <aside>
        <strong>Cadastrar</strong>
        <DevForm onSubmit={handleAddNewDev} />
      </aside>
      <main>
        <ul>
          {devs.map(dev => (
            <DevItem key={dev.id} dev={dev} />
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
