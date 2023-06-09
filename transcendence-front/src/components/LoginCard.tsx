import React, { useReducer, useState } from "react";
import { Link, Button, Card, CardActions, CardContent, Typography, Box } from '@mui/material';
import { DEFAULT_TOAST_MSG, reducer } from "./utils/constants";
import ErrorToast from "./utils/ErrorToast";

const LoginCardButton = () => {
	const [state, setState] = useReducer(reducer, {
		loading: false,
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});
	
	const handleLoading = () => {
		setState({ loading: true });
		setTimeout(() => {
			setState({ loading: false });
			setState({ toastError: true });
		}, 7000 )
	}

	const loginLink = process.env.REACT_APP_BACK_HOST + "/auth/login"
	
	return (
		<>
			<Button 
			variant="contained"
			disabled={state.loading}
			onClick={handleLoading}
			size="large"
			sx={{ 
				width: 150,
				height: 55,
				background: '#9575CD',
				':hover': { background: '#311B92'}
			}}>
				<Link href={loginLink} style={{ textDecoration: 'none' }} sx={{
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
			<ErrorToast state={state} setState={setState}/>
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
