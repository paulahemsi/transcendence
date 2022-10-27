import React from "react";
import { Box, Typography } from "@mui/material"

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
		<Typography sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh'}}>
			{userName}
		</Typography>
	)
}

const UserStatus = ({statusColor} : {statusColor : string}) => {
	return (
		<Box margin={2}
			sx={{ 
				backgroundColor: statusColor,
				height: '3vh',
				width: '3vh',
				borderRadius: 50,
				boxShadow: 1}}>
		</Box>
	)
}

export const MembersInfo = ({ userData } : {[key: string]: any}) => {
	return(
		<Box display='flex' width='30vh' flexDirection='row' alignItems="center" alignSelf="flex-start">
			<UserStatus statusColor={defineColor(userData.status)}/>
			<UserImage imageUrl={userData.image}/>
			<UserName userName={userData.name}/>
		</Box>
	)
}

export default MembersInfo
