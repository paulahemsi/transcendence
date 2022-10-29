import { Button, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"

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

const InviteMember = () => {
	return (
		<Button
		variant="outlined"
		size="large"
		sx={buttonCss}>
			<Typography sx={buttonTypographyCss}>
				invite member
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

export const AdminControlPannel = () => {

	return (
		<Box display='flex' flexDirection='column' justifyContent='center' width='30vh' sx={{alignSelf: 'flex-start'}} >
			<InviteMember/>
			<LeaveChannel/>
			<KickMember/>
			<MuteMember/>
			<ChangePassword/>
		</Box>
	)
}

export default AdminControlPannel
