import React from "react";
import { AppBar, Box, Stack, Typography } from "@mui/material"

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

const ProfileInfo = ({ userData } : {[key: string]: any}) => {
	return(
		<>
		<Stack display='flex' flexDirection='row' alignItems="center" sx={{ paddingTop: '0.5vh', paddingLeft: '1.5vh', paddingBottom: '2vh' }}>
			<UserImage imageUrl={userData.image_url}/>
			<UserName userName={userData.username}/>
			<UserStatus statusColor={defineColor(userData.status)}/>
		</Stack>
		</>
	)
}

export const Header = ({ userData } : {[key: string]: any}) => {
	return (
		<AppBar sx={{ height: '7vh', background: '#F5F5F5'}}>
			<ProfileInfo userData={userData}/>
		</AppBar>
	)
}

export default Header
