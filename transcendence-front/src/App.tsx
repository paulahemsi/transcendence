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
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          React Documentation
        </a>
      </header>
    </div>
  );
}

export default App;
