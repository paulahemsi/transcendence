import { Box, Button } from "@mui/material"
import React from "react"

const chatButton = {
	borderRadius: 0,
	textTransform: 'lowercase',
	background: '#B998FF',
	color: '#FFFFFF',
	':hover': { background: '#212980'},
	fontFamily: 'Orbitron',
	fontSize: '4vh',
	paddingLeft: '5vh',
	paddingRight: '5vh',
	width: "50%",
}

export const ChatButton = () => {
	return (
		<Box display="flex" sx={{width: "100%"}}>
			<Button sx={chatButton}>
				Direct
			</Button>
			<Button sx={chatButton}>
				Groups
			</Button>
		</Box>
		
	)
} 

export default ChatButton
