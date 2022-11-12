import React, { FunctionComponent } from "react";
import { Box, Button, List, ListItem, Typography } from "@mui/material";
import FriendsInfo from "./FriendsInfo";
import { LIST_CSS } from "../../utils/constants";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
    friendsData: {[key: string]: any};
	setChannelsAdminPanel: booleanSetState;
    setExtraContent: booleanSetState;
	setActiveChannel: numberSetState;
}

const typographyCSS = {
	color: '#212980',
	fontFamily: 'Orbitron',
	fontWeight: 600,
	fontSize: '5vh',
	paddingLeft: '1.7vh',
	whiteSpace: 'pre-wrap', overflowWrap: 'break-word', width: '24vw'
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

const onHoverFriend = {
	'&:hover': {
		backgroundColor: '#B998FF',
	},
	width: '100%',
	textTransform: 'lowercase',
	borderRadius: '0'
}

export const FriendsList : FunctionComponent<Props> = ({ friendsData, setExtraContent, setActiveChannel, setChannelsAdminPanel }) => {
	
	const friends = [] as JSX.Element[];
	friendsData.forEach((element : {[key: string]: any}) => {
		
		const handleClick = () => {
			setActiveChannel(element.channel);
			setExtraContent(true);
			setChannelsAdminPanel(false);
		}

		friends.push(
		<ListItem disablePadding key={element.username} sx={{marginBottom: '1vh'}}> 
			<Button sx={onHoverFriend} onClick={handleClick}>
				<FriendsInfo userData={element}/>
			</Button>
		</ListItem>);
	})

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
