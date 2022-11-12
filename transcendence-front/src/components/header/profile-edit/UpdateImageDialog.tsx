import React, { FunctionComponent, useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import { Box } from "@mui/system";

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

const ImageUpload = ({ setSelectedFile } : { setSelectedFile: React.Dispatch<React.SetStateAction<File | null>> }) => {

	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		const filesList = event.target.files;
		if (filesList === null) return;
		setSelectedFile(filesList[0]);
	}

	return(
		<Box paddingTop='1vh'>
			<input type='file' name='file' onChange={handleChange}  />
		</Box>
	)
}

export const UpdateImageDialog : FunctionComponent<Props> = ({ open, setOpen, userData ,setUserData }) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [toastError, setToastError] = useState(false);
	const [toastMessage, setToastMessage] = useState(DEFAULT_TOAST_MSG);

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
		.catch((response) => {
			setToastError(true);
		});
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
			<Snackbar
				open={toastError}
				autoHideDuration={6000}
				onClose={() => setToastError(false)}
				anchorOrigin={{vertical: 'top', horizontal: 'right'}}
			>
				<Alert variant="filled" onClose={() => setToastError(false)} severity="error" sx={{ width: '100%' }}>
					{toastMessage}
				</Alert>
			</Snackbar>
		</>
	)
}
