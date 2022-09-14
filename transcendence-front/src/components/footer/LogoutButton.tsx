import React from "react";
import axios from 'axios';
import { Button } from "@mui/material";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
const logoutUrl = 'http://localhost:3000/auth/logout'

export const LogoutButton = ({ setLoggedIn } : { setLoggedIn: booleanSetState}) => {
	
	const handleLogout = () => {
		axios.get(logoutUrl);
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

export default LogoutButton
