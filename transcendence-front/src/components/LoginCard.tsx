import React from "react";
import { Link, Button, Card, CardActions, CardContent, Typography, Box } from '@mui/material';

const LoginCardButton = () => {
	return (
		<>
			<Link href="http://localhost:4444/auth/login" style={{ textDecoration: 'none' }}>
				<Button variant="contained" size="large"
				sx={{ 
					width: 150,
					height: 55,
					background: '#9575CD',
					':hover': { background: '#311B92'}
				}}>
					<Typography
						sx={{
							textTransform: 'lowercase',
							fontFamily: 'Orbitron',
							fontSize: 20
						}}>
						login
					</Typography>
				</Button>
			</Link>
		</>
	)
}

const LoginCardActions = () => {
	return (
		<>
			<CardActions sx={{ justifyContent: 'center', paddingTop: 8 }}>
				<LoginCardButton />
			</CardActions>
		</>
	)
}

const LoginCardContent = () => {
	return (
		<>
			<CardContent style={{ paddingLeft: 35, paddingTop: 25 }}>
			<Typography align="left" sx={{ fontSize: 24, fontFamily: 'Orbitron', fontWeight: 500}}>{'> transcend?'}</Typography>
			</CardContent>
		</>
	)
}

export const LoginCard = () => {
        return (
            <>
			<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
				<Card variant="outlined" 
					sx={{
						width: 500,
						height: 230,
						background: '#F5F5F5',
						border: 2,
						borderColor: '#212121',
						borderRadius: 3,
						boxShadow: 5
						}}>
					<LoginCardContent />
					<LoginCardActions />
				</Card>
			</Box>
		</>
        );
}

export default LoginCard
