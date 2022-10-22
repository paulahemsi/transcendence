import React, { FunctionComponent, useState, useEffect } from "react";
import { Drawer, Box } from '@mui/material';
import axios, { AxiosRequestHeaders } from 'axios';
import jwt from 'jwt-decode';
import ExtraContent from "./ContentPanel/ExtraContent";
import ControlPanel from "./ControlPanel/ControlPanel";

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
		console.log(response.data)
		setGroupsData(response.data);
})
}

export const ChatDrawer : FunctionComponent<Props> = ({ friendsData, setOpenDrawer }) => {
	const [groupsData, setGroupsData] = useState<{[key: string]: any}>({});
	const [extraContent, setExtraContent] = useState(false);
	const [activeChannel, setActiveChannel] = useState(0)

	useEffect(() => {requestGroupsData({setGroupsData})}, []); //!algo errado com carregar essas infos

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
						<ExtraContent activeChannel={activeChannel} />
					}
				</Box>
				<ControlPanel 
					setExtraContent={setExtraContent}
					setActiveChannel={setActiveChannel}
					friendsData={friendsData}
					activeChannel={activeChannel}
					groupsData={groupsData}
					setGroupsData={setGroupsData}
				/>
			</Box>
		  </Drawer>
		</>
	  )
}

export default ChatDrawer
