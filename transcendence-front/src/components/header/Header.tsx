import React, { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import { AppBar, Stack } from "@mui/material"
import ProfileInfo from "./ProfileInfo";
import FriendshipInfo from "./FriendshipInfo";
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
}

interface Props {
    setOpenDrawer: booleanSetState;
    setOpenCard: booleanSetState;
	numberOfFriends: number;
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

export const Header : FunctionComponent<Props> = ({ setOpenDrawer, setOpenCard, numberOfFriends }) => {
	const [userData, setUserData] = useState<{[key: string]: any}>({});

	useEffect(() => {requestUserData({setUserData})}, []);
	return (
	<AppBar sx={{ height: '7vh', background: '#F5F5F5', position: 'fixed'}}>
		<Stack display='flex' flexDirection='row' alignItems="center" justifyContent="space-between" sx={{ paddingTop: '0.5vh', paddingLeft: '1.5vh', paddingBottom: '2vh' }}>
			<ProfileInfo setOpenCard={setOpenCard} userData={userData}/>
			<FriendshipInfo setOpenDrawer={setOpenDrawer} numberOfFriends={numberOfFriends} />
		</Stack>
	</AppBar>
	)
}

export default Header
