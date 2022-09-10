import React from "react";
import { Typography, Box, Button, Stack } from '@mui/material';
import axios from 'axios';
import jwt from 'jwt-decode';

const LogoutButton = () => {
	return (
		<>
			<Button variant="contained" size="small" onClick={() => axios.get('http://localhost:3000/auth/logout')}
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

type Intra42Token = {
	username : string;
	external_id: string;
	email: string;
}

function getUsername() {
	let cookie = document.cookie;
	let userInfo : Intra42Token = jwt(cookie);
	console.log(userInfo);
	return (userInfo.username);
}

const Greeting = () => {
	return (
		<>
			<Typography sx={{ fontSize: 30, fontFamily: 'Orbitron', fontWeight: 500, color: '#F5F5F5'}}>
				Welcome, {getUsername()}!
			</Typography>
		</>
	)
}

export class Home extends React.Component<{}, {}> {
    render() {
        return (
			<>
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

				<Box display="flex" justifyContent="right" minHeight="10vh"
					sx={{
						backgroundColor: '#311B92',
						paddingRight: 4
					}}>
					<LogoutButton />
				</Box>
			</>
        );
    }
}

export default Home
