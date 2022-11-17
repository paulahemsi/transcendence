import React, { FunctionComponent, useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogActions, CircularProgress } from "@mui/material";
import ProfileCard from "../../../profileDrawer/ProfileDrawer";
import BlockUserDialog from "./BlockUserDialog";
import jwt from 'jwt-decode';
import { sessionSocket } from "../../../context/socket";
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
	userId: string;
	friendId: string;
}

interface inviteProps {
    setGameActive: booleanSetState;
    setIsHost: booleanSetState;
	friendId: string;
}

const AskFriend: FunctionComponent<askFriendProps> = ({ setGameActive, userId, friendId, setIsHost }) => {
	const tokenData: tokenData = jwt(document.cookie);
	
	const [goGame, setGoGame] = useState(false);

	const joinGameQueue = () => {
		sessionSocket.emit('joinGameQueue');
		console.log(`User ${userId} wanna play`)
	}
	
	sessionSocket.on('joinGameQueue', (match) => {
		if (match.player1 == tokenData.id) {
			setIsHost(true);
		} else {
			setIsHost(false);
		}
		setGoGame(true)
	} )

	if (goGame) {
		return (<Navigate to='/game'/>)
	}

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

const InviteToGame: FunctionComponent<inviteProps> = ({ setIsHost, setGameActive, friendId }) => {
	const [ openDialog, setOpenDialog ] = useState(false);
	const tokenData: tokenData = jwt(document.cookie);
	
	const handleClick = () => {
		setOpenDialog(true);
	}
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

export const DMButtons = ({ friendId, setIsHost, setGameActive } : { friendId: string, setIsHost: booleanSetState, setGameActive: booleanSetState }) => {
	const [openProfile, setOpenProfile] = useState(false);
	const [openDialog, setOpenDialog] = useState(false)

	const handleClose = () => {
		setOpenDialog(false);
	};

	return (
		<>
			<Box display="flex" justifyContent="space-around" minWidth="50vw" marginTop="1vh">
				<InviteToGame setIsHost={setIsHost} setGameActive={setGameActive} friendId={friendId}/>
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
