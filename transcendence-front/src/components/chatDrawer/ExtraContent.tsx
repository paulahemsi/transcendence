import React, { useEffect, useState } from "react";
import { TextField, Box } from "@mui/material";
import io from 'socket.io-client';
import axios, { AxiosRequestHeaders } from 'axios';
import MessagesList from "./MessagesList";

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

const requestMessagesFromChannel = async ( activeChannel : number , setMessagesData : arraySetState ) =>  {
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	await axios.get(`http://localhost:4444/channels/${activeChannel}/messages`, { headers: authToken }).then((response) => {
		setMessagesData(response.data);
})
}

const ChannelMessage = ( { activeChannel } : { activeChannel : number }) => {
	const [messagesData, setMessagesData] = useState<{[key: string]: any}>({});

	useEffect(() => {requestMessagesFromChannel(activeChannel, setMessagesData)}, []);
	
	chatSocket.off('chatMessage').on('chatMessage', (msg) => {
		const newmessagesData = messagesData.map((element : {[key: string]: any}) => element);
		newmessagesData.push(msg.text);
		setMessagesData(newmessagesData);
	} )

	return (
		<Box display="flex" flexDirection="column" justifyContent="space-between" bgcolor="blue" padding="3vh" sx={{minWidth: '50vw', height: '80vh',
		background: '#F5F5F5',
		}}>
		<Box sx={messagesBorderCSS}>
			{
				messagesData[0] 
				? (
					<MessagesList messagesData={messagesData}/>
				) :
				":("
			}
		</Box>
		<Box>
			<TextField
				autoFocus
				margin="dense"
				id="message"
				type="message"
				sx={{ width: '50vw' }}
				variant="standard"
				// value={username}
				// onKeyDown={keyDownHandler}
				// onChange={handleChange}
			/>
		</Box>
	</Box>
	)
}

export const ExtraContent = ( { activeChannel } : { activeChannel : number }) => {
	const [ joined, setJoined ] = useState(false);

	chatSocket.emit('joinChannel', activeChannel);

	chatSocket.on('joinChannel', (room) => {
		//? temos que conferir se o room é o activeChannel? Ou parar de retornar o room?
		setJoined(true);
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
