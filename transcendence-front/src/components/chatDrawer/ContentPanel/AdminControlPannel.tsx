import { Button, Dialog, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React, { useState } from "react"
import AdminDialog, { AddMembersDialog } from "./AddMembersDialog"

type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>
type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

const buttonCss = {
	margin: '1vh',
	marginLeft: '10vh',
	width: '18vw',
	height: '8vh',
	background: '#F5F5F5',
	borderRadius: 5,
	border: '3px solid',
	borderColor: '#B998FF',
	boxShadow: 7,
	':hover': { 
		background: '#B998FF',
		borderColor: '#B998FF'
	}
}

const buttonTypographyCss = {
	textTransform: 'lowercase',
	fontFamily: 'Orbitron',
	fontSize: '3vh',
	color: '#311B92',
}

const ADD_MEMBER = 'add member';

const AddMember = ({ setOpenDialog } : { setOpenDialog: booleanSetState }) => {
	
	const handleClick = () => {
		setOpenDialog(true);
	}
	
	return (
		<Button
			variant="outlined"
			size="large"
			sx={buttonCss}
			onClick={handleClick}
		>
			<Typography sx={buttonTypographyCss}>
				{ADD_MEMBER}
			</Typography>
		</Button>
	)
}

const LeaveChannel = () => {
	return (
		<Button 
		variant="outlined"
		size="large"
		sx={buttonCss}>
			<Typography sx={buttonTypographyCss}>
				leave channel
			</Typography>
		</Button>
	)
}

const KickMember = () => {
	return (
		<Button 
		variant="outlined"
		size="large"
		sx={buttonCss}>
			<Typography sx={buttonTypographyCss}>
				kick member
			</Typography>
		</Button>
	)
}

const MuteMember = () => {
	return (
		<Button 
		variant="outlined"
		size="large"
		sx={buttonCss}>
			<Typography sx={buttonTypographyCss}>
				mute member
			</Typography>
		</Button>
	)
}

const ChangePassword = () => {
	return (
		<Button 
		variant="outlined"
		size="large"
		sx={buttonCss}>
			<Typography sx={buttonTypographyCss}>
				change password
			</Typography>
		</Button>
	)
}

export const AdminControlPannel = ({ setMembersMockData, channelData } : { setMembersMockData: objectSetState, channelData: {[key: string]: any}}) => {
	const [openDialog, setOpenDialog] = useState(false);

	const handleClose = () => {
		setOpenDialog(false);
	};
	
	return (
		<Box display='flex' flexDirection='column' justifyContent='center' width='30vh' sx={{alignSelf: 'flex-start'}} >
			<AddMember setOpenDialog={setOpenDialog} />
			<LeaveChannel/>
			<KickMember/>
			<MuteMember/>
			<ChangePassword/>
			<Dialog open={openDialog} fullWidth maxWidth="sm" onClose={handleClose}>
				<AddMembersDialog setOpenDialog={setOpenDialog} setMembersMockData={setMembersMockData} channelData={channelData} />
			</Dialog>
		</Box>
	)
}

export default AdminControlPannel