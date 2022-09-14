import React from "react";
import UserStatus from "./UserStatus";
import UserImage from "./UserImage";
import UserName from "./UserName";
import { Box } from "@mui/material";

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
		<Box display='flex' flexDirection='row' alignItems="center">
			<UserImage imageUrl={userData.image_url}/>
			<UserName userName={userData.username}/>
			<UserStatus statusColor={defineColor(userData.status)}/>
		</Box>
	)
}

export default ProfileInfo
