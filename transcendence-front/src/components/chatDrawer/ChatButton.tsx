import { Box, Button } from "@mui/material"
import React, { FunctionComponent } from "react"

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
	direct: boolean;
    setDirect: booleanSetState;
    setExtraContent: booleanSetState;
}

const selected = {
	borderRadius: 0,
	textTransform: 'lowercase',
	background: '#212980',
	color: '#FFFFFF',
	fontFamily: 'Orbitron',
	fontSize: '4vh',
	paddingLeft: '5vh',
	paddingRight: '5vh',
	width: "50%",
	':hover': { background: '#212980'},
}

const notSelected = {
	borderRadius: 0,
	textTransform: 'lowercase',
	background: '#B998FF',
	color: '#FFFFFF',
	fontFamily: 'Orbitron',
	fontSize: '4vh',
	paddingLeft: '5vh',
	paddingRight: '5vh',
	width: "50%",
	':hover': { background: '#B998FF'},
}

export const ChatButton: FunctionComponent<Props> = ({ direct, setDirect, setExtraContent }) => {
	
	const handleDirectClick = () => {
		setExtraContent(false);
		setDirect(true);
	}
	
	const handleGroupClick = () => {
		setExtraContent(false);
		setDirect(false);
	}
	
	return (
		<Box display="flex" sx={{width: "100%"}}>
			<Button
				sx={ direct ? selected : notSelected }
				onClick={handleDirectClick}
			>
				Direct
			</Button>
			<Button
				sx={ direct ? notSelected : selected }
				onClick={handleGroupClick}
			>
				Groups
			</Button>
		</Box>
		
	)
} 

export default ChatButton
