import { useEffect, useState } from 'react';
import LeftPanel from './components/panels/leftPanel/LeftPanel';
import MiddlePanel from './components/panels/middlePanel/MiddlePanel';
import RightPanel from './components/panels/rightPanel/RightPanel';
import BackgroundCanvas from './components/backgroundCanvas/BackgroundCanvas';
import Modal from './components/Modal/Modal';
import './App.css';
import { Astronaut } from './types';

function App() {
  const apiUrl = process.env.BACKEND_URL;

  const [showModal, setShowModal] = useState(true);
  const [astronauts, setAstronauts] = useState<Astronaut[]>([]);
  async function getAstronauts() {
    const res = await fetch(`${apiUrl}/astronauts`);
    const data = await res.json();
    console.log(data);
    setAstronauts(data.astronauts);
  }

  const [selectedAstronaut, setSelectedAstronaut] = useState<Astronaut | null>(null);
  const handleAstronautClick = (astronaut: Astronaut) => {
    setSelectedAstronaut(astronaut);
    setIsAdding(false);
    setLogMessage(`Selected an astronaut`);
    resetLogMessage();
  };

  const [logMessage, setLogMessage] = useState('Calling Houston...');

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${apiUrl}/astronauts/${id}`, {
        method: 'DELETE',
      });
      setAstronauts((prevAstronauts) => {
        const updatedAstronauts = prevAstronauts.filter((astronaut) => astronaut.id !== id);
        setLogMessage('Astronaut deleted');
        resetLogMessage();
        return updatedAstronauts;
      });
      setSelectedAstronaut(null);
    } catch (error) {
      console.error('Error deleting astronaut:', error);
    }
  };

  const handleUpdate = async (updatedAstronaut: Astronaut) => {
    try {
      const res = await fetch(`${apiUrl}/astronauts/${updatedAstronaut.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAstronaut),
      });
      if (res.ok) {
        setAstronauts(astronauts.map((astronaut) => (astronaut.id === updatedAstronaut.id ? updatedAstronaut : astronaut)));
        setSelectedAstronaut(updatedAstronaut);
        setLogMessage('Astronaut updated');
        resetLogMessage();
      }
    } catch (error) {
      console.error('Error updating astronaut:', error);
    }
  };

  const [isAdding, setIsAdding] = useState(false);
  const handleAdd = async (newAstronaut: Partial<Astronaut>) => {
    try {
      const res = await fetch(`${apiUrl}/astronauts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAstronaut),
      });
      if (res.ok) {
        const addedAstronaut = await res.json();
        console.log(addedAstronaut);
        setAstronauts((prevAstronauts) => [...prevAstronauts, addedAstronaut.astronaut]);
        setSelectedAstronaut(null);
        setIsAdding(false);
        resetLogMessage();
      }
    } catch (error) {
      console.error('Error adding astronaut:', error);
    }
  };

  const resetLogMessage = () => {
    setTimeout(() => {
      setLogMessage('Calling Houston...');
    }, 3000);
  };

  useEffect(function () {
    getAstronauts();
  }, []);

  return (
    <div className="App">
      {showModal && <Modal onClose={() => setShowModal(false)} />}
      <BackgroundCanvas />
      <div className="App-body">
        <LeftPanel
          astronauts={astronauts}
          setAstronauts={setAstronauts}
          onAstronautClick={handleAstronautClick}
          setIsAdding={setIsAdding}
          setLogMessage={setLogMessage} />
        <MiddlePanel
          selectedAstronaut={selectedAstronaut}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          onAdd={handleAdd}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          setSelectedAstronaut={setSelectedAstronaut} />
        <RightPanel
          logMessage={logMessage}
        />
      </div>
    </div >
  );
}

export default App;
