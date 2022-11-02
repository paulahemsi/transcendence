import React, { useState, FunctionComponent } from "react"
import { Button, Checkbox, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
	channelData: {[key: string]: any};
	setOpenDialog: booleanSetState;
}

const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const PROTECTED = "PROTECTED"

export const ChangePasswordDialog : FunctionComponent<Props> = ({ setOpenDialog, channelData }) => {

	const [password, setPassword] = useState("");
	const [removePassword, setRemovePassword] = useState(false);
	const [disabled, setDisabled] = useState(false);

	const handlePasswordChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	}

	const handleSave = () => {
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

		let body: {[key: string]: any};

		if (removePassword) {
			body = {
				"type": PUBLIC,
			}
		} else {
			body = {
				"type": PROTECTED,
				"password": password
			}
		}
		
		axios.patch(`http://localhost:3000/channels/${channelData.id}`, body , { headers: authToken }).then(() => {
			setOpenDialog(false);
		}
		)
	}
	
	const keyDownHandler = ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSave();
		}
	}
	
	const handleCheckBox = () => {
		setRemovePassword(!removePassword);
		setDisabled(!disabled);
		setPassword("");
	}
	
	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			Change Channel Password
		</DialogTitle>
		<DialogContent>
			<TextField
				disabled={disabled}
				margin="dense"
				id="name"
				label="New Password"
				type="email"
				fullWidth
				variant="standard"
				value={password}
				onKeyDown={keyDownHandler}
				onChange={handlePasswordChange}
			/>
		</DialogContent>
		<DialogContent>
     		 <FormControlLabel
			 	control={<Checkbox />}
				label="Remove Password"
				onChange={handleCheckBox}
			/>
		</DialogContent>
		<DialogActions>
		<Button
			onClick={() => setOpenDialog(false)}
			sx={{fontFamily: 'Orbitron'}}
		>
			Cancel
		</Button>
		<Button
			variant="contained"
			onClick={handleSave}
			sx={{fontFamily: 'Orbitron'}}
		>
			Change
		</Button>
		</DialogActions>
	</>
	)
}

export default ChangePasswordDialog
