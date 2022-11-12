import React, { useEffect, useReducer, useState } from "react";
import { TextField, Box, Typography, Button } from "@mui/material";
import io from 'socket.io-client';
import axios, { AxiosRequestHeaders } from 'axios';
import MessagesList from "../MessagesList";
import jwt from 'jwt-decode';
import { messagesBorderCSS, typographyCSS } from "../../../utils/constants";
import DMButtons from "./DMButtons";
import Muted from "./Muted";
import NoMessages from "./NoMessages";

type tokenData = {
	id: string;
}

type arraySetState = React.Dispatch<React.SetStateAction<string[]>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

const chatSocket = io('/chat');

const reducer = (state: {[key: string]: any}, newState : {[key: string]: any}) => {
	return { ...state, ...newState };
}

const requestMessagesFromChannel = async ( activeChannel : number , setMessagesData : arraySetState ) =>  {
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	await axios.get(`http://localhost:4444/channels/${activeChannel}/messages`, { headers: authToken }).then((response) => {
		setMessagesData(response.data);
	}).catch( () => {});
}

const requestMembersFromChannel = async ( activeChannel : number , setState : objectSetState ) =>  {
	const authToken: AxiosRequestHeaders = {'Authorization': 'Bearer ' + document.cookie.substring('accessToken='.length)};
	await axios.get(`http://localhost:4444/channels/${activeChannel}/members`, { headers: authToken }).then((response) => {
		const user = response.data.filter((member: {[key: string]: any}) => member.id === getUserId())
		if (user.length) {
			setState({muted: user[0].muted});
		}
	}).catch( () => {});
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
			if (!newMessage.trim()) {
				return ;
			}
			const msgToSend = {
				user: getUserId(),
				channel: activeChannel.toString(),
				message: newMessage,
			}
			chatSocket.emit('chatMessage', msgToSend);
			setNewMessage("");
		}
	}
	

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="space-between"
			bgcolor="blue"
			padding="3vh"
			sx={{minWidth: '50vw', height: '74vh', background: '#F5F5F5',}}>
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
						value={newMessage}
						onKeyDown={keyDownHandler}
						onChange={handleChange}
					/>
				</Box>
		</Box>
	)
}

export const ChatMessages = ( { activeChannel, isDM } : { activeChannel : number, isDM: boolean }) => {
	const [state, setState] = useReducer(reducer, {
		joined: false,
		muted: false,
		mutedMockCounter: 0,
	});
	
	useEffect(() => {requestMembersFromChannel(activeChannel, setState)}, [state.mutedMockCounter]);

	chatSocket.emit('joinChannel', activeChannel);

	chatSocket.on('joinChannel', (room) => {
		if ( room == activeChannel) {
			setState({ joined: true });
		}
	} )

	chatSocket.off('muteUser').on('muteUser', () => {
			const update = state.mutedMockCounter + 1;
			setState({ mutedMockCounter: update });
	});

	chatSocket.on('leaveChannel', (room) => {
		//?
	} )
	
	if (state.muted) {
		return (
			<Muted/>
		)
	}
	
	return (
		<>
			{
				state.joined && isDM &&
				<DMButtons />
			}
			{
				state.joined && 
				<ChannelMessage activeChannel={activeChannel} />
			}
		</>
	)
}

export default ChatMessages
