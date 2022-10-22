import React, { useState, FunctionComponent, useEffect } from "react"
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import Loading from "../Loading";
import UsersList from "./UsersList";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

type tokenData = {
	id: string;
}
//const tokenData: tokenData = jwt(document.cookie);

interface Props {
	setOpenDialog: booleanSetState;
	setFriendsData: objectSetState;
	friendsData: {[key: string]: any};
}

export const AddFriendsDialog : FunctionComponent<Props> = ({ setOpenDialog, setFriendsData, friendsData }) => {

	const [usersName, setUsersName] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	
	
	const [searchQuery, setSearchQuery] = useState("");

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
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		await axios.get("http://localhost:3000/users/", { headers: authToken }).then((response: {[key: string]: any}) => {
			var usersName: Array<string> = [];
			response.data.forEach((userData: {[key: string]: any}) => {
				usersName.push(userData.username)
			});
			setUsersName(usersName);
			setLoading(false);
		})
	}
	
	const handleSave = () => {
		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

		axios.post(`http://localhost:3000/users/${tokenData.id}/friends/by_name`, {
			"name": searchQuery
		}, { headers: authToken }).then( (response) => {
			const newFriendsData
			= friendsData.map((element : {[key: string]: any}) => element);
			newFriendsData.push(response.data);
			setFriendsData(newFriendsData);
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
