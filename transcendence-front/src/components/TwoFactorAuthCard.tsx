import React, { useReducer, useState } from "react";
import { Button, Card, CardActions, CardContent, Typography, Box } from '@mui/material';
import { CodeTextField } from "./header/profile-edit/config-two-factor-auth/CodeTextField";
import axios, { AxiosRequestHeaders } from "axios";
import { Navigate, useSearchParams } from "react-router-dom";
import { DEFAULT_TOAST_MSG } from "./utils/constants";
import ErrorToast from "./utils/ErrorToast";


const TwoFactorAuthButton = ({
	userId,
	code,
	setState, 
} : {
	userId: string,
	code: string,
	setState: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>,
}) => {

	const handleAuthentication = () => {
		const authToken: AxiosRequestHeaders = {
			'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		
		axios.post(`http://localhost:4444/two-factor-auth/login?user=${userId}`,{ code: code }, { headers: authToken })
			.then(() => {
				setState({verified: true});
			}).catch(() => {
				setState({code: '', toastError: true});
			});
	}
	
	return (
		<>
			<Button 
				variant="contained"
				onClick={handleAuthentication}
				size="large"
				sx={{ 
					width: 150,
					height: 55,
					background: '#9575CD',
					':hover': { background: '#311B92'}
				}}
			>
				authenticate
			</Button>
		</>
	)
}

const TwoFactorAuthActions = ({
	userId,
	code,
	setState, 
} : {
	userId: string,
	code: string,
	setState: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>,
}) => {
	return (
		<>
			<CardActions sx={{ justifyContent: 'center', paddingTop: 8 }}>
				<TwoFactorAuthButton userId={userId} code={code} setState={setState} />
			</CardActions>
		</>
	)
}

const enterCodeMessage = 'Enter two-factor authentication code below '

const TwoFactorAuthContent = ({
	code,
	setState, 
} : {
	code: string,
	setState: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>,
}) => {
	return (
		<>
			<CardContent style={{ paddingLeft: 35, paddingTop: 25 }}>
				<Typography
					align="left"
					sx={{
						fontSize: 24,
						fontFamily:'Orbitron',
						fontWeight: 500}}
				>
					{enterCodeMessage}
				</Typography>
				<CodeTextField code={code} setState={setState}/>
			</CardContent>
		</>
	)
}

const reducer = (state : {[key: string]: any}, newState : {[key: string]: any}) => {
	return {...state, ...newState};
}


export const TwoFactorAuthCard = () => {
	
	const [state, setState] = useReducer(reducer, {
		code: "",
		verified: false,
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});

	const [searchParams, setSearchParams] = useSearchParams();

	const userId = searchParams.get('user');

	if (!userId) {
		return (<Navigate to='/'/>)
	}
	
	if (state.verified) {
		return (<Navigate to='/'/>)
	}

	return (
		<>
		<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
			<Card variant="outlined" 
				sx={{
					width: 500,
					height: 330,
					background: '#F5F5F5',
					border: 2,
					borderColor: '#212121',
					borderRadius: 3,
					boxShadow: 5
					}}>
				<TwoFactorAuthContent code={state.code} setState={setState} />
				<TwoFactorAuthActions userId={userId} code={state.code} setState={setState}   />
			</Card>
		</Box>
		<ErrorToast state={state} setState={setState} />
	</>
	);
}

export default TwoFactorAuthCard
