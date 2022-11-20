import React from "react";
import { Box, Typography } from "@mui/material";
import { UserStatus } from "./UserStatus";
import { UserImage } from "./UserImage";
import { UserName } from "./UserName";
import { WinsAndLosses } from "./WinsAndLosses";
import { defineColor } from "../../utils/constants";

export const MainInfos = ({userProfile} : {userProfile: {[key: string]: any}}) => {
	return (
		<Box display='flex' justifyContent='space-between'>
			<UserImage imageUrl={userProfile.image_url}/>
			<Box display='flex' flexDirection='column' justifyContent='space-between'>
				<UserName userName={userProfile.name} />
				<Box display='flex' alignSelf='flex-beging'>
					<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
						Status: 
					</Typography>
					<Typography sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
						{userProfile.status}
					</Typography>
					<UserStatus statusColor={defineColor(userProfile.status)}/>
				</Box>
				<Box display='flex' justifyContent='flex-beging'>
					<WinsAndLosses matchHistory={userProfile.matchHistory}/>
				</Box>
			</Box>
		</Box>
	)
}
