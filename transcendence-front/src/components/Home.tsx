import React, { useState } from "react";
import { Typography, Box, Button, DialogTitle, DialogActions, Dialog, CircularProgress  } from '@mui/material';
import Header from "./header/Header";
import { Footer } from "./footer/Footer";
import ChatDrawer from "./chatDrawer/ChatDrawer";
import ProfileCard from "./profileDrawer/ProfileDrawer";
import { Navigate } from "react-router-dom";
import { chatSocket, sessionSocket } from "./context/socket";
import { booleanSetState, getIdFromToken, stringSetState } from "./utils/constants";

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

interface MatchInfos {
  id: string;
  player1: string;
  player2: string;
}

const Matchmaker = ({
	setGameActive,
	setOpenDialog,
	userId,
	setIsHost,
	setMatchRoom,
	setStandardMode,
} : {
	setGameActive: booleanSetState, 
	setOpenDialog: booleanSetState,
	userId: string,
	setIsHost: booleanSetState,
	setMatchRoom: stringSetState,
	setStandardMode: booleanSetState,
}) => {
	const [goGame, setGoGame] = useState(false);
	const [loading, setLoading] = useState(false);

	const joinGameQueue = () => {
		sessionSocket.emit('joinGameQueue');
		setLoading(true);
		console.log(`User ${userId} wanna play`)
	}
	
	sessionSocket.on('joinGameQueue', (match: MatchInfos) => {
		if (match.player1 == userId) {
			setIsHost(true);
		} else {
			setIsHost(false);
		}
		setMatchRoom(match.id);
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
			Which pong do you wanna play?
		</DialogTitle>
		<DialogActions>
		<Button
			onClick={() => {
				setStandardMode(true)
				joinGameQueue();
			}}
			sx={{fontFamily: 'Orbitron'}}
		>
			Stardard one
		</Button>
		<Button
			variant="contained"
			onClick={() => {
				setStandardMode(false)
				joinGameQueue();
			}}
			sx={{fontFamily: 'Orbitron'}}
		>
			Unicorn one
		</Button>
		</DialogActions>
		{/* <ErrorToast state={state} setState={setState}/> */}
	</>
	)
}

const Background = ({
	setGameActive,
	userId,
	setIsHost,
	setMatchRoom,
	setStandardMode,
} : {
	setGameActive: booleanSetState,
	userId: string,
	setIsHost: booleanSetState,
	setMatchRoom: stringSetState,
	setStandardMode: booleanSetState,
}) => {
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
				<Matchmaker
					setOpenDialog={setOpenDialog}
					setGameActive={setGameActive}
					userId={userId}
					setIsHost={setIsHost}
					setMatchRoom={setMatchRoom}
					setStandardMode={setStandardMode}
				/>
			</Dialog>
		</>
	);
}

const AcceptGameInvite = ({ setIsHost, setGameActive, setOpenDialog, chatRoom} : { setIsHost: booleanSetState, setGameActive: booleanSetState, setOpenDialog: booleanSetState, chatRoom: number }) => {
	
	const handleAccept = () => {
		const answer = {
			room: chatRoom,
			accepted: true,
		}
		chatSocket.emit('answerToGameRequest', answer);
		setIsHost(false);
		setGameActive(true);
	}
	
	const handleDecline = () => {
		const answer = {
			room: chatRoom,
			accepted: false,
		}
		chatSocket.emit('answerToGameRequest', answer);
		setOpenDialog(false);
	}
	
	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			Uha! A friend whant to play pong with you!
		</DialogTitle>
		<DialogActions>
		<Button
			onClick={handleAccept}
			sx={{fontFamily: 'Orbitron'}}
		>
			Accept
		</Button>
		<Button
			variant="contained"
			onClick={handleDecline}
			sx={{fontFamily: 'Orbitron'}}
		>
			Decline
		</Button>
		</DialogActions>
	</>
	)
}

export const Home = ({
	setLoggedIn,
	setIsHost,
	setMatchRoom,
	setStandardMode
} : {
	setLoggedIn: booleanSetState,
	setIsHost: booleanSetState,
	setMatchRoom: stringSetState,
	setStandardMode: booleanSetState,
}) => {
	const [openDrawer, setOpenDrawer] = useState(false)
	const [openCard, setOpenCard] = useState(false)
	const [gameActive, setGameActive] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const [chatRoom, setChatRoom] = useState(0);
	const userId = getIdFromToken();

	sessionSocket.connect()

	chatSocket.off('playWithFriend').on('playWithFriend', (game) => {
		if (game.player2 == userId) {
			setChatRoom(game.room);
			setOpenDialog(true);
			setTimeout(() =>{
				const answer = {
					room: chatRoom,
					accepted: false,
				}
				chatSocket.emit('answerToGameRequest', answer);
				setOpenDialog(false);
			}, 20000);
		}
	} )

	if (gameActive) {
		return (<Navigate to='/game'/>)
	}
	
	const handleClose = () => {
		setOpenDialog(false);
	};

	return (
		<>
			{ <Header setOpenDrawer={setOpenDrawer} setOpenCard={setOpenCard} /> }
			{ openCard && <ProfileCard setOpenCard={setOpenCard}  userId={userId}/> }
			{ openDrawer && <ChatDrawer setOpenDrawer={setOpenDrawer} setIsHost={setIsHost} setGameActive={setGameActive}/> }
			{ <Background
				setGameActive={setGameActive}
				userId={userId}
				setIsHost={setIsHost}
				setMatchRoom={setMatchRoom}
				setStandardMode={setStandardMode}
			  /> }
			{ <Footer setLoggedIn={setLoggedIn}/> }
			<Dialog open={openDialog} fullWidth maxWidth="sm" onClose={handleClose}>
				<AcceptGameInvite setIsHost={setIsHost} setGameActive={setGameActive} chatRoom={chatRoom} setOpenDialog={setOpenDialog} />
			</Dialog>
		</>
	);
}

export default Home
