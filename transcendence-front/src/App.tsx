import React from 'react';
import './App.css';
import { useCallback, useState } from 'react';
import LoginCard from './components/LoginCard'
  
  function App() {
  return (
    <>
      <head>
        <title>ft_transcendence</title>
        <meta name="description" content="ft_transcendence" />
        <link rel="icon" href="/42.ico" />
      </head>

      <main>
          <LoginCard/>
      </main>
    </>
  );
}

export default App;
