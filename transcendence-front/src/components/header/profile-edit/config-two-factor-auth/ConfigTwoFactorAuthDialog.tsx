import React, { FunctionComponent, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, TextField, Typography, } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    open: boolean;
    setOpen: booleanSetState;
	userData: { [key: string]: any; };
	setUserData: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>;
}

const qrCodeMessage = 'Scan the image bellow with the two-factor authentication app on your phone.'
const sixDigitCodeMessage = 'After scanning the QR code image, the app will display a six-digit code.'
const enterCodeMessage = 'Enter code below and confirm to enable two-factor authentication.'


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
	const response = (await axios.get('http://localhost:4444/two-factor-auth/generate', { headers: authToken }));
	setQrcode(response.data.url);
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

const CodeTextField = ({ code, setCode } : { code: string, setCode: React.Dispatch<React.SetStateAction<string>>}) => {
	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setCode(event.target.value);
	}
	
	const handleKeyDown= ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
		}
	}

	return (
	  <Box
		component="form"
		sx={{
			'& .MuiInputBase-input': { 
				m: 1,
				width: '7ch',
				fontFamily: 'Orbitron',
				fontWeight: 400,
				fontSize: '3vh',
			},
		}}
		autoComplete="off"
	  >
		<TextField
			required
			id="outlined-basic"
			variant="outlined"
			type="number"
			value={code}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
		/>
	  </Box>
	);
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

const EnebleQrCodeContent = ({
	qrcode,
	code,
	setCode, 
} : {
	qrcode: string ,
	code: string,
	setCode: React.Dispatch<React.SetStateAction<string>>,
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
				<CodeTextField code={code} setCode={setCode}/>
			</Box>
		</>
	)
}

export const EnableTwoFactorAuthDialog : FunctionComponent<Props> = ({ open, setOpen, userData, setUserData }) => {
	const [qrcode, setQrcode] = useState('');
	const [code, setCode] = useState('');

	const handleEnable = () => {
		enable(code).then((success) => {
			if (success) {
				setOpen(false);
			}
			setCode('');
		})
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
						<EnebleQrCodeContent qrcode={qrcode} code={code} setCode={setCode} /> :
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
					onClick={handleEnable}
					sx={{fontFamily: 'Orbitron'}}
				>
					Enable
				</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export const DisableTwoFactorAuthDialog : FunctionComponent<Props> = ({ open, setOpen, userData, setUserData }) => {

	const handleDisable = () => {
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
					onClick={handleDisable}
					sx={{fontFamily: 'Orbitron'}}
				>
					Disable
				</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export const ConfigTwoFactorAuthDialog : FunctionComponent<Props> = ({ open, setOpen, userData, setUserData }) => {
	if (userData.hasTwoFactorAuth) {
		return (DisableTwoFactorAuthDialog({ open, setOpen, userData, setUserData }))
	}
	return (EnableTwoFactorAuthDialog({ open, setOpen, userData, setUserData }));
}
