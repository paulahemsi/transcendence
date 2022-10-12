import { Box, Button, List, ListItem, TextField, Typography } from "@mui/material";
import React, { FunctionComponent, useState } from "react";
import io from 'socket.io-client';

const chatSocket = io('/chat');

type numberSetState = React.Dispatch<React.SetStateAction<number>>
type matrixSetState = React.Dispatch<React.SetStateAction<string[][]>>

interface ActiveChannelProps {
	activeChannel: number;
	setActiveChannel: numberSetState;
}

interface MessageProps {
	activeChannel: number;
	isMember : boolean;
}

const transcendenceText = {
    fontSize: '5vh',
    fontFamily: 'Orbitron',
    fontWeight: 500,
    color: '#212980',
    textShadow: '0px 0px 6px #212980',
    margin: '2vh'
}

const Title = ({activeChannel} : {activeChannel : number}) => {
	return (
		<Typography sx={transcendenceText}>
			CHAT {activeChannel}
		</Typography>
	)
}

const RoomsButtons : FunctionComponent<ActiveChannelProps> = ({ activeChannel, setActiveChannel })  => {
	return (
		<Box display="flex">
			<Button
				variant={ activeChannel === 0 ? "contained" : "outlined"}
				onClick={() => setActiveChannel(0)}
				sx={{fontFamily: 'Orbitron'}}
			>
				chat 0
			</Button>
			<Button
				variant={ activeChannel === 1 ? "contained" : "outlined"}
				onClick={() => setActiveChannel(1)}
				sx={{fontFamily: 'Orbitron'}}
			>
				chat 1
			</Button>
			<Button
				variant={ activeChannel === 2 ? "contained" : "outlined"}
				onClick={() => setActiveChannel(2)}
				sx={{fontFamily: 'Orbitron'}}
			>
				chat 2
			</Button>
		</Box>
	)
}

const JoinOrLeaveButton = ({ channels, activeChannel } : { channels: boolean[], activeChannel: number }) => {

	const isMemberOfActiveChannel = () => {
		return channels[activeChannel];
	}

	return (
		<Button
			variant={"contained"}
			onClick={() => {
				if(isMemberOfActiveChannel()) {
					chatSocket.emit('leaveChannel', activeChannel.toString());
				} else {
					chatSocket.emit('joinChannel', activeChannel.toString());
				}
			}}
			color={  isMemberOfActiveChannel() ? "error" : "success" }
			sx={{ fontFamily: 'Orbitron' }}
		>
			{  isMemberOfActiveChannel() ? "leave" : "join" }
		</Button>
	)
}

const Messages : FunctionComponent<MessageProps> = ({ activeChannel, isMember }) => {
	const [msg, setMsg] = useState("")

	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		event.preventDefault()
		setMsg(event.target.value)
	}

	const handleSendMessage = () => {
		if (isMember) {
			const msgToSend = {
				text: msg,
				channel: activeChannel.toString()
			}
			chatSocket.emit('chatMessage', msgToSend)
		}
		setMsg("")
	}

	const keyDownHandler = (event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault()
			handleSendMessage()
		}
	}

	return (
		<Box display="flex">
		<TextField
				autoFocus
				margin="dense"
				id="name"
				label="message"
				type="email"
				variant="standard"
				value={msg}
				onKeyDown={keyDownHandler}
				onChange={handleChange}
		/>
		<Button
			variant="contained"
			onClick={handleSendMessage}
			sx={{fontFamily: 'Orbitron'}}
		>
			Send 
		</Button>
	</Box>
	)
}

export const Chat = () => {

	const [msgList, setMsgList] = useState([["zero", "zero"], ["um" , "um"], ["dois", "dois"]])
	const [activeChannel, setActiveChannel] = useState(0)
	const [channels, setChannels] = useState([false, false, false]);
	const notMember = "ooops, you're a not a channel member, join in to see the messages!";

	const messageList = [] as JSX.Element[];
	msgList[activeChannel].forEach((msg: string) => {
		messageList.push(
			<ListItem>
				<Typography sx={transcendenceText}>
					{msg}
				</Typography>
			</ListItem>
			)
		}
	)

	chatSocket.off('chatMessage').on('chatMessage', (msg) => {
		const channelNumber = +msg.channel;
		const newMsgList = msgList.map((element) => element);
		newMsgList[channelNumber].push(msg.text);
		setMsgList(newMsgList);
	} )

	chatSocket.on('joinChannel', (room) => {
		const roomNumber = +room;
		const newChannels = channels.map ((channel) => channel);
		newChannels[roomNumber] = true;
		setChannels(newChannels);
		
	} )

	chatSocket.on('leaveChannel', (room) => {
		const roomNumber = +room;
		const newChannels = channels.map ((channel) => channel);
		newChannels[roomNumber] = false;
		setChannels(newChannels);
	} )

	const isMemberOfActiveChannel = () => {
		return channels[activeChannel];
	}

	return (
		<Box display="flex" flexDirection="column" justifyContent="center" sx={{ paddingTop: '1vh', paddingRight: '1vh', paddingBottom: '1vh' }}>
			<Title activeChannel={activeChannel}/>
			<Messages isMember={isMemberOfActiveChannel()} activeChannel={activeChannel} />
			<RoomsButtons activeChannel={activeChannel} setActiveChannel={setActiveChannel}/>
			<JoinOrLeaveButton channels={channels} activeChannel={activeChannel}/>
			<List>
				{ isMemberOfActiveChannel() ? messageList : notMember}
			</List>
		</Box>
	)
}
