import React, { useState, FunctionComponent } from "react"
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, TextField } from "@mui/material"

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
				// value={username}
				// onKeyDown={keyDownHandler}
				// onChange={handleChange}
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
				// value={username}
				// onKeyDown={keyDownHandler}
				// onChange={handleChange}
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
			//onClick={handleSave}
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
