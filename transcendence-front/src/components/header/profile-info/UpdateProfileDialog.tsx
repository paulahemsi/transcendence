import React, { FunctionComponent, useState } from "react";
import { Button, DialogActions, DialogContent, DialogTitle, TextField, } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
}

interface Props {
    setOpen: booleanSetState;
	setUserData: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>;
}

export const UpdateProfileDialog : FunctionComponent<Props> = ({ setOpen, setUserData }) => {
	const [username, setUsername] = useState("");

	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	}

	const handleSave = () => {
		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

		axios.patch(`http://localhost:3000/users/${tokenData.id}`, { "username": username }, { headers: authToken }).then( () => {
			setUserData({ username: username });
			setOpen(false);
		}
		)
	}

	return (
		<>
			<DialogTitle sx={{fontFamily: 'Orbitron'}}>
				Edit Profile
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
		</>
	)
}
