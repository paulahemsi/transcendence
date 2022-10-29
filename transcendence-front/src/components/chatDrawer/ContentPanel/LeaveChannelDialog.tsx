import React, { FunctionComponent } from "react"
import { Button, DialogActions, DialogTitle } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

type tokenData = {
	id: string;
}

interface Props {
	channelData: {[key: string]: any};
	setOpenDialog: booleanSetState;
	setMembersMockData: objectSetState;
}

export const LeaveChannelDialog : FunctionComponent<Props> = ({ setOpenDialog, setMembersMockData, channelData }) => {
	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

	const handleSave = () => {
		axios.delete(`http://localhost:3000/channels/${channelData.id}/members`, { data: { "userId": tokenData.id }, headers: { "Authorization": authToken.toString() } }).then( () => {
			setOpenDialog(false);
		}) 
	}

	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			Are you sure?
		</DialogTitle>
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
			Leave
		</Button>
		</DialogActions>
	</>
	)
}

export default LeaveChannelDialog
