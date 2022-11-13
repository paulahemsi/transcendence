import React, { useState } from "react";
import { Button, Card, CardActions, CardContent, Typography, Box } from '@mui/material';
import { CodeTextField } from "./header/profile-edit/config-two-factor-auth/CodeTextField";
import axios, { AxiosRequestHeaders } from "axios";
import { Navigate, useSearchParams } from "react-router-dom";

const authenticate = async (userId: string, code: string) => {
	const authToken: AxiosRequestHeaders = {
		'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	
	try {
		const response = await axios.post(
			`http://localhost:3000/two-factor-auth/login?user=${userId}`,
			{ code: code },
			{ headers: authToken });
	} catch {
		return false;
	}
	return true;
}


const TwoFactorAuthButton = ({
	userId,
	code,
	setCode, 
	setVerified, 
} : {
	userId: string,
	code: string,
	setCode: React.Dispatch<React.SetStateAction<string>>,
	setVerified: React.Dispatch<React.SetStateAction<boolean>>,
}) => {
	
	const handleAuthentication = () => {
		console.log('try auth')
		authenticate(userId, code).then((success) => {
			if (success) {
				setVerified(true);
				console.log('auth')
			}
			setCode('');
		})
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
	setCode, 
	setVerified, 
} : {
	userId: string,
	code: string,
	setCode: React.Dispatch<React.SetStateAction<string>>,
	setVerified: React.Dispatch<React.SetStateAction<boolean>>,
}) => {
	return (
		<>
			<CardActions sx={{ justifyContent: 'center', paddingTop: 8 }}>
				<TwoFactorAuthButton userId={userId} code={code} setCode={setCode} setVerified={setVerified} />
			</CardActions>
		</>
	)
}

const enterCodeMessage = 'Enter two-factor authentication code below '

const TwoFactorAuthContent = ({
	code,
	setCode, 
} : {
	code: string,
	setCode: React.Dispatch<React.SetStateAction<string>>,
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
				<CodeTextField code={code} setCode={setCode}/>
			</CardContent>
		</>
	)
}


export const TwoFactorAuthCard = () => {

	const [code, setCode] = useState('');
	const[verified, setVerified] = useState(false);
	const [searchParams, setSearchParams] = useSearchParams();

	const userId = searchParams.get('user');

	if (!userId) {
		return (<Navigate to='/'/>)
	}
	
	if (verified) {
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
				<TwoFactorAuthContent code={code} setCode={setCode} />
				<TwoFactorAuthActions userId={userId} code={code} setCode={setCode} setVerified={setVerified}  />
			</Card>
		</Box>
	</>
	);
}

export default TwoFactorAuthCard
