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
import { MatchInfos } from './components/utils/match-interfaces';

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

const PreHome = ({setIsHost, setIsSpectator, setMatchRoom, matchInfos ,setMatchInfos, setStandardMode } : {
  setIsHost: booleanSetState
  setIsSpectator: booleanSetState
  setMatchRoom: stringSetState
  matchInfos: MatchInfos
  setMatchInfos: React.Dispatch<React.SetStateAction<MatchInfos>>
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
          matchInfos={matchInfos}
          setMatchInfos={setMatchInfos}
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
  const [matchInfos, setMatchInfos] = useState<MatchInfos>({
    id: '',
    player1: '',
    player2: '',
  });
  
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <PreHome
              setIsHost={setIsHost}
              setIsSpectator={setIsSpectator}
              setMatchRoom={setMatchRoom}
              matchInfos={matchInfos} 
              setMatchInfos={setMatchInfos}
              setStandardMode={setStandardMode}
            />}
          />
          <Route path='/login' element={<LoginCard/>} />
          <Route path='/2fa' element={<TwoFactorAuthCard/>} />
          <Route path='/game' element={
            <GamePage
              isHost={isHost}
              isSpectator={isSpectator}
              setIsSpectator={setIsSpectator}
              matchRoom={matchRoom}
              matchInfos={matchInfos} 
              standardMode={standardMode}
            />}
          />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
