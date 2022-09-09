import React from "react";
import { Typography, Box, Button } from '@mui/material';
import axios from 'axios';

const LogoutButton = () => {
	return (
		<>
			<Button variant="contained" size="small" onClick={() => axios.get('http://localhost:4444/auth/logout')}
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

export class Home extends React.Component<{}, {}> {
    render() {
        return (
			<>
				<Box display="flex" justifyContent="center" alignItems="center" minHeight="90vh"
					sx={{
						backgroundColor: '#311B92'
					}}>
					<Typography sx={{ fontSize: 90, fontFamily: 'Orbitron', fontWeight: 500, color: '#FFFFFF', textShadow: '0px 0px 6px #FFFFFF'}}>
						ft_transcendence
					</Typography>
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
