import React, { useState, FunctionComponent } from "react"
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
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

export const AddFriendsDialog : FunctionComponent<Props> = ({ setOpenDialog, setGroupsData, groupsData }) => {

	const [channelName, setChannelName] = useState("");

	const handleChannelNameChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setChannelName(event.target.value);
	}

	const handleSave = () => {
		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
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
			Add friends
		</DialogTitle>
		<DialogContent>
			<TextField
				autoFocus
				margin="dense"
				id="name"
				type="email"
				fullWidth
				variant="standard"
				value={channelName}
				onKeyDown={keyDownHandler}
				onChange={handleChannelNameChange}
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
			Search
		</Button>
		</DialogActions>
	</>
	)
}

export default AddFriendsDialog
