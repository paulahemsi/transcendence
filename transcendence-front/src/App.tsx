import React from 'react';
import './App.css';
import { useState } from 'react';
import LoginCard from './components/LoginCard'
import Home from './components/Home'
import jwt from 'jwt-decode';

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
