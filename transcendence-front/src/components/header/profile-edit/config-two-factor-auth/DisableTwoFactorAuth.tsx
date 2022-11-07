import React, { FunctionComponent, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, } from "@mui/material"
import { typographyCSS } from './auxiliary'
import { CodeTextField } from "./CodeTextField";
import axios, { AxiosRequestHeaders } from "axios";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    open: boolean;
    setOpen: booleanSetState;
	userData: { [key: string]: any; };
	setUserData: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>;
}

const enterCodeMessage = 'Enter code below and confirm to disable two-factor authentication.'

const DisableContent = ({
	code,
	setCode, 
} : {
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
					{enterCodeMessage}
				</Typography>
				<CodeTextField code={code} setCode={setCode}/>
			</Box>
		</>
	)
}

const disable = async (code: string) => {
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	try {
		await axios.post('http://localhost:4444/two-factor-auth/disable', {code: code }, { headers: authToken });
	} catch {
		return false;
	}
	return true;
}

export const DisableTwoFactorAuthDialog : FunctionComponent<Props> = ({ open, setOpen, userData, setUserData }) => {

	const [code, setCode] = useState('');

	const handleDisable = () => {
		disable(code).then((success) => {
			if (success) {
				userData.hasTwoFactorAuth = false;
				setUserData(userData);
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
					<DisableContent code={code} setCode={setCode} />
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