import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, Button, Divider, Typography } from "@mui/material";
import axios, { AxiosRequestHeaders } from "axios";
import ChannelMembers from "./ChannelMembers";
import AdminControlPannel from "./AdminControlPannel";
import { numberSetState, objectSetState } from "../../utils/constants";
import { chatSocket } from "../../context/socket";
import { maxHeight } from "@mui/system";

interface BodyProps {
	loading: boolean;
	channelData: {[key: string]: any};
	setMembersMockData: objectSetState;
	setActiveChannel : numberSetState;
}

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
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		maxWidth: '80vh'
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

const Body: FunctionComponent<BodyProps> = ({ loading, channelData, setMembersMockData, setActiveChannel }) => {
	return (
		<Box display='flex' alignItems='center' height='55vh' marginTop='3vh' >
			{
				!loading &&
				<ChannelMembers channelMembers={channelData.members}/>
			}
			<Divider flexItem orientation='vertical' variant='middle' sx={{ borderBottomWidth: 3, border: "2px solid #B998FF" }} />
			<AdminControlPannel setMembersMockData={setMembersMockData} channelData={channelData} setActiveChannel={setActiveChannel}/>
		</Box>
	)
}

export const ChannelsAdminPanel = ( { activeChannel, setActiveChannel } : { activeChannel : number, setActiveChannel: numberSetState }) => {

	const [ membersMockData, setMembersMockData ] = useState<{[key: string]: any}>({});
	const [ channelData, setChannelData ] = useState<{[key: string]: any}>({});
	const [ loading, setLoading ] = useState(true);

	chatSocket.off('refreshGroups').on('refreshGroups', () => {
		requestChannelInfos()
	});

	const requestChannelInfos = async () => {
		const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
		await axios.get(`${process.env.REACT_APP_BACK_HOST}/channels/${activeChannel}`, { headers: authToken }).then((response) => {
			setChannelData(response.data);
			setLoading(false);
		})
	}
	
	useEffect(() => {requestChannelInfos()}, [membersMockData]);
	
	return (
		<Box display="flex" flexDirection="column" justifyContent="space-around" bgcolor="blue" padding="3vh" sx={{minWidth: '30vw', height: '80vh',
			background: '#F5F5F5',
		}}>
			<Box sx={messagesBorderCSS}>
				<Header channelName={channelData.name} />
				<Body loading={loading} channelData={channelData} setMembersMockData={setMembersMockData} setActiveChannel={setActiveChannel}/>
			</Box>
		</Box>
	)
}

export default ChannelsAdminPanel
