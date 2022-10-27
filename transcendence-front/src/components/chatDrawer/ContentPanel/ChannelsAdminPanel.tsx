import React, { useEffect, useState } from "react";
import { Box, Button, Divider, List, ListItem, Typography } from "@mui/material";
import axios, { AxiosRequestHeaders } from "axios";
import MembersInfo from "./MembersInfo";

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

const onHoverFriend = {
	'&:hover': {
		color: '#B998FF',
	},
	textTransform: 'lowercase',
	borderRadius: '0'
}

const listCss = { 
	height: '55vh',
	position: 'relative',
	margin: 0,
	padding: 0,
	alignSelf: 'flex-start',
	overflow: 'auto',
	overflowY: 'auto',
	'&::-webkit-scrollbar': {
	width: '0.4em',
	borderRadius: 5,
	},
	listStyle: "none",
	'&::-webkit-scrollbar-track': {
		boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
		webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
		borderRadius: 5,
	},

}

const ChannelMembers = ({ channelMembers } : { channelMembers: {[key: string]: any} }) => {

	const members = [] as JSX.Element[];
	channelMembers.forEach((element : {[key: string]: any}) => {
		members.push(
	<ListItem disablePadding key={element.id} sx={{ padding: '1vh', marginRight: '10vh' }} > 
			<Button sx={onHoverFriend} onClick={() => console.log('click')} >
				<MembersInfo userData={element}/>
			</Button>
		</ListItem>);
	})
	
	return (
	<List 
		disablePadding 
		sx=	{listCss}
	>
		{members}
	</List>
	)
}

const buttonCss = {
	margin: '1vh',
	marginLeft: '10vh',
	width: '18vw',
	height: '8vh',
	background: '#F5F5F5',
	borderRadius: 5,
	border: '3px solid',
	borderColor: '#B998FF',
	boxShadow: 7,
	':hover': { 
		background: '#B998FF',
		borderColor: '#B998FF'
	}
}

const buttonTypographyCss = {
	textTransform: 'lowercase',
	fontFamily: 'Orbitron',
	fontSize: '3vh',
	color: '#311B92',
}


const ChannelControlPannel = () => {

	return (
		<Box display='flex' flexDirection='column' justifyContent='center' width='30vh' sx={{alignSelf: 'flex-start'}} >
			<Button 
			variant="outlined"
			size="large"
			sx={buttonCss}>
				<Typography sx={buttonTypographyCss}>
					invite member
				</Typography>
			</Button>
			
			<Button 
			variant="outlined"
			size="large"
			sx={buttonCss}>
				<Typography sx={buttonTypographyCss}>
					leave channel
				</Typography>
			</Button>
			
			<Button 
			variant="outlined"
			size="large"
			sx={buttonCss}>
				<Typography sx={buttonTypographyCss}>
					kick member
				</Typography>
			</Button>
			
			<Button 
			variant="outlined"
			size="large"
			sx={buttonCss}>
				<Typography sx={buttonTypographyCss}>
					mute member
				</Typography>
			</Button>
			
			<Button 
			variant="outlined"
			size="large"
			sx={buttonCss}>
				<Typography sx={buttonTypographyCss}>
					change password
				</Typography>
			</Button>
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
				<Typography sx={typographyCSS(6)} >
					{channelData.name}
				</Typography>
				<Divider variant='middle' sx={{ borderBottomWidth: 3, margin: 2, border: "2px solid #B998FF", marginBottom: '2vh' }} />
				<Typography sx={typographyCSS(4)} >
					{MEMBERS}
				</Typography>
				<Box display='flex' alignItems='center' height='55vh' marginTop='3vh' >
					{
						!loading &&
						<ChannelMembers channelMembers={channelData.members}/>
					}
					<Divider flexItem orientation='vertical' variant='middle' sx={{ borderBottomWidth: 3, border: "2px solid #B998FF" }} />
					<ChannelControlPannel/>
				</Box>
			</Box>
		</Box>
	)
}

export default ChannelsAdminPanel
