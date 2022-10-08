import { Box, Button, List, ListItem, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import io from 'socket.io-client';

const socket = io();

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
		socket.emit('chatMessage', msg)
		setMsg("")
	}

	const keyDownHandler = (event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault()
			handleSendMessage()
		}
	}

	socket.on('chatMessage', (msg) => {
		console.log("message from server: ", msg)
		setMsgList(msgList.concat(msg))
	} )
	

	return (
	<Box display="flex" flexDirection="column" justifyContent="center" sx={{ paddingTop: '1vh', paddingRight: '1vh', paddingBottom: '1vh' }}>
		<Typography sx={transcendenceText}>
			CHAT, MUITO MASSA
		</Typography>
		<TextField
                autoFocus
                margin="dense"
                id="name"
                label="message"
                type="email"
                fullWidth
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
		<List>
			{messageList}
		</List>

	</Box>
	)
}