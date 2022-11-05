import React, { useState, FunctionComponent, useEffect } from "react"
import { Button, Checkbox, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import UsersList from "../ControlPanel/UsersList";
import io from 'socket.io-client';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

type tokenData = {
	id: string;
}

interface Props {
	channelData: {[key: string]: any};
	setOpenDialog: booleanSetState;
}

const TIME30SEC = 30000;
const TIME2MIN = 120000;
const TIME5MIN = 300000;

const chatSocket = io('/chat');

const TimeRadios = ({setTime} : {setTime: numberSetState}) => {

	const handleChangeTime = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTime(Number((event.target as HTMLInputElement).value));
	};

	return (
		<FormControl>
			<RadioGroup
				row
				aria-labelledby="radio-buttons-group"
				defaultValue={TIME30SEC}
				name="radio-buttons-group"
				onChange={handleChangeTime}
			>
				<FormControlLabel
					value={TIME30SEC}
					control={<Radio />}
					label="30s"
				/>
				<FormControlLabel
					value={TIME2MIN}
					control={<Radio />}
					label="2min"
				/>
				<FormControlLabel
					value={TIME5MIN}
					control={<Radio />}
					label="5min"
				/>
			</RadioGroup>
		</FormControl>
	)
}

export const MuteMembersDialog : FunctionComponent<Props> = ({ setOpenDialog, channelData }) => {
	const [usersName, setUsersName] = useState<string[]>([]);
	const [users, setUsers] = useState<{[key: string]: any}>({});
	const [loading, setLoading] = useState<boolean>(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [time, setTime] = useState(30000);
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
		
		if (!selectedUser[0]) {
			//alert?
			return ;
		}
		
		const muteEvent = {
			mutedUser: selectedUser[0].id,
			channel: channelData.id,
			duration: time,
		}

		chatSocket.emit('muteUser', muteEvent);
		setOpenDialog(false);
	}

	useEffect(() => {requestUsersData()}, []);

	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			mute member
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
		<DialogActions sx={{justifyContent: 'space-around'}}>
			<TimeRadios setTime={setTime}/>
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
				Mute
			</Button>
		</DialogActions>
	</>
	)
}

export default MuteMembersDialog
