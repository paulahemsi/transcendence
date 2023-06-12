import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { useState } from 'react';
import LoginCard from './components/LoginCard'
import Home from './components/Home'
import jwt from 'jwt-decode';
import TwoFactorAuthCard from './components/TwoFactorAuthCard';
import GamePage from './components/GamePage';
import { booleanSetState, stringSetState } from './components/utils/constants';
import { MatchContext } from './components/context/MatchContext';

type tokenData = {
	id: string;
	exp: number;
}

function validateToken(cookie: string) {
  const currentDate = new Date();
	const tokenData: tokenData = jwt(cookie);
	if (tokenData.exp * 1000 < currentDate.getTime()) {
		return false;
	}
	return true;

}

function isLoggedIn() {
  const cookie = document.cookie;
  if (!cookie.includes("accessToken"))
    return false;
  return validateToken(cookie);
}

const PreHome = ({setIsHost, setIsSpectator, setMatchRoom,  setStandardMode } : {
  setIsHost: booleanSetState
  setIsSpectator: booleanSetState
  setMatchRoom: stringSetState
  setStandardMode: booleanSetState
}) => {

  const loggedIn = isLoggedIn();

	return (
    <main>
      {loggedIn
      ? <Home
          setIsHost={setIsHost}
          setIsSpectator={setIsSpectator}
          setMatchRoom={setMatchRoom} 
          setStandardMode={setStandardMode}
        />
      : <LoginCard/> }
    </main>
	);
}

function App() {
  const [isHost, setIsHost] = useState(false);
  const [isSpectator, setIsSpectator] = useState(false);
  const [matchRoom, setMatchRoom] = useState('');
  const [standardMode, setStandardMode] = useState(true);
  const [matchInfos, setMatchInfos] = useState<{ id: string; player1: string; player2: string }>({
    id: '',
    player1: '',
    player2: '',
  });
  
  return (
    <BrowserRouter>
      <MatchContext.Provider value={{ matchInfos, setMatchInfos }}>
        <Routes>
          <Route path='/' element={
            <PreHome
              setIsHost={setIsHost}
              setIsSpectator={setIsSpectator}
              setMatchRoom={setMatchRoom}
              setStandardMode={setStandardMode}
            />}
          />
          <Route path='/login' element={<LoginCard/>} />
          <Route path='/2fa' element={<TwoFactorAuthCard/>} />
          <Route path='/game' element={
            <GamePage
              isHost={isHost}
              isSpectator={isSpectator}
              matchRoom={matchRoom}
              standardMode={standardMode}
            />}
          />
        </Routes>
      </MatchContext.Provider>
    </BrowserRouter>
  );
}

export default App;
