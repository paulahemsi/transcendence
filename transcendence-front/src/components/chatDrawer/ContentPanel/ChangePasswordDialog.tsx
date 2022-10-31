import React, { useState, FunctionComponent } from "react"
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

type tokenData = {
	id: string;
}

interface Props {
	channelData: {[key: string]: any};
	setOpenDialog: booleanSetState;
}

const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const PROTECTED = "PROTECTED"

export const ChangePasswordDialog : FunctionComponent<Props> = ({ setOpenDialog, channelData }) => {

	const [password, setPassword] = useState("");
	const [type, setType] = useState(PUBLIC);

	const handlePasswordChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	}

	const handleSave = () => {
		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

		// axios.post(`http://localhost:3000/channels`, {
		// 	"name": channelName,
		// 	"type": password ? PROTECTED : type,
		// 	"owner": tokenData.id,
		// 	"password": password,
		// }, { headers: authToken }).then( (response) => {
			// const newGroupsData
			//  = groupsData.map((element : {[key: string]: any}) => element);
			// newGroupsData.push(response.data);
			// setGroupsData(newGroupsData)
			setOpenDialog(false);
		// }
		// )
	}
	
	const keyDownHandler = ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSave();
		}
	}
	
	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			Change Channel Password
		</DialogTitle>
		<DialogContent>
			<TextField
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
				onChange={() => setType(PRIVATE)}
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
