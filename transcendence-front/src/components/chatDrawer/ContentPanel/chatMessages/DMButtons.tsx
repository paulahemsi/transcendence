import React, { FunctionComponent, useReducer, useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogActions, CircularProgress, Snackbar, Alert } from "@mui/material";
import ProfileCard from "../../../profileDrawer/ProfileDrawer";
import BlockUserDialog from "./BlockUserDialog";
import jwt from 'jwt-decode';
import { chatSocket } from "../../../context/socket";
import { Navigate } from "react-router-dom";
import { DEFAULT_TOAST_MSG } from "../../../utils/constants";

type tokenData = {
	id: string;
}

const PROFILE = "Go to profile";
const BLOCK = "Block";
const INVITE = "Invite to game";
const GAME_DECLINED = "It seems your friend are not available now :( ";

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
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

interface askFriendProps {
    setGameActive: booleanSetState;
    setIsHost: booleanSetState;
    setOpenDialog: booleanSetState;
	activeChannel: number;
}

interface Props {
    setGameActive: booleanSetState;
    setIsHost: booleanSetState;
	friendId: string;
	activeChannel: number;
}

interface inviteProps {
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

const ErrorToast = ({state, setState, setOpenDialog} : {state: {[key: string]: any}, setState: objectSetState, setOpenDialog: booleanSetState}) => {
	
	const handleClose = () => {
		setState({ toastError: false });
		setOpenDialog(false);
	}
	
	return (
		<Snackbar
			open={state.toastError}
			autoHideDuration={6000}
			onClose={handleClose}
			anchorOrigin={{vertical: 'top', horizontal: 'right'}}
		>
			<Alert variant="filled" onClose={handleClose} severity="error" sx={{ width: '100%' }}>
				{state.toastMessage}
			</Alert>
		</Snackbar>
	)
}

const AskFriend: FunctionComponent<askFriendProps> = ({ setGameActive, setIsHost, setOpenDialog, activeChannel }) => {
	const tokenData: tokenData = jwt(document.cookie);
	const [goGame, setGoGame] = useState(false);
	const [stateToast, setStateToast] = useReducer(reducer, {
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});
	
	chatSocket.off('answerToGameRequest').on('answerToGameRequest', (answer) => {
		if (answer.room != activeChannel) {
			return ;
		}
		if (answer.accepted) {
			setIsHost(true);
			setGameActive(true);
		}
		else {
			console.log('declined')
			setStateToast({ toastError: true, toastMessage: GAME_DECLINED });
		}
	} )

	if (goGame) {
		return (<Navigate to='/game'/>)
	}

	setTimeout(() =>{
		if (!goGame) {
			setStateToast({ toastError: true, toastMessage: GAME_DECLINED });
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
			<ErrorToast state={stateToast} setState={setStateToast} setOpenDialog={setOpenDialog} />
		</>
	)

}

const reducer = (state: {[key: string]: any}, newState : {[key: string]: any}) => {
	return { ...state, ...newState};
}

const InviteToGame: FunctionComponent<inviteProps> = ({ setIsHost, setGameActive, friendId, activeChannel}) => {
	const [ openDialog, setOpenDialog] = useState(false);
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
					setIsHost={setIsHost}
					setOpenDialog={setOpenDialog}
					activeChannel={activeChannel}
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
