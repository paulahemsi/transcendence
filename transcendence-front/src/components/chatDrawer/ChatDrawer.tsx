import React, { FunctionComponent, useState, useEffect } from "react";
import { Drawer } from '@mui/material';
import ChatButton from "./ChatButton";
import FriendsList from "./FriendsList";
import GroupsList from "./GroupsList";
import ChatAuxiliaryButton from "./ChatAuxiliaryButton";
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';

type tokenData = {
	id: string;
}

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    friendsData: {[key: string]: any};
    setOpenDrawer: booleanSetState;
}

const requestGroupsData = async ({ setGroupsData } : { setGroupsData: React.Dispatch<React.SetStateAction<{[key: string]: any}>>}) => {

	const tokenData: tokenData = jwt(document.cookie);
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	
	await axios.get(`http://localhost:3000/users/${tokenData.id}/channels`, { headers: authToken }).then((response) => {
		setGroupsData(response.data);
})
}

export const ChatDrawer : FunctionComponent<Props> = ({ friendsData, setOpenDrawer }) => {
	const [direct, setDirect] = useState(true);
	const [groupsData, setGroupsData] = useState<{[key: string]: any}>({});
	
	useEffect(() => {requestGroupsData({setGroupsData})}, []);

	return (
		<>
		  <Drawer open={true} transitionDuration={500} onClose={() => setOpenDrawer(false)} anchor="right" >
			<ChatButton direct={direct} setDirect={setDirect}/>
			<ChatAuxiliaryButton direct={direct}/>
			{
				direct
				? <FriendsList friendsData={friendsData} />
				: <GroupsList groupsData={groupsData} />
			}
		  </Drawer>
		</>
	  )
}

export default ChatDrawer
