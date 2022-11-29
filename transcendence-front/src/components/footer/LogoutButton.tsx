import React from "react";
import { Button, Link } from "@mui/material";

const logoutUrl = 'http://localhost:4444/auth/logout'

export const LogoutButton = () => {
	
	return (
		<>
			<Button variant="outlined" size="small"
				sx={{ 
					width: 110,
					height: '5vh',
					background: '#F5F5F5',
					borderColor: '#311B92',
				}}
			>
				<Link href={logoutUrl} style={{ textDecoration: 'none' }}
					sx={{
						textTransform: 'lowercase',
						fontFamily: 'Orbitron',
						fontSize: '2.3vh',
						color: '#311B92',
						':hover': { background: '#F5F5F5', borderColor: '#9575CD', color: '#9575CD'},
					}}
				>
					logout
				</Link>
			</Button>
		</>
	)
}

export default LogoutButton
