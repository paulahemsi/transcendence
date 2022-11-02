import { Button, Dialog, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React, { FunctionComponent, useState } from "react"
import AddAdminDialog from "./AddAdminDialog"
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
	height: '7vh',
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

const buttonTypographyCss = (disabled: boolean) => {
	return {
		textTransform: 'lowercase',
		fontFamily: 'Orbitron',
		fontSize: '3vh',
		color: disabled ? '#979797' : '#311B92',
	}
}

const ADD_MEMBER = 'add member';
const ADD_ADMIN = 'add admin';
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
			<Typography sx={buttonTypographyCss(false)}>
				{ADD_MEMBER}
			</Typography>
		</Button>
	)
}

const AddAdmin = ({ setOpenDialog, isOwner } : { setOpenDialog: booleanSetState, isOwner: boolean }) => {
	
	const handleClick = () => {
		setOpenDialog(true);
	}
	
	return (
		<Button
			disabled={!isOwner}
			variant="outlined"
			size="large"
			sx={buttonCss}
			onClick={handleClick}
		>
			<Typography sx={buttonTypographyCss(!isOwner)}>
				{ADD_ADMIN}
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
			<Typography sx={buttonTypographyCss(false)}>
				{LEAVE}
			</Typography>
		</Button>
	)
}

const KickMember = ({ setOpenDialog, isAdmin } : { setOpenDialog: booleanSetState, isAdmin: boolean }) => {
	
	const handleClick = () => {
		setOpenDialog(true);
	}
	
	return (
		<Button 
			disabled={!isAdmin}
			variant="outlined"
			size="large"
			sx={buttonCss}
			onClick={handleClick}
		>
			<Typography sx={buttonTypographyCss(!isAdmin)}>
				{KICK}
			</Typography>
		</Button>
	)
}

const MuteMember = ({ setOpenDialog, isAdmin } : { setOpenDialog: booleanSetState, isAdmin: boolean }) => {
	return (
		<Button
		disabled={!isAdmin}
		variant="outlined"
		size="large"
		sx={buttonCss}>
			<Typography sx={buttonTypographyCss(!isAdmin)}>
				mute member
			</Typography>
		</Button>
	)
}

const ChangePassword = ({ setOpenDialog, isOwner } : { setOpenDialog: booleanSetState, isOwner: boolean }) => {
	
	const handleClick = () => {
		setOpenDialog(true);
	}
	
	return (
		<Button 
			disabled={!isOwner}
			variant="outlined"
			size="large"
			sx={buttonCss}
			onClick={handleClick}
		>
			<Typography sx={buttonTypographyCss(!isOwner)}>
				{CHANGE_PASSWORD}
			</Typography>
		</Button>
	)
}

export const AdminControlPannel: FunctionComponent<Props> = ({ setMembersMockData, channelData, setActiveChannel }) => {
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [openAddAdminDialog, setOpenAddAdminDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openMuteDialog, setOpenMuteDialog] = useState(false);
	const [openLeaveDialog, setOpenLeaveDialog] = useState(false);
	const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
	const [isOwner, setIsOwner] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	const handleClose = () => {
		setOpenAddDialog(false);
	};
	
	return (
		<Box display='flex' flexDirection='column' justifyContent='center' width='30vh' sx={{alignSelf: 'flex-start'}} >
			<AddMember setOpenDialog={setOpenAddDialog} />
			<AddAdmin setOpenDialog={setOpenAddAdminDialog} isOwner={isOwner} />
			<LeaveChannel setOpenDialog={setOpenLeaveDialog}/>
			<KickMember setOpenDialog={setOpenDeleteDialog} isAdmin={isAdmin}/>
			<MuteMember setOpenDialog={setOpenMuteDialog} isAdmin={isAdmin}/>
			<ChangePassword setOpenDialog={setOpenPasswordDialog} isOwner={isOwner}/>
			<Dialog open={openAddDialog} fullWidth maxWidth="sm" onClose={handleClose}>
				<AddMembersDialog setOpenDialog={setOpenAddDialog} setMembersMockData={setMembersMockData} channelData={channelData} />
			</Dialog>
			<Dialog open={openAddAdminDialog} fullWidth maxWidth="sm" onClose={handleClose}>
				<AddAdminDialog setOpenDialog={setOpenAddAdminDialog} setMembersMockData={setMembersMockData} channelData={channelData} />
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
