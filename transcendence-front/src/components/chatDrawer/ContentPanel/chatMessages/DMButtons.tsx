import React, { FunctionComponent, useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogActions, CircularProgress } from "@mui/material";
import ProfileCard from "../../../profileDrawer/ProfileDrawer";
import BlockUserDialog from "./BlockUserDialog";
import jwt from 'jwt-decode';
import { chatSocket, sessionSocket } from "../../../context/socket";
import { Navigate } from "react-router-dom";

type tokenData = {
	id: string;
}

const PROFILE = "Go to profile";
const BLOCK = "Block";
const INVITE = "Invite to game";

const buttonCss = {
	width: '15vw',
	height: '6vh',
	background: '#F5F5F5',
	borderRadius: 5,
	border: '3px solid',
	borderColor: '#212980',
	boxShadow: 5,
	':hover': { 
		background: '#B998FF',
		borderColor: '#B998FF'
	}
}

const buttonTypographyCss = {
	textTransform: 'lowercase',
	fontFamily: 'Orbitron',
	fontSize: '2.5vh',
	color: '#311B92',
}

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface askFriendProps {
    setGameActive: booleanSetState;
    setIsHost: booleanSetState;
	setOpenDialog: booleanSetState;
	userId: string;
	friendId: string;
}

interface Props {
    setGameActive: booleanSetState;
    setIsHost: booleanSetState;
	friendId: string;
	activeChannel: number;
}

interface Game {
	room: number;
	player1: string;
	player2: string;
}

const AskFriend: FunctionComponent<askFriendProps> = ({ setGameActive, userId, friendId, setIsHost, setOpenDialog }) => {
	const tokenData: tokenData = jwt(document.cookie);
	const [goGame, setGoGame] = useState(false);

	if (goGame) {
		return (<Navigate to='/game'/>)
	}

	setTimeout(() =>{
		if (!goGame) {
			setOpenDialog(false);
		}
	}, 30000);

	return (
		<>
			<DialogTitle sx={{fontFamily: 'Orbitron'}}>
				Waiting for you opponent..
			</DialogTitle>
			<DialogActions sx={{justifyContent: "center", margin: '2vh'}}>
				<Box display="flex" justifyContent="center" alignItems="center">
					<CircularProgress />
				</Box>
			</DialogActions>
		</>
	)

}

const InviteToGame: FunctionComponent<Props> = ({ setIsHost, setGameActive, friendId, activeChannel }) => {
	const [ openDialog, setOpenDialog ] = useState(false);
	const tokenData: tokenData = jwt(document.cookie);
	
	const handleClick = () => {
		const players: Game = {
			room: activeChannel,
			player1: tokenData.id,
			player2: friendId,
		}
		chatSocket.emit('playWithFriend', players);
		setOpenDialog(true);
	}
	
	chatSocket.off('answerToGameRequest').on('answerToGameRequest', (answer) => {
		if (answer.room != activeChannel) {
			return ;
		}
		console.log(answer)
		if (answer.accepted) {
			setIsHost(true);
			setGameActive(true);
		}
		else {
			console.log("opa, não rolou")
		}
	} )
	
	const handleClose = () => {
		setOpenDialog(false);
	}
	
	return (
		<>
			<Button
				variant="outlined"
				size="large"
				sx={buttonCss}
				onClick={handleClick}
			>
				<Typography sx={buttonTypographyCss}>
					{INVITE}
				</Typography>
			</Button>
			<Dialog open={openDialog} fullWidth maxWidth="sm" onClose={handleClose}>
				<AskFriend
					setGameActive={setGameActive}
					userId={tokenData.id}
					setIsHost={setIsHost}
					friendId={friendId}
					setOpenDialog={setOpenDialog}
				/>
			</Dialog>
		</>
	)
}

const BlockUser = ({ setOpenDialog } : { setOpenDialog: booleanSetState }) => {
	
	const handleClick = () => {
		setOpenDialog(true);
	}
	
	return (
		<Button
			variant="outlined"
			size="large"
			sx={buttonCss}
			onClick={handleClick}
		>
			<Typography sx={buttonTypographyCss}>
				{BLOCK}
			</Typography>
		</Button>
	)
}

const GoToProfile = ({ setOpenCard } : { setOpenCard: booleanSetState }) => {
	
	const handleClick = () => {
		setOpenCard(true);
	}
	
	return (
		<Button
			variant="outlined"
			size="large"
			sx={buttonCss}
			onClick={handleClick}
		>
			<Typography sx={buttonTypographyCss}>
				{PROFILE}
			</Typography>
		</Button>
	)
}

export const DMButtons: FunctionComponent<Props> = ({ friendId, setIsHost, setGameActive, activeChannel }) => {
	const [openProfile, setOpenProfile] = useState(false);
	const [openDialog, setOpenDialog] = useState(false)

	const handleClose = () => {
		setOpenDialog(false);
	};

	return (
		<>
			<Box display="flex" justifyContent="space-around" minWidth="50vw" marginTop="1vh">
				<InviteToGame setIsHost={setIsHost} setGameActive={setGameActive} friendId={friendId} activeChannel={activeChannel}/>
				<BlockUser setOpenDialog={setOpenDialog}/>
				<GoToProfile setOpenCard={setOpenProfile}/>
			</Box>
			{
				openProfile && 
				<ProfileCard setOpenCard={setOpenProfile} userId={friendId}/>
			}
			<Dialog open={openDialog} fullWidth maxWidth="sm" onClose={handleClose}>
				<BlockUserDialog setOpenDialog={setOpenDialog} friendId={friendId}/>
			</Dialog>
		</>
	)
}

export default DMButtons
