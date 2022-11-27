import React, { FunctionComponent, useReducer } from "react"
import { Button, Checkbox, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField } from "@mui/material"
import axios from 'axios';
import ErrorToast from "../../utils/ErrorToast";
import { booleanSetState, DEFAULT_TOAST_MSG, getAuthToken, getIdFromToken, objectSetState, reducer } from "../../utils/constants";

interface Props {
	setOpenDialog: booleanSetState;
	setGroupsData: objectSetState;
	groupsData: {[key: string]: any};
}

const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";
const PROTECTED = "PROTECTED";

export const CreateChannelDialog : FunctionComponent<Props> = ({ setOpenDialog, setGroupsData, groupsData }) => {
	const [state, setState] = useReducer(reducer, {
		channelName: "",
		password: "",
		isPrivate: false,
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});

	const handleChannelNameChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setState({ channelName: event.target.value });
	}
	
	const handlePasswordChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setState({ password: event.target.value });
	}

	const handleSave = () => {
		const type = state.isPrivate ? PRIVATE : PUBLIC;
		const userId = getIdFromToken();
		const authToken = getAuthToken();
		
		if (!state.channelName) {
			setState({ toastError: true, toastMessage: "?!? you must choose a name" });
			return;
		}
		
		axios.post(`http://localhost:3000/channels`, {
			"name": state.channelName,
			"type": state.password ? PROTECTED : type,
			"owner": userId,
			"password": state.password,
		}, { headers: authToken }).then( (response) => {
			const newGroupsData
			 = groupsData.map((element : {[key: string]: any}) => element);
			newGroupsData.push(response.data);
			setGroupsData(newGroupsData)
			setOpenDialog(false);
		}).catch( (error) => {
			setState({ toastError: true, toastMessage: error.response.data.message === 'Channel name alredy exists' ? "Ooops there's already a group with this name :/" : DEFAULT_TOAST_MSG })
		})
	}
	
	const keyDownHandler = ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSave();
		}
	}
	
	const handleCheckBox = () => {
		setState({ isPrivate: !state.isPrivate, password: "" });
	}
	
	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			Create Channel
		</DialogTitle>
		<DialogContent>
			<TextField
				autoFocus
				margin="dense"
				id="name"
				label="Channel Name"
				type="email"
				fullWidth
				variant="standard"
				value={state.channelName}
				onKeyDown={keyDownHandler}
				onChange={handleChannelNameChange}
			/>
		</DialogContent>
		<DialogContent>
			<TextField
				disabled={state.isPrivate}
				margin="dense"
				id="name"
				label="Channel Password"
				type="email"
				fullWidth
				variant="standard"
				value={state.password}
				onKeyDown={keyDownHandler}
				onChange={handlePasswordChange}
			/>
		</DialogContent>
		<DialogContent>
     		 <FormControlLabel
			 	control={<Checkbox />}
				label="Private"
				onChange={handleCheckBox}
			/>
		</DialogContent>
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
			Create
		</Button>
		</DialogActions>
		<ErrorToast state={state} setState={setState}/>
	</>
	)
}

export default CreateChannelDialog
