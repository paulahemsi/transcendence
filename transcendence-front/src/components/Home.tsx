import React, { useContext, useEffect, useReducer, useState } from "react";
import { Typography, Box, Button, DialogTitle, DialogActions, Dialog, CircularProgress  } from '@mui/material';
import Header from "./header/Header";
import { Footer } from "./footer/Footer";
import ChatDrawer from "./chatDrawer/ChatDrawer";
import ProfileCard from "./profileDrawer/ProfileDrawer";
import { Navigate } from "react-router-dom";
import { chatSocket, gameSocket, sessionSocket } from "./context/socket";
import { booleanSetState, getIdFromToken, reducer, stringSetState } from "./utils/constants";
import { MatchInfos, MatchInviteAnswer, matchInfosSetState } from "./utils/match-interfaces";
import ErrorToast from "./utils/ErrorToast";
import { MatchContext } from './context/MatchContext';


const NO_ONE_AVAILABLE = "Ooops, nobody wanna play right now. Try again later"

const startGameButton = {
	borderRadius: 3,
	textTransform: 'lowercase',
	background: '#F5F5F5',
	borderColor: '#FFFFFF',
	color: '#212980',
	':hover': { background: '#F5F5F5', borderColor: '#FFFFFF', color: '#9575CD'},
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

const backgroundStyle = {
	background: 'linear-gradient(-90deg, #6f0162, #a200a8, #4800a0, #090d38)',
	backgroundSize: '350% 350%',
	animation: 'gradient 10s ease infinite',
	height: '100vh',
	'@keyframes gradient': {
		'0%': {
			backgroundPosition: '0% 50%',
		},
		'50%': {
			backgroundPosition: '100% 50%',
		},
		'100%': {
			backgroundPosition: '0% 50%',
		},
	}
}

const Matchmaker = ({
	userId,
	setIsHost,
	setMatchRoom,
	setStandardMode,
	setCanClose,
} : {
	userId: string,
	setIsHost: booleanSetState,
	setMatchRoom: stringSetState,
	setStandardMode: booleanSetState,
	setCanClose: booleanSetState,
}) => {
	const { setMatchInfos } = useContext(MatchContext);
	const [state, setState] = useReducer(reducer, {
		goGame: false,
		loading: false,
		toastError: false,
		toastMessage: NO_ONE_AVAILABLE,
	});

	const joinGameQueue = () => {
		sessionSocket.emit('joinGameQueue');
		setState({ loading: true });
		setCanClose(false);
		setTimeout(() => {
			setState({ loading: false });
			setState({ toastError: true, toastMesasge: NO_ONE_AVAILABLE });
			setCanClose(true);
		}, 25000)
	}
	
	sessionSocket.on('joinGameQueue', (match: MatchInfos) => {
		if (match.player1 == userId) {
			setIsHost(true);
		} else {
			setIsHost(false);
		}
		setMatchRoom(match.id);
		setMatchInfos(match);
		setState({ loading: false });
		setState({ goGame: true });
	} )

	if (state.goGame) {
		return (<Navigate to='/game'/>)
	}

	if (state.loading) {
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
			Standard one
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
		<ErrorToast state={state} setState={setState}/>
	</>
	)
}

const Background = ({
	userId,
	setIsHost,
	setMatchRoom,
	setStandardMode,
} : {
	userId: string,
	setIsHost: booleanSetState,
	setMatchRoom: stringSetState,
	setStandardMode: booleanSetState,
}) => {
	const [ openDialog, setOpenDialog ] = useState(false);
	const [ canClose, setCanClose ] = useState(true);

	const handleClose = () => {
		if (canClose) {
			setOpenDialog(false);
		}
	}

	return (
		<>
			<Box display="flex" flexDirection="column" justifyContent="center" position="fixed" alignItems="center" height="86vh" width="100vw" sx={backgroundStyle}>
				<Typography sx={transcendenceText}>
					ft_transcendence
				</Typography>
				<Button variant="outlined" size="medium" onClick={() => setOpenDialog(true)}
					sx={startGameButton}>
					Start Game
				</Button>
			</Box>
			<Dialog open={openDialog} fullWidth maxWidth="sm" onClose={handleClose} >
				<Matchmaker
					userId={userId}
					setIsHost={setIsHost}
					setMatchRoom={setMatchRoom}
					setStandardMode={setStandardMode}
					setCanClose={setCanClose}
				/>
			</Dialog>
		</>
	);
}

const AcceptGameInvite = ({ setIsHost, setGameActive, setOpenDialog, matchInfos, setStandardMode} : {
	setIsHost: booleanSetState, setGameActive: booleanSetState, setOpenDialog: booleanSetState, matchInfos: MatchInfos, setStandardMode: booleanSetState,
}) => {
	
	const userId = getIdFromToken();
	const handleAccept = () => {
		const answer: MatchInviteAnswer = {
			matchInfos: matchInfos,
			accepted: true,
		}			
		sessionSocket.emit('answerToGameRequest', answer);
		setIsHost(false);
		setGameActive(true);
	}
	
	const handleDecline = () => {
		const answer: MatchInviteAnswer = {
			matchInfos: matchInfos,
			accepted: false,
		}			
		sessionSocket.emit('answerToGameRequest', answer);
		setOpenDialog(false);
	}
	
	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			Uha! A friend wants to pong!
			Which mode do you wanna play?
		</DialogTitle>
		<DialogActions>
		<Button
			variant="contained"
			onClick={ () => {
				setStandardMode(true);
				handleAccept()
			}
			}
			sx={{fontFamily: 'Orbitron'}}
		>
			Standard
		</Button>
		<Button
			variant="contained"
			onClick={ () => {
				setStandardMode(false);
				handleAccept()
			}
			}
			sx={{fontFamily: 'Orbitron'}}
		>
			Unicorn
		</Button>
		<Button
			onClick={handleDecline}
			sx={{fontFamily: 'Orbitron'}}
		>
			
			None, decline
		</Button>
		</DialogActions>
	</>
	)
}

