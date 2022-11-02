import React, { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { Box, Dialog, IconButton, Menu, MenuItem, Tooltip, Typography, Zoom } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import { ProfileButton } from "./ProfileButton";
import { UpdateProfileDialog } from "../profile-edit/UpdateProfileDialog";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type anchorElSetState = React.Dispatch<React.SetStateAction<null | HTMLElement>>

type tokenData = {
	id: string;
}


const aaa = {
	color: '#1E1E1E',
	fontFamily: 'Orbitron',
	fontWeight: 600,
	fontSize: '2vh',
}

const EditMenu = ({ setAnchorEl, anchorEl, openEditMenu, setOpenUsernameDialog } : {
		setAnchorEl: anchorElSetState,
		anchorEl: null | HTMLElement ,
		openEditMenu: boolean,
		setOpenUsernameDialog: booleanSetState }) => {

	const handleClose = () => {
	  setAnchorEl(null);
	};

	const editUsername = () => {
	  setAnchorEl(null);
	  setOpenUsernameDialog(true);
	};

	return (
		<Menu 
			id="basic-menu"
			anchorEl={anchorEl}
			open={openEditMenu}
			onClose={handleClose}
			MenuListProps={{
				'aria-labelledby': 'basic-button',
			}}
		>
			<MenuItem onClick={editUsername}>
				<Typography sx={aaa}>
					username
				</Typography>
			</MenuItem>
			<MenuItem onClick={handleClose}>
				<Typography sx={aaa}>
					image
				</Typography>
			</MenuItem>
			<MenuItem onClick={handleClose}>
				<Typography sx={aaa}>
					two-factor authentication
				</Typography>
			</MenuItem>
		</Menu>
	)
}


const EditButton = ({ setAnchorEl, openEditMenu } : { setAnchorEl: anchorElSetState, openEditMenu: boolean }) => {
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<Tooltip title='edit profile' placement='right' arrow TransitionComponent={Zoom}>
			<IconButton 
				sx={{ alignSelf: 'center'}}
				id="basic-button"
				aria-controls={openEditMenu ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={openEditMenu ? 'true' : undefined}
				onClick={handleClick}
			>
				<EditIcon sx={{ color: '#311B92' }}/>
			</IconButton>
		</Tooltip>
	)
}

const requestUserData = async ({ setUserData } : { setUserData: React.Dispatch<React.SetStateAction<{[key: string]: any}>>}) => {
	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	await axios.get('http://localhost:3000/users/' + tokenData.id, { headers: authToken }).then((response) => {setUserData({
		id: response.data.id,
		username: response.data.username,
		rating: response.data.rating,
		email: response.data.email,
		status: response.data.status,
		image_url: response.data.image_url,
		external_id: response.data.external_id
})})
}

export const ProfileInfo = ({ setOpenCard } : { setOpenCard : booleanSetState }) => {
	const [userData, setUserData] = useState<{[key: string]: any}>({});
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const openEditMenu = Boolean(anchorEl);
	const [openUsernameDialog, setOpenUsernameDialog] = useState(false);

	useEffect(() => {requestUserData({setUserData})}, []);

	return(
		<Box display='flex' flexDirection='row' alignItems="center">
			<ProfileButton setOpenCard={setOpenCard} userData={userData} />
			<EditButton setAnchorEl={setAnchorEl} openEditMenu={openEditMenu} />
			<EditMenu
				setAnchorEl={setAnchorEl}
				anchorEl={anchorEl}
				openEditMenu={openEditMenu}
				setOpenUsernameDialog={setOpenUsernameDialog}
			/>
			<UpdateProfileDialog
				open={openUsernameDialog}
				setOpen={setOpenUsernameDialog}
				userData={userData}
				setUserData={setUserData}
			/>
		</Box>
	)
}

export default ProfileInfo
