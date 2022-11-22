import React, { FunctionComponent } from "react";
import { Box, Button, List, ListItem, Tooltip, Typography, Zoom } from "@mui/material";
import FriendsInfo from "./FriendsInfo";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { booleanSetState, LIST_CSS, numberSetState, typographyCSS } from "../../utils/constants";
import { gameSocket } from "../../context/socket";

interface Props {
    friendsData: {[key: string]: any};
	setChannelsAdminPanel: booleanSetState;
    setExtraContent: booleanSetState;
	setActiveChannel: numberSetState;
	activeChannel: number;
}

const friendsCSS = ( isActiveGroup : boolean ) => {
	const bgColor = isActiveGroup ? '#B998FF' : '#F5F5F5';

	return {
		'&:hover': {
			backgroundColor: '#B998FF',
		},
		width: '100%',
		textTransform: 'lowercase',
		borderRadius: '0',
		backgroundColor: bgColor ,
	}
}

const noFriends = "you dont have any friends yet \r\n\r\n :("

const NoFriends = () => {
	return (
		<Box 
			display="flex"
			alignItems="center"
			flexDirection="column"
			flexWrap="wrap"
			justifyContent="center"
			sx={{width: '100%',  height: '50vh'}}
		>
			<Typography
				sx={typographyCSS}
			>
				{noFriends}
			</Typography>
		</Box>
	)
}

const WatchGame = ({ friendId } : { friendId: string }) => {
	const handleClick = () => {
		console.log("quero assisir esse jogo (:");
		console.log(friendId);
		gameSocket.emit('watchGame', friendId);
	};

	return (
		<Tooltip title='watch game' placement='right' arrow TransitionComponent={Zoom}>
			<VisibilityIcon
				fontSize="large"
				sx={{ alignSelf: 'center', color: '#9575CD', marginRight: '25px'}}
				onClick={handleClick}
			>
			</VisibilityIcon>
		</Tooltip>
	)
}

export const FriendsList : FunctionComponent<Props> = ({ friendsData, setExtraContent, setActiveChannel, activeChannel, setChannelsAdminPanel }) => {
	
	const friends = [] as JSX.Element[];
	if (friendsData.length) {
		friendsData.forEach((element : {[key: string]: any}) => {
			const isActiveGroup = element.channel === activeChannel;
	
			const handleClick = () => {
				setActiveChannel(element.channel);
				setExtraContent(true);
				setChannelsAdminPanel(false);
			}
	
			friends.push(
			<ListItem disablePadding key={element.username} sx={{marginBottom: '1vh'}}> 
				<Button sx={friendsCSS(isActiveGroup)} onClick={handleClick}>
					<FriendsInfo userData={element}/>
				</Button>
				{
					element.status === 'in_game' &&
					<Box padding='1vh'>
						<WatchGame friendId={element.id}/>
					</Box>
				}
			</ListItem>);
		})
	}

	return (
		<>
		{
			friendsData[0]
			?
			<List 
				disablePadding 
				sx=	{LIST_CSS}
			>
				{friends}
			</List>
			:
			<NoFriends/>
		}
		</>
	)
}

export default FriendsList
