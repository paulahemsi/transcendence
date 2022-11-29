import React, { FunctionComponent, useEffect, useReducer } from "react"
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import axios from 'axios';
import UsersList from "./UsersList";
import ErrorToast from "../../utils/ErrorToast";
import { booleanSetState, DEFAULT_TOAST_MSG, getAuthToken, getIdFromToken, objectSetState } from "../../utils/constants";
import { chatSocket } from "../../context/socket";

interface Props {
	setOpenDialog: booleanSetState;
	setFriendsData: objectSetState;
	friendsData: {[key: string]: any};
}

const ALREADY_FRIENDS = "Hey, you two are already friends :)";

const reducer = (state : {[key: string]: any}, newState : {[key: string]: any}) => {
	return {...state, ...newState};
}

export const AddFriendsDialog : FunctionComponent<Props> = ({ setOpenDialog, setFriendsData, friendsData }) => {
	const userId = getIdFromToken();
	const authToken = getAuthToken();
	const [state, setState] = useReducer(reducer, {
		usersName: [],
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
		const bloquedFriends: {[key: string]: any} = await axios.get(`http://localhost:3000/users/${userId}/block`, { headers: authToken });

		await axios.get("http://localhost:3000/users/", { headers: authToken }).then((response: {[key: string]: any}) => {
			var usersName: Array<string> = [];
			response.data.forEach((userData: {[key: string]: any}) => {
				if (userData.id !== userId) {
					if (bloquedFriends.data.find((e: {[key: string]: any} ) => e.id == userData.id)){} else {
						usersName.push(userData.username)
					}
				}
			});
			setState({ usersName: usersName, loading: false });
		}).catch( () => {});
	}

	const requestFriendsData = async () => {
		await axios.get(`http://localhost:3000/users/${userId}/friends`, { headers: authToken }).then((response) => {
		setFriendsData(response.data);
		}).catch( () => {
			setState({ toastError: true, toastMessage: DEFAULT_TOAST_MSG });
		});
		}
	
	const handleSave = () => {
		const selectedUser = state.usersName.filter((u: {[key: string]: any}) => u === state.searchQuery);
		if (!selectedUser.length) {
			setState({ toastError: true, toastMessage: "there's no user with this name :s" });
			return;
		}

		if (friendsData.filter((u: {[key: string]: any}) => u.username === selectedUser[0]).length) {
			setState({ toastError: true, toastMessage: ALREADY_FRIENDS });
			return ;
		}
		axios.post(`http://localhost:3000/users/${userId}/friends/by_name`, {
			"name": selectedUser[0]
		}, { headers: authToken }).then( () => {
			requestFriendsData();
			chatSocket.emit('refreshFriends');
			setOpenDialog(false);
		}).catch( () => {
			setState({ toastError: true, toastMessage: DEFAULT_TOAST_MSG });
			return ;
		});
	}
	
	useEffect(() => {requestUsersData()}, []);

	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			Add friends
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

export default AddFriendsDialog
