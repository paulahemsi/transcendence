import React, { useState, FunctionComponent, useEffect } from "react"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import SearchGroupsList from "./SearchGroupsList";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

const PROTECTED = 'PROTECTED';
const PUBLIC = 'PUBLIC'
const PASSWORD_TITLE = 'O.O Uuuh... It seems this is a protected group...'
const JOIN_TITLE = 'Join Group'
const JOIN_LABEL = 'Group name'
const PASSWORD_LABEL = 'Password'
const JOIN_BUTTON = 'Add'
const PASSWORD_BUTTON = 'Join'

type groupsData = {
	name: string;
	id: string;
	type: string;
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
	const [title, setTitle] = useState(JOIN_TITLE);
	const [label, setLabel] = useState(JOIN_LABEL);
	const [button, setButton] = useState(JOIN_BUTTON);

	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

	let groupName = "";
	let password = "";
	
	
	const handleQuery = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(event.target.value);
	}

	const selectedGroup = () => {
		return groupsList.filter((group: {[key: string]: any}) => group.name === groupName)
	}

	const requestGroupsData = async () => {
		await axios.get(`http://localhost:3000/channels`, { headers: authToken }).then((response: {[key: string]: any}) => {
			var groupsList: Array<groupsData> = [];
			response.data.forEach((groupData: {[key: string]: any}) => {
					const newGroup : groupsData = {
						name: groupData.name,
						id: groupData.id,
						type: groupData.type
					}
					groupsList.push(newGroup);
			});
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
		const group = selectedGroup();
		axios.post(`http://localhost:3000/channels/${group[0].id}/members`, {
			"userId": tokenData.id
		}, { headers: authToken }).then( () => {
			setUserGroupsData();
			setOpenDialog(false);
		})
	}
	
	const handleJoin = () => {
		password = searchQuery;
		handleSave();
	}
	
	const handleAdd = () => {
		groupName = searchQuery;
		const group = selectedGroup();
		if ( group[0].type === PUBLIC ) {
			handleSave();
		} else if ( group[0].type === PROTECTED ) {
			setTitle(PASSWORD_TITLE);
			setLabel(PASSWORD_LABEL);
			setButton(PASSWORD_BUTTON);
			setSearchQuery("");
		}
	}

	const keyDownHandler = ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			(title === JOIN_TITLE) ? handleAdd() : handleJoin();
		}
	}

	useEffect(() => {requestGroupsData()}, []);

	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			{title}
		</DialogTitle>
		<DialogContent>
			<TextField
				autoFocus
				margin="dense"
				id="name"
				type="email"
				fullWidth
				variant="standard"
				label={label}
				value={searchQuery}
				onKeyDown={keyDownHandler}
				onChange={handleQuery}
			/>
		</DialogContent>
		{
			!loading && ( title === JOIN_TITLE ) &&
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
			onClick={(title === JOIN_TITLE) ? handleAdd : handleJoin}
			sx={{fontFamily: 'Orbitron'}}
		>
			{button}
		</Button>
		</DialogActions>
	</>
	)
}

export default AddGroupsDialog
