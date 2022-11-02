import React, { useEffect, useState } from "react";
import { Box } from "@mui/material"
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import { ProfileButton } from "./ProfileButton";
import { UpdateProfileDialog } from "../profile-edit/UpdateProfileDialog";
import EditProfile from "../profile-edit/EditButton";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
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
	const [openUsernameDialog, setOpenUsernameDialog] = useState(false);

	useEffect(() => {requestUserData({setUserData})}, []);

	return(
		<Box display='flex' flexDirection='row' alignItems="center">
			<ProfileButton setOpenCard={setOpenCard} userData={userData} />
			<EditProfile setOpenUsernameDialog={setOpenUsernameDialog}/>
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