function listenPlayWithFriend(
	userId: string,
	setMatchInfos: matchInfosSetState,
	setMatchRoom: stringSetState,
	setOpenDialog: booleanSetState,
	) {
	sessionSocket.off('playWithFriend').on('playWithFriend', (matchInfosInvite: MatchInfos) => {
		if (matchInfosInvite.player2 == userId) {
			setMatchInfos(matchInfosInvite);
			setMatchRoom(matchInfosInvite.id);
			setOpenDialog(true);
			setTimeout(() =>{
				const answer: MatchInviteAnswer = {
					matchInfos: matchInfosInvite,
					accepted: false,
				}
				sessionSocket.emit('answerToGameRequest', answer);
				setOpenDialog(false);
			}, 20000);
		}
	} )
}

function listenWatchGame(
	setMatchRoom: stringSetState,
	setGameActive: booleanSetState,
	setIsSpectator: booleanSetState
	) {
	gameSocket.off('watchGame').on('watchGame', (gameRoom: string) => {
		setMatchRoom(gameRoom);
		setGameActive(true);
		setIsSpectator(true);
	})
}

export const Home = ({
	setIsHost,
	setIsSpectator,
	setMatchRoom,
	setStandardMode
} : {
	setIsHost: booleanSetState,
	setIsSpectator: booleanSetState
	setMatchRoom: stringSetState,
	setStandardMode: booleanSetState,
}) => {
	const [openDrawer, setOpenDrawer] = useState(false)
	const [openCard, setOpenCard] = useState(false)
	const [gameActive, setGameActive] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);
	const { matchInfos, setMatchInfos } = useContext(MatchContext);

	const userId = getIdFromToken();

	useEffect(() => {
		sessionSocket.connect()
		gameSocket.connect()
		chatSocket.connect()
	}, []);

	listenPlayWithFriend(userId, setMatchInfos, setMatchRoom, setOpenDialog);
	listenWatchGame(setMatchRoom, setGameActive, setIsSpectator);

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
	
			{ <Background
				userId={userId}
				setIsHost={setIsHost}
				setMatchRoom={setMatchRoom}
				setStandardMode={setStandardMode}
			  /> }
			{ openDrawer &&
				<ChatDrawer
					setOpenDrawer={setOpenDrawer}
					setIsHost={setIsHost}
					setGameActive={setGameActive}
					setMatchRoom={setMatchRoom}
					setStandardMode={setStandardMode}
					/> }
			{ <Footer/> }
			<Dialog open={openDialog} fullWidth maxWidth="sm" onClose={handleClose}>
				<AcceptGameInvite
					setIsHost={setIsHost}
					setGameActive={setGameActive}
					matchInfos={matchInfos}
					setOpenDialog={setOpenDialog}
					setStandardMode={setStandardMode}
					/>
			</Dialog>
		</>
	);
}

export default Home
