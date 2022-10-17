import React, { useState, FunctionComponent } from "react"
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, TextField } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import { type } from "@testing-library/user-event/dist/type";

type tokenData = {
	id: string;
}

const PUBLIC = "PUBLIC";
const PRIVATE = "PRIVATE";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
	direct: boolean;
	setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
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
		background: '#B998FF',
		color: '#FFFFFF',
		':hover': { background: '#212980'},
		fontFamily: 'Orbitron',
		fontSize: '3vh',
		paddingLeft: '4vh',
		paddingRight: '4vh',
		width: width,
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

const ChatDialog = ({ setOpenDialog } : { setOpenDialog : booleanSetState }) => {
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
		console.log(`save channelName: ${channelName} password: ${password}`);
		
		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};

		axios.post(`http://localhost:3000/channels`, {
			"name": channelName,
			"type": type,
			"owner": tokenData.id,
			"password": password,
		}, { headers: authToken }).then( () => {
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

     		 <FormControlLabel control={<Checkbox defaultChecked />} label="Private" />
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

export const ChatAuxiliaryButton: FunctionComponent<Props> = ({ direct, setExtraContent, setActiveChannel }) => {
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
			<ChatDialog setOpenDialog={setOpenDialog} />
		</Dialog>
		</>
	)
} 

export default ChatAuxiliaryButton
