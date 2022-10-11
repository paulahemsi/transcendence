import { Box, Button, List, ListItem, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import io from 'socket.io-client';

const chatSocket = io('/chat');

const transcendenceText = {
    fontSize: '5vh',
    fontFamily: 'Orbitron',
    fontWeight: 500,
    color: '#212980',
    textShadow: '0px 0px 6px #212980',
    margin: '2vh'
}

export const Chat = () => {

	const [msgList, setMsgList] = useState([["zero", "zero"], ["um" , "um"], ["dois", "dois"]])
	const [msg, setMsg] = useState("")
	const [activeChannel, setactiveChannel] = useState(0)
	const [channels, setChannels] = useState([false, false, false]);
	
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

	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setMsg(event.target.value)
	}

	const handleSendMessage = () => {
		const msgToSend = {
			text: msg,
			channel: activeChannel.toString()
		}
		msgList[activeChannel].concat( `eu: ${msg}`);
		setMsgList(msgList);
		chatSocket.emit('chatMessage', msgToSend)
		setMsg("")
	}

	const keyDownHandler = (event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault()
			handleSendMessage()
		}
	}

	const isMemberOfActiveChannel = () => {
		return channels[activeChannel];
	}
	
	chatSocket.on('chatMessage', (msg) => {
		console.log("message from server: ", msg);
		const channelNumber = +msg.channel;
		msgList[channelNumber].push(msg.text);
		console.log("oiiii")
		console.log(msgList[channelNumber]);
		setMsgList(msgList);
	} )

	chatSocket.on('joinChannel', (room) => {
		const roomNumber = +room;
		channels[roomNumber] = true;
		setChannels(channels);
		
	} )

	chatSocket.on('leaveChannel', (room) => {
		const roomNumber = +room;
		channels[roomNumber] = false
		setChannels(channels);
	} )
	
	return (
	<Box display="flex" flexDirection="column" justifyContent="center" sx={{ paddingTop: '1vh', paddingRight: '1vh', paddingBottom: '1vh' }}>
		<Typography sx={transcendenceText}>
			CHAT {activeChannel}
		</Typography>
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
		<Box display="flex">
			<Button
				variant={ activeChannel === 0 ? "contained" : "outlined"}
				onClick={() => setactiveChannel(0)}
				sx={{fontFamily: 'Orbitron'}}
			>
				chat 0
			</Button>
			<Button
				variant={ activeChannel === 1 ? "contained" : "outlined"}
				onClick={() => setactiveChannel(1)}
				sx={{fontFamily: 'Orbitron'}}
			>
				chat 1
			</Button>
			<Button
				variant={ activeChannel === 2 ? "contained" : "outlined"}
				onClick={() => setactiveChannel(2)}
				sx={{fontFamily: 'Orbitron'}}
			>
				chat 2
			</Button>
		</Box>
		<Button
			variant={"contained"}
			onClick={() => {
				if(isMemberOfActiveChannel()) {
					console.log("estou saindo")
					chatSocket.emit('leaveChannel', activeChannel.toString());
				} else {
					console.log("estou entrando")
					chatSocket.emit('joinChannel', activeChannel.toString());
				}
			}}
			color={  isMemberOfActiveChannel() ? "error" : "success" }
			sx={{ fontFamily: 'Orbitron' }}
		>
			{  isMemberOfActiveChannel() ? "leave" : "join" }
		</Button>
		<List>
			{messageList}
		</List>
	</Box>
	)
}
