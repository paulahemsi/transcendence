import React, { FunctionComponent, useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import { ImageUpload } from './ImageUpload';

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

export const UpdateProfileDialog : FunctionComponent<Props> = ({ open, setOpen, userData ,setUserData }) => {
	const [username, setUsername] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
	}

	const handleSave = () => {
		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		if (username != "" && imageUrl != "") {
			axios.patch(`http://localhost:3000/users/${tokenData.id}`,
						{ "username": username, "image_url": imageUrl },
						{ headers: authToken }).then( () => {
				userData.username = username;
				userData.image_url = imageUrl;
				setUserData(userData);
				setOpen(false);
			})
		}
		if (username != "") {
			axios.patch(`http://localhost:3000/users/${tokenData.id}`, { "username": username }, { headers: authToken }).then( () => {
				userData.username = username;
				setUserData(userData);
				setOpen(false);
			})
		}
		if (imageUrl != "") {
			axios.patch(`http://localhost:3000/users/${tokenData.id}`, { "image_url": imageUrl }, { headers: authToken }).then( () => {
				userData.image_url = imageUrl;
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
					onKeyDown={keyDownHandler}
					onChange={handleChange}
				/>
				<ImageUpload setImageUrl={setImageUrl}/>
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
