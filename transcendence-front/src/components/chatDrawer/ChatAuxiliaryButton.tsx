import { Box, Button } from "@mui/material"
import React, { FunctionComponent } from "react"

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
	direct: boolean;
	setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
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

const directButton = buttonConfig("30vw")
const groupButton = buttonConfig("10vw")

export const DirectButtons = ({ setExtraContent } : { setExtraContent : booleanSetState }) => {
	
	const handleClick = () => {
		setExtraContent(false);
	}
	
	return (
		<Box display="flex" sx={{width: "30vw"}}>
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
		<Box display="flex" sx={{width: "30vw"}}>
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

export const ChatAuxiliaryButton: FunctionComponent<Props> = ({ direct, setExtraContent, setActiveChannel }) => {
	return (
		<>
		{ direct
		? <DirectButtons setExtraContent={setExtraContent} />
		: <GroupsButtons setExtraContent={setExtraContent} /> } 
		</>
	)
} 

export default ChatAuxiliaryButton
