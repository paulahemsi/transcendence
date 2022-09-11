import React, { useEffect, useState } from "react";
import { Typography, Box, Button, AppBar } from '@mui/material';
import axios from 'axios';
import jwt from 'jwt-decode';

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

const requestUserData = () => {
	const tokenData: tokenData = jwt(document.cookie);
	axios.get('http://localhost:3000/users/' + tokenData.id).then((response) => {})
}

const ProfileInfo = () => {
	return(
		<>
		<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh' }}>
			username
		</Typography>
		</>
	)
}

const Background = () => {
	return (
		<Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh"
					sx={{
						backgroundColor: '#311B92'
					}}>
					<Typography sx={{ fontSize: '7em', fontFamily: 'Orbitron', fontWeight: 500, color: '#FFFFFF', textShadow: '0px 0px 6px #FFFFFF'}}>
						ft_transcendence
					</Typography>
		</Box>
	);
}

export const Home = ({ setLoggedIn } : { setLoggedIn: booleanSetState}) => {
		return (
			<>
				<AppBar sx={{ height: '7vh', background: '#F5F5F5'}}>
					<ProfileInfo/>
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
