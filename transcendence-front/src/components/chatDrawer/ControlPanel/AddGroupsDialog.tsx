import React, { FunctionComponent, useEffect, useReducer } from "react"
import { Button, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material"
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

const reducer = (state : {[key: string]: any}, newState : {[key: string]: any}) => {
	return {...state, ...newState};
}


export const AddGroupsDialog : FunctionComponent<Props> = ({ setOpenDialog, setGroupsData }) => {
	const [state, setState] = useReducer(reducer, {
		groupsList: {},
		loading: true,
		searchQuery: "",
		title: JOIN_TITLE,
		label: JOIN_LABEL,
		button: JOIN_BUTTON,
		groupName: "",
		password: "",
	});

	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	
	const handleQuery = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setState({ searchQuery: event.target.value });
	}

	const selectedGroup = (name: string) => {
		const group = state.groupsList.filter((group: {[key: string]: any}) => group.name === name)
		return group;
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
			setState({ groupsList: groupsList, loading: false });
		})
	}

	const setUserGroupsData = async () => {
		await axios.get(`http://localhost:3000/users/${tokenData.id}/channels`, { headers: authToken }).then((response) => {
			setGroupsData(response.data);
	})
	}
	
	const handleSave = () => {
		const group = state.title === JOIN_TITLE ? selectedGroup(state.searchQuery) : selectedGroup(state.groupName);
		axios.post(`http://localhost:3000/channels/${group[0].id}/members`, {
			"userId": tokenData.id,
			"password": state.searchQuery
		}, { headers: authToken }).then( () => {
			setUserGroupsData();
			setOpenDialog(false);
		}).catch( (error) => {
			console.log(error);
			setOpenDialog(false);
		})
	}
	
	const handleJoin = () => {
		setState({ password: state.searchQuery });
		handleSave();
	}
	
	const handleAdd = () => {
		setState({ groupName: state.searchQuery, loading: true, password: "abobora" });
		const group = selectedGroup(state.searchQuery);
		if ( group[0].type === PUBLIC ) {
			handleSave();
		} else if ( group[0].type === PROTECTED ) {
			setState({ title: PASSWORD_TITLE, label: PASSWORD_LABEL, button: PASSWORD_BUTTON, searchQuery: "" });
		}
	}

	const keyDownHandler = ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			(state.title === JOIN_TITLE) ? handleAdd() :  handleJoin() ;
		}
	}

	useEffect(() => {requestGroupsData()}, []);

	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			{state.title}
		</DialogTitle>
		<DialogContent>
			<TextField
				autoFocus
				margin="dense"
				id="name"
				type="email"
				fullWidth
				variant="standard"
				label={state.label}
				value={state.searchQuery}
				onKeyDown={keyDownHandler}
				onChange={handleQuery}
			/>
		</DialogContent>
		{
			!state.loading && ( state.title === JOIN_TITLE ) &&
			<SearchGroupsList groupsList={state.groupsList} searchQuery={state.searchQuery} />
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
			onClick={((state.title === JOIN_TITLE) ? handleAdd : handleJoin)}
			sx={{fontFamily: 'Orbitron'}}
		>
			{state.button}
		</Button>
		</DialogActions>
	</>
	)
}

export default AddGroupsDialog
