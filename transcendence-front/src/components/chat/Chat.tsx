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

	const [msgList, setMsgList] = useState([["um", "um"], ["dois" , "dois"], ["três", "três"]])
	const [msg, setMsg] = useState("")
	const [activeChannel, setactiveChannel] = useState(1)
	const messageList = [] as JSX.Element[];

	msgList[activeChannel - 1].forEach((msg: string) => {
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
		msgList[activeChannel - 1].push( `eu: ${msg}`);
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

	chatSocket.on('chatMessage', (msg) => {
		console.log("message from server: ", msg)
		msgList[msg.channel - 1].push( `eu: ${msg.text}`);
		setMsgList(msgList);
		// setMsgList(msgList.concat(msg))
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
			<Button
				variant={ activeChannel === 3 ? "contained" : "outlined"}
				onClick={() => setactiveChannel(3)}
				sx={{fontFamily: 'Orbitron'}}
			>
				chat 3
			</Button>
		</Box>
		<List>
			{messageList}
		</List>
	</Box>
	)
}
