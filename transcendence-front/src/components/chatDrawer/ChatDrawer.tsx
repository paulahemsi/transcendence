import React, { FunctionComponent, useState } from "react";
import { Drawer, Box, Toolbar } from '@mui/material';
import ChatButton from "./ChatButton";
import FriendsList from "./FriendsList";
import GroupsList from "./GroupsList";
import ChatAuxiliaryButton from "./ChatAuxiliaryButton";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    friendsData: {[key: string]: any};
    setOpenDrawer: booleanSetState;
}

export const ChatDrawer : FunctionComponent<Props> = ({ friendsData, setOpenDrawer }) => {
	const [direct, setDirect] = useState(true);
	const [extraContent, setExtraContent] = useState(false);

	return (
		<>
		  <Drawer open={true} transitionDuration={500} onClose={() => setOpenDrawer(false)} anchor="right" >
			<Box paddingTop='7vh' display="flex">
				<Box>
					{
						extraContent &&
						(<Box bgcolor="blue" sx={{minWidth: '50vh'}}>
							aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
						</Box>)
					}
				</Box>
				<Box boxShadow="20px 20px 50px grey" height="100vh">
					<ChatButton direct={direct} setDirect={setDirect}setExtraContent={setExtraContent}/>
					<ChatAuxiliaryButton direct={direct} setExtraContent={setExtraContent}/>
					{
						direct
						? <FriendsList friendsData={friendsData} setExtraContent={setExtraContent}/>
						: <GroupsList setExtraContent={setExtraContent} />
					}
				</Box>
			</Box>
		  </Drawer>
		</>
	  )
}

export default ChatDrawer
