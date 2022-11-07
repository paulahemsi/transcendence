import React, { useState } from "react";
import { Link, Button, Card, CardActions, CardContent, Typography, Box } from '@mui/material';

const LoginCardButton = () => {
	const [loading, setLoading] = useState(false);
	
	const handleLoading = () => {
		setLoading(true);
	}
	
	return (
		<>
			<Button 
			variant="contained"
			disabled={loading}
			onClick={handleLoading}
			size="large"
			sx={{ 
				width: 150,
				height: 55,
				background: '#9575CD',
				':hover': { background: '#311B92'}
			}}>
				<Link href="http://localhost:4444/auth/login" style={{ textDecoration: 'none' }} sx={{
					width: 150,
					height: 55,
					textTransform: 'lowercase',
					fontFamily: 'Orbitron',
					fontSize: 20,
					color: '#f5f5f5',
					marginTop: '20%',
				}}>
						login
				</Link>
			</Button>
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

export const TwoFactorAuthCard = () => {
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

export default TwoFactorAuthCard
