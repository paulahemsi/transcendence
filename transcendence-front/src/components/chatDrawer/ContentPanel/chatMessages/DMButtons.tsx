import React, { FunctionComponent, useState } from "react";
import { Box, Typography, Button, Dialog } from "@mui/material";
import ProfileCard from "../../../profileDrawer/ProfileDrawer";
import BlockUserDialog from "./BlockUserDialog";
import { sessionSocket } from "../../../context/socket";
import { booleanSetState, stringSetState } from "../../../utils/constants";
import AskFriend from "./AskFriend";

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

interface Props {
    setGameActive: booleanSetState;
    setIsHost: booleanSetState;
	friendId: string;
	setMatchRoom: stringSetState;
}

interface inviteProps {
    setGameActive: booleanSetState;
    setIsHost: booleanSetState;
	friendId: string;
	setMatchRoom: stringSetState;
}

const InviteToGame: FunctionComponent<inviteProps> = ({ setIsHost, setGameActive, friendId, setMatchRoom }) => {
	const [ openDialog, setOpenDialog] = useState(false);
	
	const handleClick = () => {
		sessionSocket.emit('playWithFriend', friendId);
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
					friendId={friendId}
					setMatchRoom={setMatchRoom}
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

export const DMButtons: FunctionComponent<Props> = ({ friendId, setIsHost, setGameActive, setMatchRoom }) => {

	const [openProfile, setOpenProfile] = useState(false);
	const [openDialog, setOpenDialog] = useState(false)

	const handleClose = () => {
		setOpenDialog(false);
	};

	return (
		<>
			<Box display="flex" justifyContent="space-around" minWidth="50vw" marginTop="1vh">
				<InviteToGame
					setIsHost={setIsHost}
					setGameActive={setGameActive}
					friendId={friendId}
					setMatchRoom={setMatchRoom}
				/>
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
