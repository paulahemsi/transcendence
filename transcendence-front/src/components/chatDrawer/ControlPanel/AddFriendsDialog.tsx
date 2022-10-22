import React, { useState, FunctionComponent, useEffect } from "react"
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import UsersList from "./UsersList";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

type tokenData = {
	id: string;
}

interface Props {
	setOpenDialog: booleanSetState;
	setFriendsData: objectSetState;
}

export const AddFriendsDialog : FunctionComponent<Props> = ({ setOpenDialog, setFriendsData }) => {
	const [usersName, setUsersName] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [searchQuery, setSearchQuery] = useState("");
	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

	const handleQuery = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	}

	const keyDownHandler = ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSave();
		}
	}

	const requestUsersData = async () => {
		await axios.get("http://localhost:3000/users/", { headers: authToken }).then((response: {[key: string]: any}) => {
			var usersName: Array<string> = [];
			response.data.forEach((userData: {[key: string]: any}) => {
				if (userData.id !== tokenData.id) {
					usersName.push(userData.username)
				}
			});
			setUsersName(usersName);
			setLoading(false);
		})
	}

	const requestFriendsData = async () => {
		await axios.get(`http://localhost:3000/users/${tokenData.id}/friends`, { headers: authToken }).then((response) => {
			setFriendsData(response.data);
	})
	}
	
	const handleSave = () => {
		axios.post(`http://localhost:3000/users/${tokenData.id}/friends/by_name`, {
			"name": searchQuery
		}, { headers: authToken }).then( () => {
			requestFriendsData();
			setOpenDialog(false);
		})
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
				value={searchQuery}
				onKeyDown={keyDownHandler}
				onChange={handleQuery}
			/>
		</DialogContent>
		{
			!loading && 
			<UsersList usersName={usersName} searchQuery={searchQuery} />
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
	</>
	)
}

export default AddFriendsDialog
