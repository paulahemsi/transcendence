import React, { useState, FunctionComponent } from "react"
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';

type tokenData = {
	id: string;
}

const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

interface Props {
	direct: boolean;
	setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
	setGroupsData: objectSetState;
}

interface ButtonsProps {
	setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
	setOpenDialog: booleanSetState;
}

export const buttonConfig = (width: string) => {
	return {
		borderRadius: 0,
		textTransform: 'lowercase',
		background: '#212980',
		color: '#FFFFFF',
		':hover': { background: '#B998FF'},
		fontFamily: 'Orbitron',
		fontSize: '3vh',
		paddingLeft: '4vh',
		paddingRight: '4vh',
		width: width,
		height: '7vh',
	}
}

const directButton = buttonConfig("30vw")
const groupButton = buttonConfig("10vw")

export const DirectButtons :FunctionComponent<ButtonsProps> = ({ setOpenDialog, setExtraContent, setActiveChannel }) => {
	
	const handleClick = () => {
		setExtraContent(false);
	}
	
	return (
		<Box display="flex" sx={{width: "30vw"}}>
			<Button sx={directButton} onClick={handleClick}>
				add friend
			</Button>
		</Box>
	)
}

export const GroupsButtons :FunctionComponent<ButtonsProps> = ({ setOpenDialog, setExtraContent, setActiveChannel }) => {
	
	const handleClick = () => {
		setOpenDialog(true);
		setActiveChannel(0);
		setExtraContent(false);
	}
	
	return (
		<Box display="flex" sx={{width: "30vw"}}>
			<Button sx={groupButton}>
				manage	
			</Button>
			<Button sx={groupButton} onClick={handleClick}>
				create
			</Button>
			<Button sx={groupButton} onClick={handleClick}>
				search
			</Button>
		</Box>
	)
}

const ChatDialog = ({ setOpenDialog, setGroupsData } : { setOpenDialog : booleanSetState, setGroupsData : objectSetState }) => {
	const [channelName, setChannelName] = useState("");
	const [password, setPassword] = useState("");
	const [type, setType] = useState(PUBLIC);

	const handleChannelNameChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setChannelName(event.target.value);
	}
	
	const handlePasswordChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	}

	const handleSave = () => {
		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

		axios.post(`http://localhost:3000/channels`, {
			"name": channelName,
			"type": type,
			"owner": tokenData.id,
			"password": password,
		}, { headers: authToken }).then( (response) => {
			console.log(response.data)
			setGroupsData(response.data)
			setOpenDialog(false);
		}
		)
	}
	
	const keyDownHandler = ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			handleSave();
		}
	}
	
	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			Create Channel
		</DialogTitle>
		<DialogContent>
			<TextField
				autoFocus
				margin="dense"
				id="name"
				label="Channel Name"
				type="email"
				fullWidth
				variant="standard"
				value={channelName}
				onKeyDown={keyDownHandler}
				onChange={handleChannelNameChange}
			/>
		</DialogContent>
		<DialogContent>
			<TextField
				margin="dense"
				id="name"
				label="Channel Password"
				type="email"
				fullWidth
				variant="standard"
				value={password}
				onKeyDown={keyDownHandler}
				onChange={handlePasswordChange}
			/>
		</DialogContent>
		<DialogContent>
     		 <FormControlLabel
			 	control={<Checkbox />}
				label="Private"
				onChange={() => setType(PRIVATE)}
			/>
		</DialogContent>
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
			Create
		</Button>
		</DialogActions>
	</>
	)
}

export const ChatAuxiliaryButton: FunctionComponent<Props> = ({ direct, setExtraContent, setActiveChannel, setGroupsData }) => {
	const [openDialog, setOpenDialog] = useState(false);

	const handleClose = () => {
		setOpenDialog(false);
	};

	return (
		<>
		{
			direct
			? <DirectButtons setExtraContent={setExtraContent} setActiveChannel={setActiveChannel} setOpenDialog={setOpenDialog} />
			: <GroupsButtons setExtraContent={setExtraContent} setActiveChannel={setActiveChannel} setOpenDialog={setOpenDialog}/>
		}
		<Dialog open={openDialog} fullWidth maxWidth="sm" onClose={handleClose}>
			<ChatDialog setOpenDialog={setOpenDialog} setGroupsData={setGroupsData}/>
		</Dialog>
		</>
	)
} 

export default ChatAuxiliaryButton
