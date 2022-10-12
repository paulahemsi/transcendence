import React, { FunctionComponent, useState } from "react";
import { Drawer, List } from '@mui/material';
import ChatButton from "./ChatButton";
import FriendsList from "./FriendsList";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    friendsData: {[key: string]: any};
    setOpenDrawer: booleanSetState;
}

export const ChatDrawer : FunctionComponent<Props> = ({ friendsData, setOpenDrawer }) => {
	const [direct, setDirect] = useState(true);

	return (
		<>
		  <Drawer open={true} transitionDuration={500} onClose={() => setOpenDrawer(false)} anchor="right">
			<ChatButton direct={direct} setDirect={setDirect}/>
			{
				direct
				? <FriendsList friendsData={friendsData} />
				: <List disablePadding>
					blablabla
				</List>
			}
		  </Drawer>
		</>
	  )
}

export default ChatDrawer
