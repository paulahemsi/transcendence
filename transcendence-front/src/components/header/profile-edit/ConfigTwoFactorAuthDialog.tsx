import React, { FunctionComponent, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    open: boolean;
    setOpen: booleanSetState;
	userData: { [key: string]: any; };
	setUserData: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>;
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
			<Box component='img' src={qrcode} alt='Profile picture'
					sx={{
						height: '20vh',
						width: '20vh',
						borderRadius: 2,
						boxShadow: 1
					}}>
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
