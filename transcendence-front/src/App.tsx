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
  return (
    <>
      <head>
        <title>ft_transcendence</title>
        <meta name="description" content="ft_transcendence" />
        <link rel="icon" href="/42.ico" />
      </head>

      <main>
          {isLoggedIn()
          ? <Home />
          : <LoginCard/> }
      </main>
    </>
  );
}

export default App;
