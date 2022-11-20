import React from "react";
import { Box, Typography } from "@mui/material"
import { defineColor } from "../../utils/constants";

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
		<Typography sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
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

export const FriendsInfo = ({ userData } : {[key: string]: any}) => {
	return(
		<Box display='flex' width='100%' flexDirection='row' alignItems="center" alignSelf="flex-start">
			<UserStatus statusColor={defineColor(userData.status)}/>
			<UserImage imageUrl={userData.image_url}/>
			<UserName userName={userData.username}/>
		</Box>
	)
}

export default FriendsInfo
