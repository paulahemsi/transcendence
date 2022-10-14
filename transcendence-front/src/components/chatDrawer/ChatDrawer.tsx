import React, { FunctionComponent, useState, useEffect } from "react";
import { Drawer, Box } from '@mui/material';
import ChatButton from "./ChatButton";
import FriendsList from "./FriendsList";
import GroupsList from "./GroupsList";
import ChatAuxiliaryButton from "./ChatAuxiliaryButton";
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import ExtraContent from "./ExtraContent";

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
	const [extraContent, setExtraContent] = useState(false);
	
	useEffect(() => {requestGroupsData({setGroupsData})}, []);

	return (
		<>
		  <Drawer open={true} transitionDuration={500} onClose={() => setOpenDrawer(false)} anchor="right" PaperProps={{
			sx: { opacity: 0.95, backgroundColor: "#F5F5F5" }
  			}} >
			<Box paddingTop='7vh' display="flex" sx={{ minWidth: '30vw' }}>
				<Box>
					{
						extraContent &&
						<ExtraContent/>
					}
				</Box>
				<Box boxShadow="20px 20px 50px grey" height="86vh">
					<ChatButton direct={direct} setDirect={setDirect}setExtraContent={setExtraContent}/>
					<ChatAuxiliaryButton direct={direct} setExtraContent={setExtraContent}/>
					{
						direct
						? <FriendsList friendsData={friendsData} setExtraContent={setExtraContent}/>
						: <GroupsList setExtraContent={setExtraContent} groupsData={groupsData} />
					}
				</Box>
			</Box>
		  </Drawer>
		</>
	  )
}

export default ChatDrawer
