import React, { FunctionComponent, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
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

const ImageUpload = ({ setSelectedFile } : { setSelectedFile: React.Dispatch<React.SetStateAction<File | null>> }) => {

	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		const filesList = event.target.files;
		if (filesList === null) return;
		setSelectedFile(filesList[0]);
	}

	return(
		<div>
			<input type='file' name='file' onChange={handleChange} />
		</div>
	)
}

export const UpdateImageDialog : FunctionComponent<Props> = ({ open, setOpen, userData ,setUserData }) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);

	const handleSave = async () => {
		const formData = new FormData();
		const authToken: AxiosRequestHeaders = {
			'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		const tokenData: tokenData = jwt(document.cookie);
	
		if (selectedFile === null) return;
		formData.append('image', selectedFile);
		axios.post('http://localhost:3000/images', formData, {headers: authToken})
		.then((response) => {
			if (response.data.url != "") {
				const imageUrl = response.data.url;
				axios.patch(`http://localhost:3000/users/${tokenData.id}`, { "image_url": imageUrl }, { headers: authToken }).then( () => {
					userData.image_url = imageUrl;
					setUserData(userData);
					setOpen(false);
				})
			}
		
		})
		.catch((response) => { console.log(response.response.data.message); });
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
				<ImageUpload setSelectedFile={setSelectedFile}/>
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
