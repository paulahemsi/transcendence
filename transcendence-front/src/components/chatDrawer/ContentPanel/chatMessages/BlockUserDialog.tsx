import React, { FunctionComponent, useReducer } from "react"
import { Button, DialogActions, DialogTitle } from "@mui/material"
import ErrorToast from "../../../utils/ErrorToast";
import axios, { AxiosRequestHeaders } from 'axios';
import { DEFAULT_TOAST_MSG } from "../../../utils/constants";
import jwt from 'jwt-decode';
import { io } from "socket.io-client";

const chatSocket = io('/chat');

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
}

interface Props {
	setOpenDialog: booleanSetState;
	friendId: string
}

const reducer = (state: {[key: string]: any}, newState : {[key: string]: any}) => {
	return { ...state, ...newState};
}

export const BlockUserDialog : FunctionComponent<Props> = ({ setOpenDialog, friendId }) => {
	const [state, setState] = useReducer(reducer, {
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});

	const handleBlock = () => {
		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

		axios.post(`http://localhost:3000/users/${tokenData.id}/block`, {
			"id": friendId
		}, { headers: authToken }).then( () => {
			const blockedEvent = true;
			chatSocket.emit('refreshFriends', blockedEvent);
			setOpenDialog(false);
		}).catch( () => {
			setState({ toastError: true, toastMessage: DEFAULT_TOAST_MSG });
			return ;
		});
	}

	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			This action cannot be undone. Are you sure?
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
			onClick={handleBlock}
			sx={{fontFamily: 'Orbitron'}}
		>
			Block
		</Button>
		</DialogActions>
		<ErrorToast state={state} setState={setState}/>
	</>
	)
}

export default BlockUserDialog
