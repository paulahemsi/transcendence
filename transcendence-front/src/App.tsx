import React from 'react';
import Button from '@mui/material/Button';
import avocado from './avocado.svg';
import './App.css';
import { useCallback, useState } from 'react';
import { Box } from '@mui/material';
import LoginCard from './components/LoginCard'
  
  function App() {
  return (
    <>
      <head>
        <title>ft_transcendence</title>
        <meta name="description" content="ft_transcendence" />
        <link rel="icon" href="/42.svg" />
      </head>

      <main>
        <Box  display="flex" 
              alignItems="center"
              justifyContent="center"
        >
          <LoginCard/>
        </Box>
      </main>
    </>
  );
}

export default App;
