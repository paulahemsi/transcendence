import React, { FunctionComponent, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    open: boolean;
    setOpen: booleanSetState;
	userData: { [key: string]: any; };
	setUserData: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>;
}

const message = 'Scan the image bellow with the two-factor authentication app on your phone.'


const typographyCSS = (fontSize: number) => {
	return {
		color: '#212980',
		fontFamily: 'Orbitron',
		fontWeight: 200,
		fontSize: `${fontSize}vh`,
	}
}

const getQRcode = async ({ setQrcode } : { setQrcode: React.Dispatch<React.SetStateAction<string>>}) => {
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	const response = (await axios.get('http://localhost:3000/two-factor-auth/generate', { headers: authToken }));
	setQrcode(response.data.url);
}

const QrCodeButton = ({ setQrcode } : { setQrcode: React.Dispatch<React.SetStateAction<string>>}) => {
	return (
		<>
			<Button
				onClick={() => getQRcode({setQrcode})}
				sx={{fontFamily: 'Orbitron'}}
			>
			qrcode	
			</Button>
		</>
	)
}

const EnebleQrCodeContent = ({ qrcode } : { qrcode: string }) => {
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
					{message}
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
			</Box>
		</>
	)
}

export const ConfigTwoFactorAuthDialog : FunctionComponent<Props> = ({ open, setOpen, userData, setUserData }) => {

	const [qrcode, setQrcode] = useState('');

	const handleSave = () => {
		console.log('save')	;
		setOpen(false);
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
					{
						qrcode ?
						<EnebleQrCodeContent qrcode={qrcode} /> :
						<QrCodeButton setQrcode={setQrcode} />
					}
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
					onClick={handleSave}
					sx={{fontFamily: 'Orbitron'}}
				>
					Save
				</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}
