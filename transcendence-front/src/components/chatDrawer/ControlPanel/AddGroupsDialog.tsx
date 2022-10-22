import React, { useState, FunctionComponent, useEffect } from "react"
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import UsersList from "./UsersList";
import SearchGroupsList from "./SearchGroupsList";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

type groupsData = {
	name: string;
	id: string;
}

type tokenData = {
	id: string;
}

interface Props {
	setOpenDialog: booleanSetState;
	setGroupsData: objectSetState;
}

export const AddGroupsDialog : FunctionComponent<Props> = ({ setOpenDialog, setGroupsData }) => {
	const [groupsList, setGroupsList] = useState<{[key: string]: any}>({});
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

	const requestGroupsData = async () => {
		await axios.get(`http://localhost:3000/channels`, { headers: authToken }).then((response: {[key: string]: any}) => {
			var groupsList: Array<groupsData> = [];
			response.data.forEach((groupData: {[key: string]: any}) => {
					const newGroup : groupsData = {
						name: groupData.name,
						id: groupData.id,
					}
					groupsList.push(newGroup);
			});
			console.log(groupsList);
			setGroupsList(groupsList);
			setLoading(false);
		})
	}

	const setUserGroupsData = async () => {
		await axios.get(`http://localhost:3000/users/${tokenData.id}/channels`, { headers: authToken }).then((response) => {
			setGroupsData(response.data);
	})
	}
	
	const handleSave = () => {
		axios.post(`http://localhost:3000/channels/${tokenData.id}/members`, {
			"userId": tokenData.id
		}, { headers: authToken }).then( () => {
			setUserGroupsData();
			setOpenDialog(false);
		})
	}
	
	useEffect(() => {requestGroupsData()}, []);

	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			Join Groups
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
			<SearchGroupsList groupsList={groupsList} searchQuery={searchQuery} />
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

export default AddGroupsDialog
