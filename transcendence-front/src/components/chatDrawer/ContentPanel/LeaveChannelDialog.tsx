import React, { FunctionComponent, useReducer } from "react"
import { Button, DialogActions, DialogTitle } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import ErrorToast from "../../utils/ErrorToast";
import { authToken, booleanSetState, DEFAULT_TOAST_MSG, numberSetState, objectSetState, tokenData } from "../../utils/constants";

interface Props {
	channelData: {[key: string]: any};
	setOpenDialog: booleanSetState;
	setMembersMockData: objectSetState;
	setActiveChannel : numberSetState;
}

const reducer = (state: {[key: string]: any}, newState : {[key: string]: any}) => {
	return { ...state, ...newState};
}

export const LeaveChannelDialog : FunctionComponent<Props> = ({ setOpenDialog, channelData, setActiveChannel }) => {
	const [state, setState] = useReducer(reducer, {
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});

	const handleSave = () => {
		axios.delete(`http://localhost:3000/channels/${channelData.id}/members/${tokenData.id}`, { headers: authToken }).then( () => {
			setActiveChannel(0);
			setOpenDialog(false);
		}).catch( () => {
			setState({ toastError: true, toastMessage: DEFAULT_TOAST_MSG });
		});
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
		<ErrorToast state={state} setState={setState}/>
	</>
	)
}

export default LeaveChannelDialog
