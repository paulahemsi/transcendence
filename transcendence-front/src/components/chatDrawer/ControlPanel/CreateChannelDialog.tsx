import React, { useState, FunctionComponent, useReducer } from "react"
import { Alert, Button, Checkbox, DialogActions, DialogContent, DialogTitle, FormControlLabel, Snackbar, TextField } from "@mui/material"
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
const PROTECTED = "PROTECTED";
const DEFAULT_TOAST_MSG = "ooops, something went wrong";

const reducer = (state : {[key: string]: any}, newState : {[key: string]: any}) => {
	return {...state, ...newState};
}

export const CreateChannelDialog : FunctionComponent<Props> = ({ setOpenDialog, setGroupsData, groupsData }) => {
	const [state, setState] = useReducer(reducer, {
		channelName: "",
		password: "",
		isPrivate: false,
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});

	const handleChannelNameChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setState({ channelName: event.target.value });
	}
	
	const handlePasswordChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setState({ password: event.target.value });
	}

	const handleSave = () => {
		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

		const type = state.isPrivate ? PRIVATE : PUBLIC;
		
		if (!state.channelName) {
			setState({ toastError: true, toastMessage: "?!? you must choose a name" });
			return;
		}
		
		axios.post(`http://localhost:3000/channels`, {
			"name": state.channelName,
			"type": state.password ? PROTECTED : type,
			"owner": tokenData.id,
			"password": state.password,
		}, { headers: authToken }).then( (response) => {
			const newGroupsData
			 = groupsData.map((element : {[key: string]: any}) => element);
			newGroupsData.push(response.data);
			setGroupsData(newGroupsData)
			setOpenDialog(false);
		}).catch( (error) => {
			console.log(error)
			setState({ toastError: true, toastMessage: error.response.data.message === 'Channel name alredy exists' ? "Ooops there's already a group with this name :/" : DEFAULT_TOAST_MSG })
		})
	}
	
	const keyDownHandler = ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSave();
		}
	}
	
	const handleCheckBox = () => {
		setState({ isPrivate: !state.isPrivate, password: "" });
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
				value={state.channelName}
				onKeyDown={keyDownHandler}
				onChange={handleChannelNameChange}
			/>
		</DialogContent>
		<DialogContent>
			<TextField
				disabled={state.isPrivate}
				margin="dense"
				id="name"
				label="Channel Password"
				type="email"
				fullWidth
				variant="standard"
				value={state.password}
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

export default CreateChannelDialog
