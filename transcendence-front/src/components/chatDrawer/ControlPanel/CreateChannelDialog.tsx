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
	setOpenDialog: booleanSetState;
	setGroupsData: objectSetState;
	groupsData: {[key: string]: any};
}

const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const PROTECTED = "PROTECTED"

export const CreateChannelDialog : FunctionComponent<Props> = ({ setOpenDialog, setGroupsData, groupsData }) => {

	const [channelName, setChannelName] = useState("");
	const [password, setPassword] = useState("");
	const [isPrivate, setIsPrivate] = useState(false);

	const handleChannelNameChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setChannelName(event.target.value);
	}
	
	const handlePasswordChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	}

	const handleSave = () => {
		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

		const type = isPrivate ? PRIVATE : PUBLIC;
		
		axios.post(`http://localhost:3000/channels`, {
			"name": channelName,
			"type": password ? PROTECTED : type,
			"owner": tokenData.id,
			"password": password,
		}, { headers: authToken }).then( (response) => {
			const newGroupsData
			 = groupsData.map((element : {[key: string]: any}) => element);
			newGroupsData.push(response.data);
			setGroupsData(newGroupsData)
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
		setIsPrivate(!isPrivate);
		setPassword("");
	}
	
	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			Create Channel
		</DialogTitle>
		<DialogContent>
			<TextField
				autoFocus
				margin="dense"
				id="name"
				label="Channel Name"
				type="email"
				fullWidth
				variant="standard"
				value={channelName}
				onKeyDown={keyDownHandler}
				onChange={handleChannelNameChange}
			/>
		</DialogContent>
		<DialogContent>
			<TextField
				disabled={isPrivate}
				margin="dense"
				id="name"
				label="Channel Password"
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
				label="Private"
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
			Create
		</Button>
		</DialogActions>
	</>
	)
}

export default CreateChannelDialog
