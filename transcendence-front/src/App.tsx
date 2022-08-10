import React from 'react';
import avocado from './avocado.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={avocado} className="App-avocado" alt="avocado" />
        <p>
          MINIHELL TEAM IS BACK, BABY!
        </p>
        <button onClick={handleClick} className="Button">
          <p>Hello, Abacatinho</p>
        </button>
      </header>
    </div>
  );
}

export default App;
