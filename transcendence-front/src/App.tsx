import React from 'react';
import './App.css';
import { useState } from 'react';
import LoginCard from './components/LoginCard'
import Home from './components/Home'
import { PhaserGame } from './components/game/game';

  function isLoggedIn() {
    let cookie = document.cookie;
    return (cookie.includes("accessToken") ? true : false);
  }

  function App() {
    const[ loggedIn, setLoggedIn ] = useState(isLoggedIn());
    return (
    <>
      <main>
          {loggedIn
          ? <Home setLoggedIn={setLoggedIn}/>
          : <LoginCard/> }
          <PhaserGame />
      </main>
    </>
  );
}

export default App;
