import React, { useEffect, useReducer, useState } from "react";
import { TextField, Box, Typography, Button } from "@mui/material";
import io from 'socket.io-client';
import axios, { AxiosRequestHeaders } from 'axios';
import MessagesList from "./MessagesList";
import jwt from 'jwt-decode';

type tokenData = {
	id: string;
}

type arraySetState = React.Dispatch<React.SetStateAction<string[]>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

const chatSocket = io('/chat');

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

const buttonCss = {
	// margin: '1vh',
	// marginLeft: '10vh',
	width: '15vw',
	height: '7vh',
	background: '#F5F5F5',
	borderRadius: 5,
	border: '3px solid',
	borderColor: '#212980',
	boxShadow: 7,
	':hover': { 
		background: '#B998FF',
		borderColor: '#B998FF'
	}
}

const buttonTypographyCss = {
	textTransform: 'lowercase',
	fontFamily: 'Orbitron',
	fontSize: '2.5vh',
	color: '#311B92',
}

const noMessages = "it's so quiet in here ......"
const muted = "ooops! You're muted... Wait for a while..."

const reducer = (state: {[key: string]: any}, newState : {[key: string]: any}) => {
	return { ...state, ...newState };
}

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

const Muted = () => {
	return (
		<Box
			display="flex" 
			flexDirection="column"
			justifyContent="space-between"
			bgcolor="blue"
			padding="3vh"
			sx={{minWidth: '50vw', height: '80vh', background: '#F5F5F5',}}
		>
			<Box sx={messagesBorderCSS}>
				<Box 
					display="flex"
					alignItems="center"
					flexDirection="column"
					flexWrap="wrap"
					justifyContent="center"
					sx={{width: '100%',  height: '50vh'}}
				>
					<Typography sx={typographyCSS}>
						{muted}
					</Typography>
				</Box>
			</Box>
		</Box>
	)
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
			sx={{minWidth: '50vw', height: '80vh', background: '#F5F5F5',}}>
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

const InviteToGame = () => {
	
	const handleClick = () => {
		
	}
	
	return (
		<Button
			variant="outlined"
			size="large"
			sx={buttonCss}
			onClick={handleClick}
		>
			<Typography sx={buttonTypographyCss}>
				Invite to game
			</Typography>
		</Button>
	)
}

const BlockUser = () => {
	
	const handleClick = () => {
		
	}
	
	return (
		<Button
			variant="outlined"
			size="large"
			sx={buttonCss}
			onClick={handleClick}
		>
			<Typography sx={buttonTypographyCss}>
				Block
			</Typography>
		</Button>
	)
}

const GoToProfile = () => {
	
	const handleClick = () => {
		
	}
	
	return (
		<Button
			variant="outlined"
			size="large"
			sx={buttonCss}
			onClick={handleClick}
		>
			<Typography sx={buttonTypographyCss}>
				Go profile
			</Typography>
		</Button>
	)
}

const DMButtons = () => {
	return (
		<Box display="flex" justifyContent="space-around" minWidth="50vw" marginTop="1vh">
			<InviteToGame/>
			<BlockUser/>
			<GoToProfile/>
		</Box>
	)
}

export const ExtraContent = ( { activeChannel, isDM } : { activeChannel : number, isDM: boolean }) => {
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

export default ExtraContent
