import { Box } from "@mui/material";
import React, { FunctionComponent, useEffect, useState } from "react";
import ChannelsList from "./ChannelsList";
import ChatAuxiliaryButton from "./ChatAuxiliaryButton";
import ChatButton from "./ChatButton";
import axios from 'axios';
import { booleanSetState, getAuthToken, getIdFromToken, numberSetState, objectSetState } from "../../utils/constants";

interface Props {
	setChannelsAdminPanel: booleanSetState;
    setExtraContent: booleanSetState;
	setActiveChannel: numberSetState;
	friendsData: {[key: string]: any};
	activeChannel: number,
	setFriendsData: objectSetState;
}

export const ControlPanel : FunctionComponent<Props> = ({ setChannelsAdminPanel, setExtraContent, setActiveChannel, friendsData, activeChannel, setFriendsData }) => {

	const [direct, setDirect] = useState(true);
	const [groupsData, setGroupsData] = useState<{[key: string]: any}>({});
	const [loading, setLoading] = useState(true);

	const requestGroupsData = async () => {

		const userId = getIdFromToken();
		const authToken = getAuthToken();
		await axios.get(`http://localhost:3000/users/${userId}/channels`, { headers: authToken }).then((response) => {
			setGroupsData(response.data);
			setLoading(false);
		}).catch( () => {});
	}
	
	useEffect(() => {requestGroupsData()}, []);

	return (
		<Box boxShadow="20px 20px 50px grey" height="86vh">
			<ChatButton
				direct={direct}
				setDirect={setDirect}
				setExtraContent={setExtraContent}
				setActiveChannel={setActiveChannel}
				setChannelsAdminPanel={setChannelsAdminPanel}
			/>
			<ChatAuxiliaryButton
				direct={direct}
				setExtraContent={setExtraContent}
				setChannelsAdminPanel={setChannelsAdminPanel}
				setActiveChannel={setActiveChannel}
				setGroupsData={setGroupsData}
				groupsData={groupsData}
				friendsData={friendsData}
				setFriendsData={setFriendsData}
			/>
			<ChannelsList
				direct={direct}
				setExtraContent={setExtraContent}
				setChannelsAdminPanel={setChannelsAdminPanel}
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
