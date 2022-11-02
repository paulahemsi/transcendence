import React, { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { Box, Dialog, IconButton, Tooltip, Zoom } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import { ProfileButton } from "./ProfileButton";
import { UpdateProfileDialog } from "./UpdateProfileDialog";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
}

const EditButton = ({ setOpenDialog } : { setOpenDialog : booleanSetState }) => {
	const handleOpenDialog = () => setOpenDialog(true)
	
	return (
		<Tooltip title='edit profile' placement='right' arrow TransitionComponent={Zoom}>
			<IconButton sx={{ alignSelf: 'center'}} onClick={handleOpenDialog}>
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
	const [openDialog, setOpenDialog] = useState(false);
	const [userData, setUserData] = useState<{[key: string]: any}>({});

	useEffect(() => {requestUserData({setUserData})}, []);

	const handleClose = () => {
		setOpenDialog(false);
	};

	return(
		<Box display='flex' flexDirection='row' alignItems="center">
			<ProfileButton setOpenCard={setOpenCard} userData={userData} />
			<EditButton setOpenDialog={setOpenDialog} />
			<Dialog open={openDialog} fullWidth maxWidth="sm" onClose={handleClose}>
				<UpdateProfileDialog setOpen={setOpenDialog} userData={userData} setUserData={setUserData}/>
			</Dialog>
		</Box>
	)
}

export default ProfileInfo
