import React, { FunctionComponent, useEffect, useReducer, useState } from "react";
import { TextField, Box } from "@mui/material";
import axios from 'axios';
import MessagesList from "./MessagesList";
import { arraySetState, booleanSetState, getAuthToken, getIdFromToken, messagesBorderCSS, objectSetState, stringSetState } from "../../../utils/constants";
import DMButtons from "./DMButtons";
import Muted from "./Muted";
import NoMessages from "./NoMessages";
import { chatSocket } from "../../../context/socket";

interface ChatMessageProps {
	activeChannel : number;
	isDM: boolean;
	friendId: string;
	setIsHost: booleanSetState;
	setGameActive: booleanSetState;
	setMatchRoom: stringSetState;
	setStandardMode: booleanSetState;
}

const reducer = (state: {[key: string]: any}, newState : {[key: string]: any}) => {
	return { ...state, ...newState };
}

const requestMessagesFromChannel = async ( activeChannel : number , setMessagesData : arraySetState ) =>  {

	const authToken = getAuthToken();
	await axios.get(`http://localhost:4444/channels/${activeChannel}/messages`, { headers: authToken }).then((response) => {
		setMessagesData(response.data);
	}).catch( () => {});
}

const requestMembersFromChannel = async ( activeChannel : number , setState : objectSetState ) =>  {

	const userId = getIdFromToken();
	const authToken = getAuthToken();
	await axios.get(`http://localhost:4444/channels/${activeChannel}/members`, { headers: authToken }).then((response) => {
		const user = response.data.filter((member: {[key: string]: any}) => member.id === userId)
		if (user.length) {
			setState({muted: user[0].muted});
		}
	}).catch( () => {});
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
		const userId = getIdFromToken();
		if (event.key === 'Enter') {
			event.preventDefault();
			if (!newMessage.trim()) {
				return ;
			}
			const msgToSend = {
				user: userId,
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

export const ChatMessages: FunctionComponent<ChatMessageProps> = ({
	activeChannel, isDM, friendId, setIsHost, setGameActive, setMatchRoom, setStandardMode}) => {
	const [state, setState] = useReducer(reducer, {
		muted: false,
	});
	
	useEffect(() => {requestMembersFromChannel(activeChannel, setState)}, [activeChannel]);

	chatSocket.emit('joinChannel', activeChannel);

	chatSocket.off('muteUser').on('muteUser', () => {
			requestMembersFromChannel(activeChannel, setState)
	});

	if (state.muted) {
		return (
			<Muted/>
		)
	}
	
	return (
		<>
			{
				isDM &&
				<DMButtons
					friendId={friendId}
					setIsHost={setIsHost}
					setGameActive={setGameActive}
					setMatchRoom={setMatchRoom}
					setStandardMode={setStandardMode}
				/>
			}
			{
				<ChannelMessage activeChannel={activeChannel} />
			}
		</>
	)
}

export default ChatMessages
