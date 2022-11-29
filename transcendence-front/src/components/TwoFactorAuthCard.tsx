import React, { useReducer } from "react";
import { Button, Card, CardActions, CardContent, Typography, Box } from '@mui/material';
import { CodeTextField } from "./header/profile-edit/config-two-factor-auth/CodeTextField";
import axios from "axios";
import { Navigate, useSearchParams } from "react-router-dom";
import { DEFAULT_TOAST_MSG, reducer } from "./utils/constants";
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
		axios
			.post(
				`http://localhost:4444/two-factor-auth/login?user=${userId}`,
				{ code: code })
			.then((response) => {
				document.cookie = response.data.cookie;
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
					background: '#9575CD',
					':hover': { background: '#311B92'},
					textTransform: 'lowercase',
					fontFamily: 'Orbitron',
					fontSize: 20,
					color: '#f5f5f5',
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
