import React from "react";
import { Box, Typography } from "@mui/material";

const UserAvatar = ({imageUrl} : {imageUrl: string}) => {
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

export const MatchDetails = ({opponentName, opponentScore, opponentImage, userName, userScore, userImage } : {opponentName : string, opponentScore : number, opponentImage: string, userName : string, userScore : number, userImage: string}) => {
	return (
		<>
			<UserAvatar imageUrl={userImage}/>
			<Typography alignSelf='center' sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '2.5vh', padding: '1.7vh'}}>
				{userName}  {userScore}  X  {opponentScore}  {opponentName}
			</Typography>
			<UserAvatar imageUrl={opponentImage}/>
		</>
	)
}
