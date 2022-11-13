import React, { FunctionComponent, useState, useEffect } from "react";
import { Drawer, Box } from '@mui/material';
import ChatMessages from "./ContentPanel/chatMessages/ChatMessages";
import ControlPanel from "./ControlPanel/ControlPanel";
import ChannelsAdminPanel from "./ContentPanel/ChannelsAdminPanel";
import axios, { AxiosRequestHeaders } from "axios";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

interface Props {
    friendsData: {[key: string]: any};
    setOpenDrawer: booleanSetState;
	setFriendsData: objectSetState;
}

export const ChatDrawer : FunctionComponent<Props> = ({ friendsData, setOpenDrawer, setFriendsData }) => {
	const [extraContent, setExtraContent] = useState(false);
	const [channelsAdminPanel, setChannelsAdminPanel] = useState(false);
	const [activeChannel, setActiveChannel] = useState(-1)
	const [isDM, setIsDM] = useState(false);

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
						<ChatMessages activeChannel={activeChannel} isDM={isDM} friendId={getFriendId()}/>
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
