import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
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

export const PreHome = () => {
  const[ loggedIn, setLoggedIn ] = useState(isLoggedIn());

	return (
    <main>
      {loggedIn
      ? <Home setLoggedIn={setLoggedIn}/>
      : <LoginCard/> }
    </main>
	);
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PreHome/>} />
        <Route path='/login' element={<LoginCard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
