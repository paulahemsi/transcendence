import React, { FunctionComponent } from "react";
import { Button, List, ListItem } from "@mui/material";
import FriendsInfo from "./FriendsInfo";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
    friendsData: {[key: string]: any};
    setExtraContent: booleanSetState;
	setActiveChannel: numberSetState;
}

const onHoverFriend = {
	'&:hover': {
		backgroundColor: '#B998FF',
	},
	width: '100%',
	textTransform: 'lowercase',
	borderRadius: '0'
}

export const FriendsList : FunctionComponent<Props> = ({ friendsData, setExtraContent }) => {
	
	const friends = [] as JSX.Element[];
	friendsData.forEach((element : {[key: string]: any}) => {
		friends.push(
		<ListItem disablePadding key={element.username} sx={{marginBottom: '1vh'}}> 
			<Button sx={onHoverFriend} onClick={() => setExtraContent(true)}>
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
