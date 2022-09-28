import React, { FunctionComponent } from "react";
import { Box, Button, Typography } from "@mui/material"

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    setOpenCard: booleanSetState;
	userData: {[key: string]: any};
}

const AVOCADO_TEMP = 'https://images.vexels.com/media/users/3/185791/isolated/preview/27c69d1413163918103a032d4951213e-abacate-kawaii-winking.png'

const defineColor = (status: string) => {
	switch( status ) {
		case 'online':
			return '#4CAF50';
		case 'offline':
			return '#1E1E1E';
		case 'away':
			return '#F39810';
		case 'in_game':
			return '#9575CD';
		default: return '#FF0000';
	}
}

const UserImage = ({imageUrl} : {imageUrl: string}) => {
	if (imageUrl == null) {
		imageUrl = AVOCADO_TEMP
	}
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

const UserStatus = ({statusColor} : {statusColor : string}) => {
	return (
		<Box
			sx={{ 
				backgroundColor: statusColor,
				height: '3vh',
				width: '3vh',
				borderRadius: 50,
				boxShadow: 1}}>
		</Box>
	)
}

export const ProfileInfo : FunctionComponent<Props> = ({ setOpenCard, userData }) => {
	
	const handleOpenCard = () => {
		setOpenCard(true)
	}
	
	return(
		<Box display='flex' flexDirection='row' alignItems="center">
			<Button onClick={handleOpenCard} sx={{textTransform: 'lowercase',}}>
				<UserImage imageUrl={userData.image_url}/>
				<UserName userName={userData.username}/>
				<UserStatus statusColor={defineColor(userData.status)}/>
			</Button>
		</Box>
	)
}

export default ProfileInfo
