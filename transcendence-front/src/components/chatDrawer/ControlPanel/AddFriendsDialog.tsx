import React, { FunctionComponent, useEffect, useReducer } from "react"
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import UsersList from "./UsersList";
import ErrorToast from "../../utils/ErrorToast";
import { DEFAULT_TOAST_MSG } from "../../utils/constants";
import { chatSocket } from "../../context/socket";


type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

type tokenData = {
	id: string;
}

interface Props {
	setOpenDialog: booleanSetState;
	setFriendsData: objectSetState;
}

const reducer = (state : {[key: string]: any}, newState : {[key: string]: any}) => {
	return {...state, ...newState};
}

export const AddFriendsDialog : FunctionComponent<Props> = ({ setOpenDialog, setFriendsData }) => {
	const [state, setState] = useReducer(reducer, {
		usersName: [],
		loading: true,
		searchQuery: "",
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});
	
	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

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
		const bloquedFriends: {[key: string]: any} = await axios.get(`http://localhost:3000/users/${tokenData.id}/block`, { headers: authToken });

		await axios.get("http://localhost:3000/users/", { headers: authToken }).then((response: {[key: string]: any}) => {
			var usersName: Array<string> = [];
			response.data.forEach((userData: {[key: string]: any}) => {
				if (userData.id !== tokenData.id) {
					if (bloquedFriends.data.find((e: {[key: string]: any} ) => e.id == userData.id)){} else {
						usersName.push(userData.username)
					}
				}
			});
			setState({ usersName: usersName, loading: false });
		}).catch( () => {});
	}

	const requestFriendsData = async () => {
		await axios.get(`http://localhost:3000/users/${tokenData.id}/friends`, { headers: authToken }).then((response) => {
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

		axios.post(`http://localhost:3000/users/${tokenData.id}/friends/by_name`, {
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
