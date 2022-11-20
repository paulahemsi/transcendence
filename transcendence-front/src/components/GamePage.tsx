import React, { FunctionComponent, useState } from "react";
import { Typography, Box, Button, Card, CardContent, CardActions  } from '@mui/material';
import { PhaserGame } from "./game/game"
import { Navigate } from "react-router-dom";
import { booleanSetState } from "./utils/constants";

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
	disconnected: boolean,
	player1Name: string,
	player2Name: string,
	winner: 1 | 2 | undefined
}

interface EndGameCardProps {
	endGameDisplay: EndGameData
	setEndGameVisible: booleanSetState 
	setGameActive: booleanSetState 
}


const EndGameCard: FunctionComponent<EndGameCardProps> = ({endGameDisplay, setEndGameVisible, setGameActive}) => {
	
	function endGameContent() {
		if (endGameDisplay.disconnected) {
			return ('The game ended because one of the players disconnected');
		}
		const winner = endGameDisplay.winner == 1 ? endGameDisplay.player1Name : endGameDisplay.player2Name;
		return ( winner + ' is the winner!');
	}

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
							{endGameContent()} 
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

const GamePage = ({isHost, matchRoom} : {isHost: boolean, matchRoom: string}) => {
	const [ score, setScore ] = useState<number[]>([0, 0]);
	const [ endGameVisible, setEndGameVisible ] = useState<boolean>(false);
	const [ endGameDisplay, setEndGameDisplay ] = useState<EndGameData>({ disconnected:false, player1Name: "player1", player2Name: "player2", winner: 1});
	const [ gameActive, setGameActive ] = useState(true);

	if (gameActive === false) {
		return (<Navigate to='/'/>)
	}

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
				<PhaserGame
					setScore={setScore}
					setEndGameVisible={setEndGameVisible}
					setEndGameDisplay={setEndGameDisplay}
					isHost={isHost}
					matchRoom={matchRoom}
				/>
			</Box>
			{ endGameVisible ? <EndGameCard endGameDisplay={endGameDisplay} setEndGameVisible={setEndGameVisible} setGameActive={setGameActive} /> : null }
		</Box>
	);
}

export default GamePage 
