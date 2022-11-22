import React, { FunctionComponent, useEffect, useState } from "react";
import { Chip, List, ListItem } from "@mui/material";
import { getAuthToken, getIdFromToken, LIST_CSS } from "../../../utils/constants";
import axios from "axios";
import Loading from "../../Loading";

interface Props {
    messagesData: {[key: string]: any};
}

const chipCSS = ( isFromUser : boolean, isFromBlockedUser : boolean ) => {
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
		color: isFromBlockedUser ? 'transparent' : 'black',
		textShadow: isFromBlockedUser ? '0 0 13px rgba(0,0,0,0.4)' : '0 0 0px rgba(0,0,0,0)',
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
	const [blockedUsers, setBlockedUsers] = useState<{[key: string]: any}>({});
	const [loading, setLoading] = useState(true);
	const userId = getIdFromToken();
	const messages = [] as JSX.Element[];
	
	useEffect(() => {getBlockedUsers()}, [blockedUsers]);

	const getBlockedUsers = async () => {
		await axios.get(`http://localhost:3000/users/${userId}/block`, { headers: getAuthToken() }).then((response) => {
			setBlockedUsers(response.data);
			setLoading(false);
		}).catch( () => {});
	}

	if (loading) {
		return <Loading/>
	}
	
	messagesData.forEach((element : {[key: string]: any}, index : number) => {
		const isFromUser = () => { return userId === element.userId }
		const isFromBlockedUser = () => {
			if (!blockedUsers) {
				return false;
			}
			if (blockedUsers.filter((member: {[key: string]: string}) => member.id === element.userId).length) {
				return true;
			}
			return false;
		}
		messages.push(
		<ListItem 
			disablePadding
			key={index}
			sx={messageCSS(isFromUser())}
		> 
			<Chip
				label={element.message} 
				sx={chipCSS(isFromUser(), isFromBlockedUser())}
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
