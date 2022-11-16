import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import { useState } from 'react';
import LoginCard from './components/LoginCard'
import Home from './components/Home'
import jwt from 'jwt-decode';
import TwoFactorAuthCard from './components/TwoFactorAuthCard';
import GamePage from './components/GamePage';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

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

const PreHome = ({setIsHost} : {setIsHost: booleanSetState}) => {
  const[ loggedIn, setLoggedIn ] = useState(isLoggedIn());

	return (
    <main>
      {loggedIn
      ? <Home setLoggedIn={setLoggedIn} setIsHost={setIsHost}/>
      : <LoginCard/> }
    </main>
	);
}

function App() {
  const [isHost, setIsHost] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PreHome setIsHost={setIsHost}/>} />
        <Route path='/login' element={<LoginCard/>} />
        <Route path='/2fa' element={<TwoFactorAuthCard/>} />
        <Route path='/game' element={<GamePage isHost={isHost}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
