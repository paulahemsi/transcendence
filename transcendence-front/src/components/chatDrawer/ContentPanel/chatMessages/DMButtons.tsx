import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import ProfileCard from "../../../profileDrawer/ProfileDrawer";

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

const InviteToGame = () => {
	
	const handleClick = () => {
		
	}
	
	return (
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
	)
}

const BlockUser = () => {
	
	const handleClick = () => {
		
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

export const DMButtons = ({ friendId } : { friendId: string }) => {
	const [openProfile, setOpenProfile] = useState(false)

	return (
		<>
			<Box display="flex" justifyContent="space-around" minWidth="50vw" marginTop="1vh">
				<InviteToGame/>
				<BlockUser/>
				<GoToProfile setOpenCard={setOpenProfile}/>
			</Box>
			{
				openProfile && 
				<ProfileCard setOpenCard={setOpenProfile} userId={friendId}/>
			}
		</>
	)
}

export default DMButtons