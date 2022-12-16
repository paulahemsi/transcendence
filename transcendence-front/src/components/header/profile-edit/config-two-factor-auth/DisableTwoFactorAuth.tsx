import React, { FunctionComponent, useReducer, useState } from "react";
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography, } from "@mui/material"
import { typographyCSS } from './auxiliary'
import { CodeTextField } from "./CodeTextField";
import axios, { AxiosRequestHeaders } from "axios";
import { booleanSetState, DEFAULT_TOAST_MSG, reducer } from "../../../utils/constants";

const INVALID_CODE_MSG = "invalid code";

interface Props {
    open: boolean;
    setOpen: booleanSetState;
	userData: { [key: string]: any; };
	setUserData: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>;
}

const enterCodeMessage = 'Enter code below and confirm to disable two-factor authentication.'

const DisableContent = ({
	code,
	setState, 
} : {
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
					{enterCodeMessage}
				</Typography>
				<CodeTextField code={code} setState={setState}/>
			</Box>
		</>
	)
}

const disable = async (code: string) => {
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		await axios.post('http://localhost:4444/two-factor-auth/disable', {code: code }, { headers: authToken });
}

export const DisableTwoFactorAuthDialog : FunctionComponent<Props> = ({ open, setOpen, userData, setUserData }) => {
	const [state, setState] = useReducer(reducer, {
		code: "",
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});

	const handleDisable = () => {
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		axios.post(
			'http://localhost:4444/two-factor-auth/disable',
			{code: state.code },
			{ headers: authToken }
		).then(() => {
			userData.hasTwoFactorAuth = false;
			setUserData(userData);
			setOpen(false);
		}).catch( () => { setState({ toastError: true, toastMessage: INVALID_CODE_MSG});});
		setState({ code: '' });
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
					<DisableContent code={state.code} setState={setState} />
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
