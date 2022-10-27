import React, { useEffect, useState } from "react";
import { TextField, Box, Typography } from "@mui/material";
import io from 'socket.io-client';
import axios, { AxiosRequestHeaders } from 'axios';
import MessagesList from "./MessagesList";
import jwt from 'jwt-decode';

type tokenData = {
	id: string;
}

const chatSocket = io('/chat');

type arraySetState = React.Dispatch<React.SetStateAction<string[]>>

const messagesBorderCSS = {
	minWidth: '50vw',
	height: '64vh',
	background: '#F5F5F5',
	border: 4,
	borderColor: '#212980',
	borderRadius: 3,
	boxShadow: 5
}

const typographyCSS = {
	color: '#212980',
	fontFamily: 'Orbitron',
	fontWeight: 600,
	fontSize: '5vh',
	paddingLeft: '1.7vh',
	whiteSpace: 'pre-wrap', overflowWrap: 'break-word', width: '24vw'
}

const noMessages = "it's so quiet in here ......"

const NoMessages = () => {
	return (
		<Box 
			display="flex"
			alignItems="center"
			flexDirection="column"
			flexWrap="wrap"
			justifyContent="center"
			sx={{width: '100%',  height: '50vh'}}
		>
			<Typography
				sx={typographyCSS}
			>
				{noMessages}
			</Typography>
		</Box>
	)
}

const requestMessagesFromChannel = async ( activeChannel : number , setMessagesData : arraySetState ) =>  {
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	await axios.get(`http://localhost:4444/channels/${activeChannel}/messages`, { headers: authToken }).then((response) => {
		setMessagesData(response.data);
})
}

const getUserId = () => {
	const tokenData: tokenData = jwt(document.cookie);
	return tokenData.id;
}

const ChannelMessage = ( { activeChannel } : { activeChannel : number }) => {
	const [messagesData, setMessagesData] = useState<{[key: string]: any}>({});
	const [newMessage, setNewMessage] = useState("");

	useEffect(() => {requestMessagesFromChannel(activeChannel, setMessagesData)}, [activeChannel]);
	
	chatSocket.off('chatMessage').on('chatMessage', (msg) => {
		const newMessagesData = messagesData.map((element : {[key: string]: any}) => element);
		newMessagesData.push(msg);
		setMessagesData(newMessagesData);
	} )

	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setNewMessage(event.target.value);
	}

	const keyDownHandler = ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			const msgToSend = {
				user: getUserId(),
				channel: activeChannel.toString(),
				message: newMessage,
			}
			chatSocket.emit('chatMessage', msgToSend)
		}
		setNewMessage("")
	}
	

	return (
		<Box display="flex" flexDirection="column" justifyContent="space-between" bgcolor="blue" padding="3vh" sx={{minWidth: '50vw', height: '80vh',
		background: '#F5F5F5',
		}}>
		<Box sx={messagesBorderCSS}>
			{
				messagesData[0] 
				?
					<MessagesList messagesData={messagesData}/>
				:
					<NoMessages />
			}
		</Box>
		<Box>
			<TextField
				autoFocus
				margin="dense"
				id="message"
				type="text"
				sx={{ width: '50vw' }}
				variant="standard"
				// value={newMessage}
				onKeyDown={keyDownHandler}
				onChange={handleChange}
			/>
		</Box>
	</Box>
	)
}

export const ExtraContent = ( { activeChannel } : { activeChannel : number }) => {
	const [ joined, setJoined ] = useState(false);

	chatSocket.emit('joinChannel', activeChannel);

	chatSocket.on('joinChannel', (room) => {
		if ( room == activeChannel) {
			setJoined(true);
		}
	} )

	chatSocket.on('leaveChannel', (room) => {
		//?
	} )
	
	return (
		<>
			{
				joined && 
				<ChannelMessage activeChannel={activeChannel} />
			}
		</>
	)
}

export default ExtraContent
