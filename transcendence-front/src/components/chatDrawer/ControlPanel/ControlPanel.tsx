import { Box } from "@mui/material";
import React, { FunctionComponent, useEffect, useState } from "react";
import ChannelsList from "./ChannelsList";
import ChatAuxiliaryButton from "./ChatAuxiliaryButton";
import ChatButton from "./ChatButton";
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';

type tokenData = {
	id: string;
}

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

interface Props {
    setExtraContent: booleanSetState;
	setActiveChannel: numberSetState;
	friendsData: {[key: string]: any};
	activeChannel: number,
	setFriendsData: objectSetState;
}

export const ControlPanel : FunctionComponent<Props> = ({  setExtraContent, setActiveChannel, friendsData, activeChannel, setFriendsData }) => {

	const [direct, setDirect] = useState(true);
	const [groupsData, setGroupsData] = useState<{[key: string]: any}>({});
	const [loading, setLoading] = useState(true);

	const requestGroupsData = async () => {

		const tokenData: tokenData = jwt(document.cookie);
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		
		await axios.get(`http://localhost:3000/users/${tokenData.id}/channels`, { headers: authToken }).then((response) => {
			setGroupsData(response.data);
			setLoading(false);
	})
	}
	
	useEffect(() => {requestGroupsData()}, []);

	return (
		<Box boxShadow="20px 20px 50px grey" height="86vh">
			<ChatButton
				direct={direct}
				setDirect={setDirect}
				setExtraContent={setExtraContent}
				setActiveChannel={setActiveChannel}
			/>
			<ChatAuxiliaryButton
				direct={direct}
				setExtraContent={setExtraContent}
				setActiveChannel={setActiveChannel}
				setGroupsData={setGroupsData}
				groupsData={groupsData}
				friendsData={friendsData}
				setFriendsData={setFriendsData}
			/>
			<ChannelsList
				direct={direct}
				setExtraContent={setExtraContent}
				activeChannel={activeChannel}
				setActiveChannel={setActiveChannel} 
				friendsData={friendsData}
				groupsData={groupsData}
				loading={loading}
			/>
		</Box>
	)
}

export default ControlPanel
