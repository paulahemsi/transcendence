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
      <main>
          {isLoggedIn()
          ? <Home />
          : <LoginCard/> }
      </main>
    </>
  );
}

export default App;
