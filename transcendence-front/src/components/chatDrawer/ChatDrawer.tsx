import React, { FunctionComponent, useState } from "react";
import { Drawer } from '@mui/material';
import ChatButton from "./ChatButton";
import FriendsList from "./FriendsList";
import GroupsList from "./GroupsList";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    friendsData: {[key: string]: any};
    setOpenDrawer: booleanSetState;
}

export const ChatDrawer : FunctionComponent<Props> = ({ friendsData, setOpenDrawer }) => {
	const [direct, setDirect] = useState(true);

	return (
		<>
		  <Drawer open={true} transitionDuration={500} onClose={() => setOpenDrawer(false)} anchor="right" >
			<ChatButton direct={direct} setDirect={setDirect}/>
			{
				direct
				? <FriendsList friendsData={friendsData} />
				: <GroupsList />
			}
		  </Drawer>
		</>
	  )
}

export default ChatDrawer
