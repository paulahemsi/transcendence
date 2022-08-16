import React from 'react';
import avocado from './avocado.svg';
import './App.css';
import axios from 'axios';
import { useCallback, useState } from 'react';

const handleClick = () => {
  axios
  .get("http://localhost:4444/Abacate")
  .then(response => {
    console.log(response.data);
  });
  }
  
  function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={avocado} className="App-avocado" alt="avocado" />
        <p>
          MINIHELL TEAM IS BACK, BABY!
        </p>
        <button onClick={handleClick} className="Button">
          <p>Faz login, Abacatinho</p>
        </button>
      </header>
    </div>
  );
}

export default App;
