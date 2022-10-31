import { Button, Dialog, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React, { FunctionComponent, useState } from "react"
import AdminDialog, { AddMembersDialog } from "./AddMembersDialog"
import ChangePasswordDialog from "./ChangePasswordDialog"
import DeleteMembersDialog from "./DeleteMembersDialog"
import LeaveChannelDialog from "./LeaveChannelDialog"

type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>
type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
	setMembersMockData: objectSetState;
	channelData: {[key: string]: any};
	setActiveChannel : numberSetState;
}

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
const LEAVE = 'leave channel';
const KICK = 'kick member';
const CHANGE_PASSWORD = 'change password';

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

const LeaveChannel = ({ setOpenDialog } : { setOpenDialog: booleanSetState }) => {

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
				{LEAVE}
			</Typography>
		</Button>
	)
}

const KickMember = ({ setOpenDialog } : { setOpenDialog: booleanSetState }) => {
	
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
				{KICK}
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

const ChangePassword = ({ setOpenDialog } : { setOpenDialog: booleanSetState }) => {
	
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
				{CHANGE_PASSWORD}
			</Typography>
		</Button>
	)
}

export const AdminControlPannel: FunctionComponent<Props> = ({ setMembersMockData, channelData, setActiveChannel }) => {
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
	const [openPasswordDialog, setOpenPasswordDialog] = useState(false);

	const handleClose = () => {
		setOpenAddDialog(false);
	};
	
	return (
		<Box display='flex' flexDirection='column' justifyContent='center' width='30vh' sx={{alignSelf: 'flex-start'}} >
			<AddMember setOpenDialog={setOpenAddDialog} />
			<LeaveChannel setOpenDialog={setOpenLeaveDialog}/>
			<KickMember setOpenDialog={setOpenDeleteDialog}/>
			<MuteMember/>
			<ChangePassword setOpenDialog={setOpenPasswordDialog}/>
			<Dialog open={openAddDialog} fullWidth maxWidth="sm" onClose={handleClose}>
				<AddMembersDialog setOpenDialog={setOpenAddDialog} setMembersMockData={setMembersMockData} channelData={channelData} />
			</Dialog>
			<Dialog open={openDeleteDialog} fullWidth maxWidth="sm" onClose={handleClose}>
				<DeleteMembersDialog setOpenDialog={setOpenDeleteDialog} setMembersMockData={setMembersMockData} channelData={channelData} />
			</Dialog>
			<Dialog open={openLeaveDialog} fullWidth maxWidth="sm" onClose={handleClose}>
				<LeaveChannelDialog setOpenDialog={setOpenLeaveDialog} setMembersMockData={setMembersMockData} channelData={channelData} setActiveChannel={setActiveChannel}/>
			</Dialog>
			<Dialog open={openPasswordDialog} fullWidth maxWidth="sm" onClose={handleClose}>
				<ChangePasswordDialog setOpenDialog={setOpenPasswordDialog} channelData={channelData}/>
			</Dialog>
		</Box>
	)
}

export default AdminControlPannel
