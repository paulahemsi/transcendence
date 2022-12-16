import React, { FunctionComponent, useEffect, useReducer, useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, Snackbar, TextField, Typography, } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import { typographyCSS } from './auxiliary'
import { CodeTextField } from "./CodeTextField";
import { booleanSetState, DEFAULT_TOAST_MSG, reducer } from "../../../utils/constants";

interface Props {
    open: boolean;
    setOpen: booleanSetState;
	userData: { [key: string]: any; };
	setUserData: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>;
}

const qrCodeMessage = 'Scan the image bellow with the two-factor authentication app on your phone.'
const sixDigitCodeMessage = 'After scanning the QR code image, the app will display a six-digit code.'
const enterCodeMessage = 'Enter code below and confirm to enable two-factor authentication.'

const getQRcode = async ({ setState } : { setState: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>}) => {
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	const response = (await axios.get('http://localhost:4444/two-factor-auth/generate', { headers: authToken }));
	setState({ qrcode: response.data.url });
}

const enable = async (code: string) => {
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	try {
		await axios.post('http://localhost:4444/two-factor-auth/enable', {code: code }, { headers: authToken });
	} catch {
		return false;
	}
	return true;
}

const EnebleQrCodeContent = ({
	qrcode,
	code,
	setState, 
} : {
	qrcode: string ,
	code: string,
	setState: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>,
}) => {
	return (
		<>
			<Box
				display="flex"
				alignItems="center"
				flexDirection="column"
				flexWrap="wrap"
				justifyContent="center"
			>
				<Typography sx={typographyCSS(1.7)}>
					{qrCodeMessage}
				</Typography>
				<Box
					component='img'
					src={qrcode}
					alt='Profile picture'
					sx={{
						height: '25vh',
						width: '25vh',
					}}
					>
				</Box> 
				<Typography sx={typographyCSS(1.7)}>
					{sixDigitCodeMessage}
				</Typography>
				<Typography sx={typographyCSS(1.7)}>
					{enterCodeMessage}
				</Typography>
				<CodeTextField code={code} setState={setState}/>
			</Box>
		</>
	)
}

export const EnableTwoFactorAuthDialog : FunctionComponent<Props> = ({ open, setOpen, userData, setUserData }) => {
	const [state, setState] = useReducer(reducer, {
		qrcode: "",
		code: "",
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});

	useEffect(() => {getQRcode({setState})}, []);
	
	const handleEnable = () => {
		enable(state.code).then((success) => {
			if (success) {
				userData.hasTwoFactorAuth = true;
				setUserData(userData);
				setOpen(false);
			}
			setState({ code: '' });
		}).catch( () => {
			setState({ toastError: true, toastMessage: DEFAULT_TOAST_MSG });
		});
	}
	
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Dialog open={open} fullWidth maxWidth="sm" onClose={handleClose}>
				<DialogTitle sx={{fontFamily: 'Orbitron'}}>
					Configure Two-Factor Authentication
				</DialogTitle>
				<DialogContent>
					<EnebleQrCodeContent qrcode={state.qrcode} code={state.code} setState={setState} /> :
				</DialogContent>
				<DialogActions>
				<Button
					onClick={() => setOpen(false)}
					sx={{fontFamily: 'Orbitron'}}
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleEnable}
					sx={{fontFamily: 'Orbitron'}}
				>
					Enable
				</Button>
				</DialogActions>
			</Dialog>
			<Snackbar
				open={state.toastError}
				autoHideDuration={6000}
				onClose={() => setState({ toastError: false })}
				anchorOrigin={{vertical: 'top', horizontal: 'right'}}
			>
				<Alert variant="filled" onClose={() => setState({ toastError: false })} severity="error" sx={{ width: '100%' }}>
					{state.toastMessage}
				</Alert>
			</Snackbar>
		</>
	)
}
