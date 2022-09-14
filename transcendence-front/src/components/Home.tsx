import React, { useEffect, useState } from "react";
import { Typography, Box, Drawer, List, ListItem } from '@mui/material';
import axios from 'axios';
import jwt from 'jwt-decode';
import Header from "./header/Header";
import { Footer } from "./footer/Footer";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

type tokenData = {
	id: string;
}

const requestUserData = async ({ setUserData } : { setUserData: React.Dispatch<React.SetStateAction<{[key: string]: any}>>}) => {
	const tokenData: tokenData = jwt(document.cookie);
	await axios.get('http://localhost:3000/users/' + tokenData.id).then((response) => {setUserData({
		id: response.data.id,
		username: response.data.username,
		rating: response.data.rating,
		email: response.data.email,
		status: response.data.status,
		image_url: response.data.image_url,
		external_id: response.data.external_id
})})
}

const Background = () => {
	return (
		<Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{backgroundColor: '#311B92'}}>
			<Typography sx={{ fontSize: '14vh', fontFamily: 'Orbitron', fontWeight: 500, color: '#FFFFFF', textShadow: '0px 0px 6px #FFFFFF'}}>
						ft_transcendence
			</Typography>
		</Box>
	);
}

const FriendsDrawer = () => {
	return (
		<>
		  <Drawer open={true} anchor="right">
			VARIAS COISAS DENTRO DO DRAWER
			<List>
				<ListItem>AMIGO UM</ListItem>
				<ListItem>AMIGO DOIS</ListItem>
				<ListItem>AMIGO TRES</ListItem>
			</List>
				
		  </Drawer>
		</>
	  )
}

export const Home = ({ setLoggedIn } : { setLoggedIn: booleanSetState}) => {

	const [userData, setUserData] = useState<{[key: string]: any}>({});

	useEffect(() => {requestUserData({setUserData})}, []);	
		return (
			<>
				<Header userData={userData} />
				<FriendsDrawer />
				<Background />
				<Footer setLoggedIn={setLoggedIn}/>
			</>
		);
}

export default Home
