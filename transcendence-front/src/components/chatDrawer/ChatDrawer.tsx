import React, { FunctionComponent, useState } from "react";
import { Box, Button, Drawer, List, ListItem } from '@mui/material';
import FriendsInfo from "./FriendsInfo";
import ChatButton from "./ChatButton";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    friendsData: {[key: string]: any};
    setOpenDrawer: booleanSetState;
}

const onHoverFriend = {
	'&:hover': {
		backgroundColor: '#B998FF',
	},
	width: '100%',
	textTransform: 'lowercase',
	borderRadius: '0'
}

export const ChatDrawer : FunctionComponent<Props> = ({ friendsData, setOpenDrawer }) => {
	const [direct, setDirect] = useState(true);
	
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
		<>
		  <Drawer open={true} transitionDuration={500} onClose={() => setOpenDrawer(false)} anchor="right">
			<ChatButton direct={direct} setDirect={setDirect}/>
			{
				direct
				? <List disablePadding>
						{friends}
				</List>
				: <List disablePadding>
					{friends}
				</List>
			}
		  </Drawer>
		</>
	  )
}

export default ChatDrawer
