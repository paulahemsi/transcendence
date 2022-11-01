import React, { useState, FunctionComponent, useEffect } from "react"
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import UsersList from "../ControlPanel/UsersList";

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

export const DeleteMembersDialog : FunctionComponent<Props> = ({ setOpenDialog, setMembersMockData, channelData }) => {
	const [usersName, setUsersName] = useState<string[]>([]);
	const [users, setUsers] = useState<{[key: string]: any}>({});
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
			setUsers(response.data);
			var usersName: Array<string> = [];
			response.data.forEach((userData: {[key: string]: any}) => {
				if (userData.id !== tokenData.id) {
					usersName.push(userData.username)
				}
			});

			var membersName: Array<string> = [];
			channelData.members.forEach((member: {[key: string]: any}) => {
				if (member.id !== tokenData.id) {
					membersName.push(member.name)
				}
			});

			setUsersName(membersName);
			setLoading(false);
		})
	}

	const handleSave = () => {
		const selectedUser = users.filter((u: {[key: string]: any}) => u.username === searchQuery);
		axios.delete(`http://localhost:3000/channels/${channelData.id}/members`, { data: { "userId": selectedUser[0].id }, headers: { "Authorization": authToken.toString() } }).then( () => {
			setMembersMockData(selectedUser);
			setOpenDialog(false);
		}) 
	}

	useEffect(() => {requestUsersData()}, []);

	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			kick members
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
			Kick
		</Button>
		</DialogActions>
	</>
	)
}

export default DeleteMembersDialog
