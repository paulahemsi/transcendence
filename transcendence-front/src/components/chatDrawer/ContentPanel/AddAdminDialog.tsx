import React, { FunctionComponent, useEffect, useReducer } from "react"
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import axios from 'axios';
import UsersList from "../ControlPanel/UsersList";
import ErrorToast from "../../utils/ErrorToast";
import { authToken, booleanSetState, DEFAULT_TOAST_MSG, getIdFromToken, objectSetState } from "../../utils/constants";

interface Props {
	channelData: {[key: string]: any};
	setOpenDialog: booleanSetState;
	setMembersMockData: objectSetState;
}

const reducer = (state: {[key: string]: any}, newState : {[key: string]: any}) => {
	return { ...state, ...newState};
}

export const AddAdminDialog : FunctionComponent<Props> = ({ setOpenDialog, setMembersMockData, channelData }) => {
	const userId = getIdFromToken();
	const [state, setState] = useReducer(reducer, {
		usersName: [],
		users: {},
		loading: true,
		searchQuery: "",
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});

	const handleQuery = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setState({ searchQuery: event.target.value });
	}

	const keyDownHandler = ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSave();
		}
	}

	const requestUsersData = async () => {
		await axios.get("http://localhost:3000/users/", { headers: authToken }).then((response: {[key: string]: any}) => {
			setState({ users: response.data });
			var usersName: Array<string> = [];
			response.data.forEach((userData: {[key: string]: any}) => {
				if (userData.id !== userId) {
					usersName.push(userData.username)
				}
			});

			var membersName: Array<string> = [];
			channelData.members.forEach((member: {[key: string]: any}) => {
				if (member.id !== userId) {
					membersName.push(member.name)
				}
			});

			setState({ usersName: membersName, loading: false });
		})
	}

	const handleSave = () => {
		const selectedUser = state.users.filter((u: {[key: string]: any}) => u.username === state.searchQuery);

		if (!selectedUser.length || !state.usersName.includes(selectedUser.name)) {
			setState({ toastError: true, toastMessage: "there's no user in the group with this name :s" });
			return;
		}
		
		axios.post(`http://localhost:3000/channels/${channelData.id}/admin`, { "userId": selectedUser[0].id },  { headers: authToken }).then( () => {
			setOpenDialog(false);
		}).catch( () => {
			setState({ toastError: true, toastMessage: DEFAULT_TOAST_MSG });
		});
	}

	useEffect(() => {requestUsersData()}, []);

	return (
	<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			Add administrator
		</DialogTitle>
		<DialogContent>
			<TextField
				autoFocus
				margin="dense"
				id="name"
				type="email"
				fullWidth
				variant="standard"
				value={state.searchQuery}
				onKeyDown={keyDownHandler}
				onChange={handleQuery}
			/>
		</DialogContent>
		{
			!state.loading && 
			<UsersList usersName={state.usersName} searchQuery={state.searchQuery} />
		}
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
			Add
		</Button>
		</DialogActions>
		<ErrorToast state={state} setState={setState}/>
	</>
	)
}

export default AddAdminDialog
