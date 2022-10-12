import { Box, Button } from "@mui/material"
import React, { FunctionComponent } from "react"

interface Props {
	direct: boolean;
}
export const buttonConfig = (width: string) => {
	return {
		borderRadius: 0,
		textTransform: 'lowercase',
		background: '#B998FF',
		color: '#FFFFFF',
		':hover': { background: '#212980'},
		fontFamily: 'Orbitron',
		fontSize: '3vh',
		paddingLeft: '4vh',
		paddingRight: '4vh',
		width: width,
	}
}

const directButton = buttonConfig("100%")
const groupButton = buttonConfig("33.333%")

export const DirectButtons = () => {
	return (
		<Box display="flex" sx={{width: "100%"}}>
			<Button sx={directButton}>
				add friend
			</Button>
		</Box>
	)
}

export const GroupsButtons = () => {
	return (
		<Box display="flex" sx={{width: "100%"}}>
			<Button sx={groupButton}>
				manage	
			</Button>
			<Button sx={groupButton}>
				create
			</Button>
			<Button sx={groupButton}>
				search
			</Button>
		</Box>
	)
}

export const ChatAuxiliaryButton: FunctionComponent<Props> = ({ direct }) => {
	return (
		<>
		{ direct
		? <DirectButtons />
		: <GroupsButtons /> } 
		</>
	)
} 

export default ChatAuxiliaryButton
