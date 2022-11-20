import React, { FunctionComponent } from "react";
import { Chip, List, ListItem } from "@mui/material";
import { getIdFromToken, LIST_CSS } from "../../../utils/constants";

interface Props {
    messagesData: {[key: string]: any};
}

const chipCSS = ( isFromUser : boolean ) => {
	return {
		background:  isFromUser ? '#B998FF' : '#F5F5F5',
		border: 2,
		borderColor:  isFromUser ? '#B998FF' : '#212980',
		borderRadius: 3,
		boxShadow: 5,
		minWidth: '5vw',
		minHeight: '8vh',
		fontFamily: 'Orbitron',
		fontWeight: 400,
		fontSize: '4vh',
		padding: '1.7vh',
		margin: '1vh',
	}
}

const messageCSS = ( isFromUser : boolean ) => {
	return {
		marginBottom: '1vh',
		display:'flex',
		justifyContent: isFromUser ? 'flex-end' : 'flex-start',
	}
}

export const MessagesList : FunctionComponent<Props> = ({ messagesData }) => {
	const userId = getIdFromToken();
	const messages = [] as JSX.Element[];

	messagesData.forEach((element : {[key: string]: any}, index : number) => {
		const isFromUser = () => { return userId === element.userId }
		messages.push(
		<ListItem 
			disablePadding
			key={index}
			sx={messageCSS(isFromUser())}
		> 
			<Chip
				label={element.message} 
				sx={chipCSS(isFromUser())}
			/>
		</ListItem>);
	})

	return (
		<List disablePadding sx={LIST_CSS} >
			{messages}
		</List>
		
	)
}

export default MessagesList
