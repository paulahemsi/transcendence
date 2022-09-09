import React from 'react';
import './App.css';
import { useCallback, useState } from 'react';
import LoginCard from './components/LoginCard'
import Home from './components/Home'


  function App() {
    let cookie= document.cookie;
		console.log('cookie', cookie.includes("accessToken"));
  return (
    <>
      <head>
        <title>ft_transcendence</title>
        <meta name="description" content="ft_transcendence" />
        <link rel="icon" href="/42.ico" />
      </head>

      <main>
          {cookie.includes("accessToken")
          ? <Home />
          : <LoginCard/> }
      </main>
    </>
  );
}

export default App;
