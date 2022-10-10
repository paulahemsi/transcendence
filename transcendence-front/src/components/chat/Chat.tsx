import { Box, Button, List, ListItem, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import io from 'socket.io-client';

const chatSocket = io('/chat-message');

const transcendenceText = {
    fontSize: '5vh',
    fontFamily: 'Orbitron',
    fontWeight: 500,
    color: '#212980',
    textShadow: '0px 0px 6px #212980',
    margin: '2vh'
}

export const Chat = () => {

	const [msgList, setMsgList] = useState<Array<string>>([])
	const [msg, setMsg] = useState("")
	const [activeRoom, setActiveRoom] = useState(1)
	const messageList = [] as JSX.Element[];

	msgList.forEach((msg: string) => {
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
		setMsgList(msgList.concat( `eu: ${msg}`))
		chatSocket.emit('chatMessage', msg)
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
		setMsgList(msgList.concat(msg))
	} )
	
	return (
	<Box display="flex" flexDirection="column" justifyContent="center" sx={{ paddingTop: '1vh', paddingRight: '1vh', paddingBottom: '1vh' }}>
		<Typography sx={transcendenceText}>
			CHAT {activeRoom}
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
				variant={ activeRoom === 1 ? "contained" : "outlined"}
				onClick={() => setActiveRoom(1)}
				sx={{fontFamily: 'Orbitron'}}
			>
				chat 1
			</Button>
			<Button
				variant={ activeRoom === 2 ? "contained" : "outlined"}
				onClick={() => setActiveRoom(2)}
				sx={{fontFamily: 'Orbitron'}}
			>
				chat 2
			</Button>
			<Button
				variant={ activeRoom === 3 ? "contained" : "outlined"}
				onClick={() => setActiveRoom(3)}
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
