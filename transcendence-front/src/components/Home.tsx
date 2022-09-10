import React from "react";
import { Typography, Box, Button, Stack } from '@mui/material';
import axios from 'axios';
import jwt from 'jwt-decode';

type Intra42Token = {
	username : string;
	external_id: string;
	email: string;
}

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

const LogoutButton = ({ setLoggedIn } : { setLoggedIn: booleanSetState}) => {
	
	const handleLogout = () => {
		axios.get('http://localhost:3000/auth/logout');
		setLoggedIn(false);
	}
	
	return (
		<>
			<Button variant="contained" size="small" onClick={handleLogout}
				sx={{ 
					width: 110,
					height: 50,
					textTransform: 'lowercase',
					background: '#F5F5F5',
					color: '#311B92',
					':hover': { background: '#F5F5F5', color: '#9575CD'},
					fontFamily: 'Orbitron',
					fontSize: 18}}>
				logout
			</Button>
		</>
	)
}

const Greeting = () => {

	const getUsername = () => {
		let cookie = document.cookie;
		let userInfo : Intra42Token = jwt(cookie);
		return (userInfo.username);
	}
	
	return (
		<>
			<Typography sx={{ fontSize: 30, fontFamily: 'Orbitron', fontWeight: 500, color: '#F5F5F5'}}>
				Welcome, {getUsername()}!
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
					<Stack alignItems="center" spacing={2}>
					<Typography sx={{ fontSize: 90, fontFamily: 'Orbitron', fontWeight: 500, color: '#FFFFFF', textShadow: '0px 0px 6px #FFFFFF'}}>
						ft_transcendence
					</Typography>
					<Greeting />
					</Stack>
		</Box>
	);
}

export const Home = ({ setLoggedIn } : { setLoggedIn: booleanSetState}) => {
        return (
			<>
				<Background />
				<Box display="flex" justifyContent="right" minHeight="10vh"
					sx={{
						backgroundColor: '#311B92',
						paddingRight: 4
					}}>
					<LogoutButton setLoggedIn={setLoggedIn}/>
				</Box>
			</>
        );
}

export default Home
