import React, { useEffect, useState } from "react";
import { Box, Button, List, ListItem, Typography } from "@mui/material";
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';

type tokenData = {
	id: string;
}

const notPart = "you are not part of any group chats :("
const joinOne =	"start or join one!"

const onHoverGroup = {
	'&:hover': {
		backgroundColor: '#B998FF',
	},
	width: '100%',
	textTransform: 'lowercase',
	borderRadius: '0'
}

const requestGroupsData = async ({ setGroupsData } : { setGroupsData: React.Dispatch<React.SetStateAction<Array<string>>>}) => {

	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	
	await axios.get(`http://localhost:3000/users/${tokenData.id}/channels`, { headers: authToken }).then((response) => {
		setGroupsData(response.data);
})
}

const NoGroups = () => {
	return (
		<Box display="flex" alignItems="center" flexDirection="column" flexWrap="wrap" justifyContent="center" sx={{width: '100%', height: '100%'}}>
			<Typography sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', padding: '1.7vh'}}>
						{notPart}
			</Typography>
			<Typography sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', padding: '1.7vh'}}>
						{joinOne}
			</Typography>
		</Box>
	)
}

export const GroupsList = () => {
	const [groupsData, setGroupsData] = useState<Array<string>>([]);
	
	useEffect(() => {requestGroupsData({setGroupsData})}, []);
	
	const groups = [] as JSX.Element[];
	groupsData.forEach((value: string, index: number, array: string[]) => {
		groups.push(
		<ListItem disablePadding key={index} sx={{marginBottom: '1vh'}}> 
			<Button sx={onHoverGroup} onClick={() => console.log("click")}>
			<Box display='flex' width='100%' flexDirection='row' alignItems="center" alignSelf="flex-start">
				<Typography sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
					{value}
				</Typography>
				</Box>
			</Button>
		</ListItem>);
	})

	return (
		<>
			{
				groupsData[0]
				? <List disablePadding>
					{groups}
				</List>
				: <NoGroups/>
			}
		</>
	)
}

export default GroupsList
