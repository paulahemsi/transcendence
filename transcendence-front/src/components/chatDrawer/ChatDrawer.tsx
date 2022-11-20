import React, { FunctionComponent, useState, useEffect } from "react";
import { Drawer, Box } from '@mui/material';
import ChatMessages from "./ContentPanel/chatMessages/ChatMessages";
import ControlPanel from "./ControlPanel/ControlPanel";
import ChannelsAdminPanel from "./ContentPanel/ChannelsAdminPanel";
import axios, { AxiosRequestHeaders } from "axios";
import { chatSocket } from "../context/socket";
import { booleanSetState, getAuthToken, getIdFromToken, stringSetState } from "../utils/constants";

interface Props {
    setOpenDrawer: booleanSetState;
	setIsHost: booleanSetState;
	setGameActive: booleanSetState;
	setMatchRoom: stringSetState;
}

const requestFriendsData = async ({ setFriendsData } : { setFriendsData: React.Dispatch<React.SetStateAction<{[key: string]: any}>>}) => {
	const userId = getIdFromToken();
	const authToken = getAuthToken();
	await axios.get(`http://localhost:3000/users/${userId}/friends`, { headers: authToken }).then((response) => {
		setFriendsData(response.data);
})
}

export const ChatDrawer : FunctionComponent<Props> = ({ setOpenDrawer, setIsHost, setGameActive, setMatchRoom }) => {
	const [friendsData, setFriendsData] = useState<{[key: string]: any}>({});
	const [extraContent, setExtraContent] = useState(false);
	const [channelsAdminPanel, setChannelsAdminPanel] = useState(false);
	const [activeChannel, setActiveChannel] = useState(-1)
	const [isDM, setIsDM] = useState(false);

	useEffect(() => {requestFriendsData({setFriendsData})}, []);

	chatSocket.off('refreshFriends').on('refreshFriends', () => {
		requestFriendsData({setFriendsData})
	});

	  const requestChannelInfos = async () => {
		if (activeChannel <= 0) {
			return ;
		}
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		await axios.get(`http://localhost:4444/channels/${activeChannel}`, { headers: authToken }).then((response) => {
			if (response.data.name === "directMessage") {
				setIsDM(true);
			} else {
				setIsDM(false);
			}
		})
	}

	if (activeChannel === 0) {
		setOpenDrawer(false);
	}
	
	const getFriendId = () => {
		if (!isDM) {
			return ;
		}
		const friend = friendsData.find((element: {[key: string]: any}) => element.channel == activeChannel);
		if (friend) {
			return friend.id;
		}
	}
	
	useEffect(() => {requestChannelInfos()}, [activeChannel]);
	
	return (
		<>
		  <Drawer
		  	open={true}
			transitionDuration={500}
			onClose={() => setOpenDrawer(false)}
			anchor="right"
			PaperProps={{
			sx: { opacity: 0.95, backgroundColor: "#F5F5F5" }
  			}} 
		>
			<Box paddingTop='7vh' display="flex" sx={{ minWidth: '30vw' }}>
				<Box>
					{
						extraContent &&
						<ChatMessages
							activeChannel={activeChannel}
							isDM={isDM}
							friendId={getFriendId()}
							setIsHost={setIsHost}
							setGameActive={setGameActive}
							setMatchRoom={setMatchRoom}
						/>
					}
					{
						channelsAdminPanel && (activeChannel > 0) && !isDM && 
						<ChannelsAdminPanel
							activeChannel={activeChannel}
							setActiveChannel={setActiveChannel}
						/>
					}
				</Box>
				<ControlPanel 
					setExtraContent={setExtraContent}
					setChannelsAdminPanel={setChannelsAdminPanel}
					setActiveChannel={setActiveChannel}
					friendsData={friendsData}
					activeChannel={activeChannel}
					setFriendsData={setFriendsData}
				/>
			</Box>
		  </Drawer>
		</>
	  )
}

export default ChatDrawer
