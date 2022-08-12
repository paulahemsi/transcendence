import React from 'react';
import Button from '@mui/material/Button';
import avocado from './avocado.svg';
import './App.css';
import axios from 'axios';

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
        <Button variant="contained" onClick={handleClick} color="secondary">
          <p>Hello, Abacatinho</p>
        </Button>
      </header>
    </div>
  );
}

export default App;
