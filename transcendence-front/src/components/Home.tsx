import React, { useState } from "react";
import { Typography, Box, Button, DialogTitle, DialogActions, Dialog, Card, CardContent, CardActions, CircularProgress  } from '@mui/material';
import Header from "./header/Header";
import { Footer } from "./footer/Footer";
import ChatDrawer from "./chatDrawer/ChatDrawer";
import jwt from 'jwt-decode';
import io from 'socket.io-client';
import ProfileCard from "./profileDrawer/ProfileDrawer";
import { Navigate } from "react-router-dom";
import Loading from "./chatDrawer/Loading";

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

export interface EndGameData {
	player1Name: string,
	player2Name: string,
	winner: 1 | 2 | undefined
}

const Matchmaker = ({ setGameActive, setOpenDialog, userId, setIsHost } : { setGameActive: booleanSetState,  setOpenDialog: booleanSetState, userId: string, setIsHost: booleanSetState }) => {
	const tokenData: tokenData = jwt(document.cookie);
	
	const [goGame, setGoGame] = useState(false);
	const [loading, setLoading] = useState(false);

	const joinGameQueue = () => {
		sessionSocket.emit('joinGameQueue');
		setLoading(true);
		console.log(`User ${userId} wanna play`)
	}
	
	sessionSocket.on('joinGameQueue', (match) => {
		if (match.player1 == tokenData.id) {
			setIsHost(true);
		} else {
			setIsHost(false);
		}
		setLoading(false);
		setGoGame(true)
	} )

	if (goGame) {
		return (<Navigate to='/game'/>)
	}

	if (loading) {
		return (
			<>
				<DialogTitle sx={{fontFamily: 'Orbitron'}}>
					Searching for an opponent...
				</DialogTitle>
				<DialogActions sx={{justifyContent: "center", margin: '2vh'}}>
					<Box display="flex" justifyContent="center" alignItems="center">
						<CircularProgress />
					</Box>
				</DialogActions>
			</>
		)
	}
	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			How do you wanna play?
		</DialogTitle>
		<DialogActions>
		<Button
			onClick={joinGameQueue}
			sx={{fontFamily: 'Orbitron'}}
		>
			With someone
		</Button>
		<Button
			variant="contained"
			onClick={() => setGameActive(true)}
			sx={{fontFamily: 'Orbitron'}}
		>
			Alone with myself
		</Button>
		</DialogActions>
		{/* <ErrorToast state={state} setState={setState}/> */}
	</>
	)
}

const Background = ({ setGameActive, userId, setIsHost } : { setGameActive: booleanSetState, userId: string, setIsHost: booleanSetState }) => {
	const [ openDialog, setOpenDialog ] = useState(false);

	const handleClose = () => {
		setOpenDialog(false);
	}

	return (
		<>
			<Box display="flex" flexDirection="column" justifyContent="center" position="fixed" alignItems="center" height="86vh" width="100vw" sx={{backgroundImage: 'linear-gradient(to right, #212980 , #6f0162)'}}>
				<Typography sx={transcendenceText}>
					ft_transcendence
				</Typography>
				<Button variant="outlined" size="medium" onClick={() => setOpenDialog(true)}
					sx={startGameButton}>
					Start Game
				</Button>
			</Box>
			<Dialog open={openDialog} fullWidth maxWidth="sm" onClose={handleClose}>
				<Matchmaker setOpenDialog={setOpenDialog} setGameActive={setGameActive} userId={userId}  setIsHost={setIsHost}/>
			</Dialog>
		</>
	);
}

export const Home = ({ setLoggedIn, setIsHost } : { setLoggedIn: booleanSetState, setIsHost: booleanSetState}) => {
	const tokenData: tokenData = jwt(document.cookie);

	const [openDrawer, setOpenDrawer] = useState(false)
	const [openCard, setOpenCard] = useState(false)
	const [gameActive, setGameActive] = useState(false);

	sessionSocket.connect()

	if (gameActive) {
		return (<Navigate to='/game'/>)
	}

	return (
		<>
			{ <Header setOpenDrawer={setOpenDrawer} setOpenCard={setOpenCard} /> }
			{ openCard && <ProfileCard setOpenCard={setOpenCard}  userId={tokenData.id}/> }
			{ openDrawer && <ChatDrawer setOpenDrawer={setOpenDrawer} /> }
			{ <Background setGameActive={setGameActive} userId={tokenData.id} setIsHost={setIsHost}/> }
			{ <Footer setLoggedIn={setLoggedIn}/> }
		</>
	);
}

export default Home
