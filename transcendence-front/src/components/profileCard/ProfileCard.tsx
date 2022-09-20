import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, Drawer, Typography } from "@mui/material";
import axios, { AxiosRequestHeaders } from "axios";
import jwt from 'jwt-decode';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
}

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
					height: '20vh',
					width: '20vh',
					borderRadius: 2,
					boxShadow: 1
				}}>
		</Box>
	)
}

const UserName = ({userName} : {userName : string}) => {
	return (
		<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '7vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
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
				boxShadow: 1,
				alignSelf: 'center'}}>
		</Box>
	)
}

const MainInfos = ({userProfile} : {userProfile: {[key: string]: any}}) => {
	return (
		<Box display='flex' justifyContent='space-between'>
			<UserImage imageUrl={userProfile.image_url}/>
			<Box display='flex' flexDirection='column' justifyContent='space-between'>
				<UserName userName={userProfile.username} />
				<Box display='flex' alignSelf='flex-end'>
					<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
						Status: {userProfile.status}
					</Typography>
					<UserStatus statusColor={defineColor(userProfile.status)}/>
				</Box>
			</Box>
		</Box>
	)
}

const RatingInfos = ({userProfile} : {userProfile: {[key: string]: any}}) => {
	return (
		<Box display='flex' justifyContent='space-between' padding='4vh'>
			<Box display='flex' justifyContent='center' flexDirection='column'>
				<Typography alignSelf='flex-start' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
							Rating:
				</Typography>
				<Typography alignSelf='flex-end' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '8vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
							{userProfile.rating}
				</Typography>
			</Box>
			<Box display='flex' flexDirection='column' justifyContent='center'>
				<Typography alignSelf='flex-end' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
					wins: 9
				</Typography>
				<Typography alignSelf='flex-end' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
					losses: 2
				</Typography>
			</Box>
		</Box>
	)
}

const requestUserProfile = async ({ setUserProfile } : { setUserProfile: React.Dispatch<React.SetStateAction<{[key: string]: any}>>}) => {

	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	
	await axios.get(`http://localhost:3000/users/${tokenData.id}/profile`, { headers: authToken }).then((response) => {
		setUserProfile(response.data);
})
}

export const ProfileCard = ({ setOpenCard } : { setOpenCard: booleanSetState })  => {
	const [userProfile, setUserProfile] = useState<{[key: string]: any}>({});

	useEffect(() => {requestUserProfile({setUserProfile})}, []);
	return (
		<>
		<Drawer open={true} transitionDuration={500} onClose={() => setOpenCard(false)} anchor="left" PaperProps={{
            sx: { width: "40%", padding: '10vh'  },
          }}>
			<MainInfos userProfile={userProfile}/>
			<RatingInfos userProfile={userProfile}/>
		</Drawer>
	  </>
	)
}

export default ProfileCard
