import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import axios, { AxiosRequestHeaders } from "axios";

const messagesBorderCSS = {
	minWidth: '50vw',
	height: '80vh',
	background: '#F5F5F5',
	border: 4,
	borderColor: '#212980',
	borderRadius: 3,
	boxShadow: 5
}


export const ChannelsAdminPanel = ( { activeChannel } : { activeChannel : number }) => {

	const [ channelData, setChannelData ] = useState({});
	
	const requestChannelInfos = async () => {
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		await axios.get(`http://localhost:4444/channels/${activeChannel}`, { headers: authToken }).then((response) => {
			setChannelData(response.data);
		})
	}
	
	useEffect(() => {requestChannelInfos()}, []);
	
	return (
		<Box display="flex" flexDirection="column" justifyContent="space-between" bgcolor="blue" padding="3vh" sx={{minWidth: '50vw', height: '80vh',
		background: '#F5F5F5',
		}}>
		<Box sx={messagesBorderCSS}>
			
		</Box>
	</Box>
	)
}

export default ChannelsAdminPanel
