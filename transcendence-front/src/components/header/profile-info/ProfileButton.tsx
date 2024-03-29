import React, { FunctionComponent } from "react";
import { Box, Button, Typography } from "@mui/material"
import { booleanSetState } from "../../utils/constants";

interface PropsProfileButton {
    setOpenCard: booleanSetState;
	userData: { [key: string]: any; };
}

const UserImage = ({imageUrl} : {imageUrl: string}) => {
	return (
		<Box component='img' src={imageUrl} alt='Profile picture'
				sx={{
					height: '5vh',
					width: '5vh',
					borderRadius: 2,
					boxShadow: 1
				}}>
		</Box>
	)
}

const UserName = ({userName} : {userName : string}) => {
	return (
		<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
					{userName}
		</Typography>
	)
}

export const ProfileButton: FunctionComponent<PropsProfileButton> = ({ setOpenCard, userData }) => {
	const handleOpenCard = () => {
		setOpenCard(true)
	}

	return (
		<Button onClick={handleOpenCard} sx={{textTransform: 'lowercase',}}>
			<UserImage imageUrl={userData.image_url}/>
			<UserName userName={userData.username}/>
		</Button>
	)
}
