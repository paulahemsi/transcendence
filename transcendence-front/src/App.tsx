import React from 'react';
import './App.css';
import { useCallback, useState } from 'react';
import LoginCard from './components/LoginCard'
import Home from './components/Home'

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
      </main>
    </>
  );
}

export default App;
