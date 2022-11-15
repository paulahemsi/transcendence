import React, { FunctionComponent, useEffect, useState } from "react";
import { Typography, Box, Button, Card, CardContent, CardActions } from '@mui/material';
import Header from "./header/Header";
import { Footer } from "./footer/Footer";
import ChatDrawer from "./chatDrawer/ChatDrawer";
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

export interface EndGameData {
	player1Name: string,
	player2Name: string,
	winner: 1 | 2 | undefined
}

interface EndGameCardProps {
	endGameDisplay: EndGameData
	setEndGameVisible: React.Dispatch<React.SetStateAction<boolean>>
	setGameActive: React.Dispatch<React.SetStateAction<boolean>>
}


const EndGameCard: FunctionComponent<EndGameCardProps> = ({endGameDisplay, setEndGameVisible, setGameActive}) => {
	return (
		<Box display="flex" position="absolute" justifyContent="center" alignItems="center" height="100vh" width="100vw" sx={{backgroundColor: 'rgba(0,0,0,0.5)',}}>
			<Card sx={{
					width: 500,
					height: 230,
					background: '#F5F5F5',
					borderRadius: 3,
					boxShadow: 5
					}}>
					<CardContent style={{ paddingLeft: 35, paddingTop: 25 }}>
						<Typography align="left" sx={{ fontSize: 24, fontFamily: 'Orbitron', fontWeight: 500}}>
							{endGameDisplay.winner == 1 ? endGameDisplay.player1Name : endGameDisplay.player2Name} is the winner!
						</Typography>
					</CardContent>
					<CardActions sx={{ justifyContent: 'center', paddingTop: 8 }}>
						<Button 
							variant="contained"
							onClick={() => {setEndGameVisible(false); setGameActive(false);}}
							size="large"
							sx={{ 
								width: 150,
								height: 55,
								background: '#9575CD',
								':hover': { background: '#311B92'},
								textTransform: 'lowercase',
								fontFamily: 'Orbitron',
								fontSize: 20,
								color: '#f5f5f5'
							}}>
							return
						</Button>
					</CardActions>
			</Card>
		</Box>
	);
}

const GameScreen = ({ setGameActive } : { setGameActive: React.Dispatch<React.SetStateAction<boolean>>}) => {
	const[ score, setScore ] = useState<number[]>([0, 0]);
	const[ endGameVisible, setEndGameVisible ] = useState<boolean>(false);
	const[ endGameDisplay, setEndGameDisplay ] = useState<EndGameData>({player1Name: "player1", player2Name: "player2", winner: 1});
	return (
		<Box position={'relative'}>
			<Box position={'absolute'}>
				<Typography textAlign={'right'} sx={player1Score}>
					{score[0]}
				</Typography>
			</Box>
				<Box display="flex" flexDirection="column" justifyContent="center" position="absolute" alignItems="center" height="90vh" width="100vw">
					<Box position={'absolute'} sx={{
						backgroundColor: 'rgba(255,255,255,0.8)',
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
			<Box zIndex={9} position={'absolute'}>
				<PhaserGame setScore={setScore} setEndGameVisible={setEndGameVisible} setEndGameDisplay={setEndGameDisplay} />
			</Box>
			{ endGameVisible ? <EndGameCard endGameDisplay={endGameDisplay} setEndGameVisible={setEndGameVisible} setGameActive={setGameActive} /> : null }
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

export const Home = ({ setLoggedIn } : { setLoggedIn: booleanSetState}) => {
	const tokenData: tokenData = jwt(document.cookie);

	const [openDrawer, setOpenDrawer] = useState(false)
	const [openCard, setOpenCard] = useState(false)
	const [gameActive, setGameActive] = useState(false);
	

	sessionSocket.connect()

	return (
		<>
			{ gameActive ? null : <Header setOpenDrawer={setOpenDrawer} setOpenCard={setOpenCard} /> }
			{ openCard && <ProfileCard setOpenCard={setOpenCard}  userId={tokenData.id}/> }
			{ openDrawer && <ChatDrawer setOpenDrawer={setOpenDrawer} /> }
			{ gameActive ? <GameScreen setGameActive={setGameActive}/> : <Background setGameActive={setGameActive} /> }
			{ gameActive ? null : <Footer setLoggedIn={setLoggedIn}/> }
		</>
	);
}

export default Home
