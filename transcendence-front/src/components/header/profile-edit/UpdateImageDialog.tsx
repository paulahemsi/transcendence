import React, { FunctionComponent, useState } from "react";
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

export const UpdateImageDialog : FunctionComponent<Props> = ({ open, setOpen, userData ,setUserData }) => {
	const [imageUrl, setImageUrl] = useState("");

	const handleSave = () => {
		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		
		if (imageUrl != "") {
			axios.patch(`http://localhost:3000/users/${tokenData.id}`, { "image_url": imageUrl }, { headers: authToken }).then( () => {
				userData.image_url = imageUrl;
				setUserData(userData);
				setOpen(false);
			})
		}
	}
	
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Dialog open={open} fullWidth maxWidth="sm" onClose={handleClose}>
				<DialogTitle sx={{fontFamily: 'Orbitron'}}>
					Edit Image
				</DialogTitle>
				<DialogContent>
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
