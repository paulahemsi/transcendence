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

const player1Score = {
	fontSize: '14vh',
	fontFamily: 'Orbitron',
	fontWeight: 500,
	color: '#FFFFFF',
	textShadow: '0px 0px 6px #FFFFFF',
	margin: '2vh',
	bottom: '2%',
	left: '35%',
	position: 'fixed'
}

const player2Score = {
	fontSize: '14vh',
	fontFamily: 'Orbitron',
	fontWeight: 500,
	color: '#FFFFFF',
	textShadow: '0px 0px 6px #FFFFFF',
	margin: '2vh',
	bottom: '2%',
	right: '35%',
	position: 'fixed'
	
}

const GameScreen = () => {
	const[ score, setScore ] = useState<number[]>([0, 0]);
	return (
		<Box position={'relative'}>
			<Box position={'absolute'}>
				<Typography textAlign={'right'} sx={player1Score}>
				{score[0]}
				</Typography>
			</Box>
			<Box display="flex" flexDirection="column" justifyContent="center" position="absolute" alignItems="center" height="90vh" width="100vw">
			<Box position={'absolute'} sx={{
				backgroundColor: '#FFFFFF',
				height: '80vh',
				width: '0.5vw',
				boxShadow: '0px 0px 6px #FFFFFF',
				borderRadius: 5,
				alignSelf: 'center'
			}}>
			</Box>
			</Box>
			<Box position={'absolute'}>
				<Typography textAlign={'left'} sx={player2Score}>
				{score[1]}
				</Typography>
			</Box>
			<Box zIndex={9}>
				<PhaserGame setScore={setScore}/>
			</Box>
		</Box>
	);
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
			{ gameActive ? null : <Header setOpenDrawer={setOpenDrawer} setOpenCard={setOpenCard} numberOfFriends={friendsData.length}/>}
			{ openCard && <ProfileCard setOpenCard={setOpenCard}/> }
			{ openDrawer && <ChatDrawer friendsData={friendsData} setOpenDrawer={setOpenDrawer} setFriendsData={setFriendsData} />}
			{ gameActive ? <GameScreen/> : <Background setGameActive={setGameActive} />}
			{ gameActive ? null : <Footer setLoggedIn={setLoggedIn}/>}
		</>
	);
}

export default Home
