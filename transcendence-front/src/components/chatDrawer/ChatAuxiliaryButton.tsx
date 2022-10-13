import { Box, Button } from "@mui/material"
import React, { FunctionComponent } from "react"

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
	direct: boolean;
	setExtraContent : booleanSetState;
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

export const DirectButtons = ({ setExtraContent } : { setExtraContent : booleanSetState }) => {
	
	const handleClick = () => {
		setExtraContent(false);
	}
	
	return (
		<Box display="flex" sx={{width: "100%"}}>
			<Button sx={directButton} onClick={handleClick}>
				add friend
			</Button>
		</Box>
	)
}

export const GroupsButtons = ({ setExtraContent } : { setExtraContent : booleanSetState }) => {
	
	const handleClick = () => {
		setExtraContent(false);
	}
	
	return (
		<Box display="flex" sx={{width: "100%"}}>
			<Button sx={groupButton}>
				manage	
			</Button>
			<Button sx={groupButton} onClick={handleClick}>
				create
			</Button>
			<Button sx={groupButton} onClick={handleClick}>
				search
			</Button>
		</Box>
	)
}

export const ChatAuxiliaryButton: FunctionComponent<Props> = ({ direct, setExtraContent }) => {
	return (
		<>
		{ direct
		? <DirectButtons setExtraContent={setExtraContent} />
		: <GroupsButtons setExtraContent={setExtraContent} /> } 
		</>
	)
} 

export default ChatAuxiliaryButton
