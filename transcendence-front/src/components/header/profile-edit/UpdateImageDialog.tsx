import React, { FunctionComponent, useReducer } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import { Box } from "@mui/system";
import ErrorToast from "../../utils/ErrorToast";

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

const ImageUpload = ({ setState } : { setState: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>> }) => {

	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		const filesList = event.target.files;
		if (filesList === null) return;
		setState({ selectedFile: filesList[0]});
	}

	return(
		<Box paddingTop='1vh'>
			<input type='file' name='file' onChange={handleChange}  />
		</Box>
	)
}

export const UpdateImageDialog : FunctionComponent<Props> = ({ open, setOpen, userData ,setUserData }) => {
	const [state, setState] = useReducer(reducer, {
		selectedFile: null,
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});
	
	const handleSave = async () => {
		const formData = new FormData();
		const authToken: AxiosRequestHeaders = {
			'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		const tokenData: tokenData = jwt(document.cookie);
	
		if (state.selectedFile === null) return;
		formData.append('image', state.selectedFile);
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
			setState({ toastError: true });
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
				<ImageUpload setState={setState}/>
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
			<ErrorToast state={state} setState={setState}/>
		</>
	)
}
