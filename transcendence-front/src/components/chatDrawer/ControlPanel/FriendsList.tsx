import React, { FunctionComponent } from "react";
import { Box, Button, List, ListItem } from "@mui/material";
import FriendsInfo from "./FriendsInfo";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

const listCss = { 
	width: '100%',  height: '64vh', position: 'relative', overflow: 'auto',   overflowY: "auto",
	margin: 0,
	padding: 0,
	listStyle: "none",
	'&::-webkit-scrollbar': {
	width: '0.4em',
	borderRadius: 5,
	},
	'&::-webkit-scrollbar-track': {
		boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
		webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
		borderRadius: 5,
	},
	'&::-webkit-scrollbar-thumb': {
		backgroundColor: '#212980',
		outline: 'none',
		borderRadius: 5,
	}
}

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

export const FriendsList : FunctionComponent<Props> = ({ friendsData, setExtraContent, setActiveChannel }) => {
	
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
		<List disablePadding sx={listCss}>
			{friends}
		</List>
	)
}

export default FriendsList
