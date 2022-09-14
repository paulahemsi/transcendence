import React, { useEffect, useState } from "react";
import { Typography, Box, Button, AppBar, Stack } from '@mui/material';
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import { borderRadius } from "@mui/system";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
}

type user = {
	id: string,
	username: string;
	rating: number;
	email: string;
	status: string;
	image_url: string;
	external_id: number;
}

const LogoutButton = ({ setLoggedIn } : { setLoggedIn: booleanSetState}) => {
	
	const handleLogout = () => {
		axios.get('http://localhost:3000/auth/logout');
		setLoggedIn(false);
	}
	
	return (
		<>
			<Button variant="outlined" size="small" onClick={handleLogout}
				sx={{ 
					width: 110,
					height: '5vh',
					textTransform: 'lowercase',
					background: '#F5F5F5',
					borderColor: '#311B92',
					color: '#311B92',
					':hover': { background: '#F5F5F5', borderColor: '#9575CD', color: '#9575CD'},
					fontFamily: 'Orbitron',
					fontSize: '2.3vh'}}>
				logout
			</Button>
		</>
	)
}

const requestUserData = async ({ setUserData } : { setUserData: React.Dispatch<React.SetStateAction<{[key: string]: any}>>}) => {
	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	await axios.get('http://localhost:3000/users/' + tokenData.id, { headers: authToken }).then((response) => {setUserData({
		id: response.data.id,
		username: response.data.username,
		rating: response.data.rating,
		email: response.data.email,
		status: response.data.status,
		image_url: response.data.image_url,
		external_id: response.data.external_id
})})
}

const ProfileInfo = (data: {[key: string]: any}) => {
	let statusColor: string
	switch( data.userData.status ) {
		case 'online':
			statusColor = '#4CAF50';
			break ;
		case 'offline':
			statusColor = '#1E1E1E';
			break;
		case 'away':
			statusColor = '#F39810';
			break;
		case 'in_game':
			statusColor = '#9575CD';
			break;
		default: statusColor = '#FF0000';
	}
	return(
		<>
		<Stack display='flex' flexDirection='row' alignItems="center" sx={{ paddingTop: '0.5vh', paddingLeft: '1.5vh', paddingBottom: '2vh' }}>
			<Box component='img' src={data.userData.image_url} alt='Profile picture'
				sx={{
					height: '5vh',
					width: '5vh',
					borderRadius: 2,
					boxShadow: 1
				}}>
			</Box>
				<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
					{data.userData.username}
				</Typography>
			<Box
			sx={{ 
				backgroundColor: statusColor,
				height: '3vh',
				width: '3vh',
				borderRadius: 50,
				boxShadow: 1}}>
		</Box>
		</Stack>
		</>
	)
}

const Background = () => {
	return (
		<Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh"
					sx={{
						backgroundColor: '#311B92'
					}}>
					<Typography sx={{ fontSize: '14vh', fontFamily: 'Orbitron', fontWeight: 500, color: '#FFFFFF', textShadow: '0px 0px 6px #FFFFFF'}}>
						ft_transcendence
					</Typography>
		</Box>
	);
}

export const Home = ({ setLoggedIn } : { setLoggedIn: booleanSetState}) => {

	const [userData, setUserData] = useState<{[key: string]: any}>({});

	useEffect(() => {requestUserData({setUserData})}, []);	
		return (
			<>
				<AppBar sx={{ height: '7vh', background: '#F5F5F5'}}>
					<ProfileInfo userData={userData}/>
				</AppBar>
				<Background />
				<Box display="flex" justifyContent="right" minHeight="10vh"
					sx={{
						backgroundColor: '#311B92',
						paddingRight: 4
					}}>
				</Box>
				<AppBar position="fixed" sx={{ height: '7vh', background: '#F5F5F5', top: 'auto', bottom: 0 }}>
					<Box display="flex" justifyContent="right" sx={{ paddingTop: '1vh', paddingRight: '1vh', paddingBottom: '1vh' }}>
						<LogoutButton setLoggedIn={setLoggedIn}/>
					</Box>
				</AppBar>
			</>
		);
}

export default Home
