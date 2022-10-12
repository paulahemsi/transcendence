import React from "react";
import { Button, List, ListItem } from "@mui/material";
import FriendsInfo from "./FriendsInfo";

const onHoverFriend = {
	'&:hover': {
		backgroundColor: '#B998FF',
	},
	width: '100%',
	textTransform: 'lowercase',
	borderRadius: '0'
}

export const FriendsList = ({ friendsData } : { friendsData: {[key: string]: any }}) => {
	
	const friends = [] as JSX.Element[];
	friendsData.forEach((element : {[key: string]: any}) => {
		friends.push(
		<ListItem disablePadding key={element.username} sx={{marginBottom: '1vh'}}> 
			<Button sx={onHoverFriend} onClick={() => console.log("click")}>
				<FriendsInfo userData={element}/>
			</Button>
		</ListItem>);
	})

	return (
		<List disablePadding>
			{friends}
		</List>
		
	)
}

export default FriendsList
