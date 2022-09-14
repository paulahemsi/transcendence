import React from "react";
import { Stack } from "@mui/material"
import UserStatus from "./UserStatus";
import UserImage from "./UserImage";
import UserName from "./UserName";

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

export const ProfileInfo = ({ userData } : {[key: string]: any}) => {
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

export default ProfileInfo
