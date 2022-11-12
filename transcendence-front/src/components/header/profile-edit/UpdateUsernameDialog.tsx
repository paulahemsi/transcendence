import React, { FunctionComponent, useReducer, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
}

interface Props {
    open: boolean;
    setOpen: booleanSetState;
	userData: { [key: string]: any; };
	setUserData: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>;
}

const DEFAULT_TOAST_MSG = "ooops, something went wrong"

const reducer = (state : {[key: string]: any}, newState : {[key: string]: any}) => {
	return {...state, ...newState};
}

export const UpdateUsernameDialog : FunctionComponent<Props> = ({ open, setOpen, userData ,setUserData }) => {
	const [state, setState] = useReducer(reducer, {
		username: "",
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});

	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setState({ username: event.target.value });
	}

	const handleSave = () => {
		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		
		if (state.username != "") {
			axios.patch(`http://localhost:3000/users/${tokenData.id}`, { "username": state.username }, { headers: authToken }).then( () => {
				userData.username = state.username;
				setUserData(userData);
				setOpen(false);
			})
		}
	}

	const keyDownHandler = ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSave();
		}
	}

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Dialog open={open} fullWidth maxWidth="sm" onClose={handleClose}>
				<DialogTitle sx={{fontFamily: 'Orbitron'}}>
					Edit Username
				</DialogTitle>
				<DialogContent>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					label="username"
					type="email"
					fullWidth
					variant="standard"
					value={username}
					onKeyDown={keyDownHandler}
					onChange={handleChange}
				/>
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
