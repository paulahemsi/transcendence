import React, { useEffect, useState } from "react";
import { Typography, Box } from '@mui/material';
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import Header from "./header/Header";
import { Footer } from "./footer/Footer";
import FriendsDrawer from "./friendsDrawer/FriendsDrawer";
import ProfileCard from "./profileCard/ProfileCard";

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

const requestFriendsData = async ({ setFriendsData } : { setFriendsData: React.Dispatch<React.SetStateAction<{[key: string]: any}>>}) => {

	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	
	await axios.get(`http://localhost:3000/users/${tokenData.id}/friends`, { headers: authToken }).then((response) => {
		setFriendsData(response.data);
})
}

const Background = () => {
	return (
		<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{backgroundImage: 'linear-gradient(to right, #212980 , #6f0162)'}}>
			<Typography sx={{ fontSize: '14vh', fontFamily: 'Orbitron', fontWeight: 500, color: '#FFFFFF', textShadow: '0px 0px 6px #FFFFFF'}}>
						ft_transcendence
			</Typography>
		</Box>
	);
}

export const Home = ({ setLoggedIn } : { setLoggedIn: booleanSetState}) => {
	
	const [userData, setUserData] = useState<{[key: string]: any}>({});
	const [openDrawer, setOpenDrawer] = useState(false)
	const [openCard, setOpenCard] = useState(false)
	const [friendsData, setFriendsData] = useState<{[key: string]: any}>({});

	useEffect(() => {requestUserData({setUserData})}, []);
	useEffect(() => {requestFriendsData({setFriendsData})}, []);
		return (
			<>
				<Header userData={userData} setOpenDrawer={setOpenDrawer} setOpenCard={setOpenCard} numberOfFriends={friendsData.length}/>
				{ openCard && <ProfileCard setOpenCard={setOpenCard} userData={userData}/> }
				{ openDrawer && <FriendsDrawer friendsData={friendsData} setOpenDrawer={setOpenDrawer} />}
				<Background />
				<Footer setLoggedIn={setLoggedIn}/>
			</>
		);
}

export default Home
