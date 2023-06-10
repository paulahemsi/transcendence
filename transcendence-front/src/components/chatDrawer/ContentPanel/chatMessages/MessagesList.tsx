import React, { FunctionComponent, useEffect, useState } from "react";
import { Chip, List, ListItem, Typography } from "@mui/material";
import { getAuthToken, getIdFromToken, LIST_CSS } from "../../../utils/constants";
import axios from "axios";
import Loading from "../../Loading";
import { Stack } from "@mui/system";

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

const nameCSS = ( isFromUser : boolean ) => {
	return {
		marginBottom: '0.2vh',
		marginTop: '0.7vh',
		display:'flex',
		justifyContent: isFromUser ? 'flex-end' : 'flex-start',
		fontFamily: 'Orbitron',
		fontWeight: 600,
		fontSize: '2.2',
		color: '#311B92',
		paddingLeft: isFromUser ? '0vw' : '1vw',
		paddingRight: isFromUser ? '1vw' : '0vw',
	}
}

export const MessagesList: FunctionComponent<Props> = ({ messagesData }) => {
	const [blockedUsers, setBlockedUsers] = useState<{ [key: string]: any }>({});
	const [loading, setLoading] = useState(true);
	const userId = getIdFromToken();
	const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
	const messages = [] as JSX.Element[];
  
	useEffect(() => {getBlockedUsers()}, [blockedUsers]);

	const getBlockedUsers = async () => {
		await axios.get(`${process.env.REACT_APP_BACK_HOST}/users/${userId}/block`, { headers: getAuthToken() }).then((response) => {
			setBlockedUsers(response.data);
			setLoading(false);
		}).catch( () => {});
	}
  
	useEffect(() => {
	  const fetchUsernames = async () => {
		const usernamePromises = messagesData.map((element: { [key: string]: any }) =>
		  axios
			.get(`${process.env.REACT_APP_BACK_HOST}/users/${element.userId}`, {
			  headers: getAuthToken(),
			})
			.then((response) => ({
			  userId: element.userId,
			  username: response.data.username,
			}))
			.catch(() => ({
			  userId: element.userId,
			  username: "",
			}))
		);
  
		const resolvedUsernames = await Promise.all(usernamePromises);
  
		const updatedUsernames = resolvedUsernames.reduce(
		  (acc, { userId, username }) => {
			acc[userId] = username;
			return acc;
		  },
		  { ...usernames }
		);
  
		setUsernames(updatedUsernames);
	  };
  
	  fetchUsernames();
	}, [messagesData]);

	if (loading) {
		return <Loading/>
	}
  
	messagesData.forEach((element: { [key: string]: any }, index: number) => {
	  const username = usernames[element.userId] || "";
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
		<ListItem disablePadding key={index} sx={messageCSS(isFromUser())}>
		  <Stack>
			<Typography sx={nameCSS(isFromUser())}>{username}</Typography>
			<Chip label={element.message} sx={chipCSS(isFromUser(), isFromBlockedUser())} />
		  </Stack>
		</ListItem>
	  );
	});
  
	return <List disablePadding sx={LIST_CSS}>{messages}</List>;
  };
  
  export default MessagesList;