import React, { useEffect, useState } from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import axios, { AxiosRequestHeaders } from "axios";
import ChannelMembers from "./ChannelMembers";
import AdminControlPannel from "./AdminControlPannel";

const MEMBERS = 'members';

const messagesBorderCSS = {
	minWidth: '50vw',
	height: '80vh',
	background: '#F5F5F5',
	border: 4,
	borderColor: '#212980',
	borderRadius: 3,
	boxShadow: 5
}

const typographyCSS = (fontSize: number) => {
	return {
		color: '#212980',
		fontFamily: 'Orbitron',
		fontWeight: 600,
		fontSize: `${fontSize}vh`,
		paddingLeft: '1.7vh',
		whiteSpace: 'pre-wrap', overflowWrap: 'break-word', width: '24vw'
	}
}

const Header = ({ channelName } : { channelName : string }) => {
	return (
		<>
			<Typography sx={typographyCSS(6)} >
				{channelName}
			</Typography>
			<Divider variant='middle' sx={{ borderBottomWidth: 3, margin: 2, border: "2px solid #B998FF", marginBottom: '2vh' }} />
			<Typography sx={typographyCSS(4)} >
				{MEMBERS}
			</Typography>
		</>
	)
}

const Body = ({ loading, channelMembers } : { loading: boolean, channelMembers: {[key: string]: any}}) => {
	return (
		<Box display='flex' alignItems='center' height='55vh' marginTop='3vh' >
			{
				!loading &&
				<ChannelMembers channelMembers={channelMembers}/>
			}
			<Divider flexItem orientation='vertical' variant='middle' sx={{ borderBottomWidth: 3, border: "2px solid #B998FF" }} />
			<AdminControlPannel/>
		</Box>
	)
}

export const ChannelsAdminPanel = ( { activeChannel } : { activeChannel : number }) => {

	const [ channelData, setChannelData ] = useState<{[key: string]: any}>({});
	const [ loading, setLoading ] = useState(true);

	const requestChannelInfos = async () => {
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		await axios.get(`http://localhost:4444/channels/${activeChannel}`, { headers: authToken }).then((response) => {
			setChannelData(response.data);
			setLoading(false);
		})
	}
	
	useEffect(() => {requestChannelInfos()}, [activeChannel]);
	
	return (
		<Box display="flex" flexDirection="column" justifyContent="space-around" bgcolor="blue" padding="3vh" sx={{minWidth: '30vw', height: '80vh',
			background: '#F5F5F5',
		}}>
			<Box sx={messagesBorderCSS}>
				<Header channelName={channelData.name} />
				<Body loading={loading} channelMembers={channelData.members} />
			</Box>
		</Box>
	)
}

export default ChannelsAdminPanel
