import React, { useEffect, useState } from "react";
import { Typography, Box, Button } from '@mui/material';
import Header from "./header/Header";
import { Footer } from "./footer/Footer";
import ChatDrawer from "./chatDrawer/ChatDrawer";
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import io from 'socket.io-client';
import ProfileCard from "./profileDrawer/ProfileDrawer";
import { PhaserGame } from "./game/game"

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
}

const sessionSocket = io('/session');

const startGameButton = {
	borderRadius: 3,
	textTransform: 'lowercase',
	background: '#F5F5F5',
	borderColor: '#311B92',
	color: '#212980',
	':hover': { background: '#F5F5F5', borderColor: '#9575CD', color: '#9575CD'},
	fontFamily: 'Orbitron',
	fontSize: '4vh',
	paddingLeft: '5vh',
	paddingRight: '5vh',
	fontWeight: 'bold'
}

const transcendenceText = {
	fontSize: '14vh',
	fontFamily: 'Orbitron',
	fontWeight: 500,
	color: '#FFFFFF',
	textShadow: '0px 0px 6px #FFFFFF',
	margin: '2vh'
}


const Background = ({ setGameActive } : { setGameActive: booleanSetState}) => {
	return (
		<Box display="flex" flexDirection="column" justifyContent="center" position="fixed" alignItems="center" height="86vh" width="100vw" sx={{backgroundImage: 'linear-gradient(to right, #212980 , #6f0162)'}}>
			<Typography sx={transcendenceText}>
				ft_transcendence
			</Typography>
			<Button variant="outlined" size="medium" onClick={() => setGameActive(true)}
				sx={startGameButton}>
				Start Game
			</Button>
		</Box>
	);
}

const requestFriendsData = async ({ setFriendsData } : { setFriendsData: React.Dispatch<React.SetStateAction<{[key: string]: any}>>}) => {

	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	
	await axios.get(`http://localhost:3000/users/${tokenData.id}/friends`, { headers: authToken }).then((response) => {
		setFriendsData(response.data);
})
}

export const Home = ({ setLoggedIn } : { setLoggedIn: booleanSetState}) => {
	
	const [openDrawer, setOpenDrawer] = useState(false)
	const [openCard, setOpenCard] = useState(false)
	const [friendsData, setFriendsData] = useState<{[key: string]: any}>({});
	const [gameActive, setGameActive] = useState(false);
	
	useEffect(() => {requestFriendsData({setFriendsData})}, []);

	sessionSocket.connect()

	return (
		<>
			<Header setOpenDrawer={setOpenDrawer} setOpenCard={setOpenCard} numberOfFriends={friendsData.length}/>
			{ openCard && <ProfileCard setOpenCard={setOpenCard}/> }
			{ openDrawer && <ChatDrawer friendsData={friendsData} setOpenDrawer={setOpenDrawer} setFriendsData={setFriendsData} />}
			{ gameActive ? <PhaserGame/> : <Background setGameActive={setGameActive} />}
			<Footer setLoggedIn={setLoggedIn}/>
		</>
	);
}

export default Home
