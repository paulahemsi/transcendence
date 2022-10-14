import React, { FunctionComponent, useState } from "react";
import { Drawer, Box } from '@mui/material';
import ChatButton from "./ChatButton";
import FriendsList from "./FriendsList";
import GroupsList from "./GroupsList";
import ChatAuxiliaryButton from "./ChatAuxiliaryButton";
import ExtraContent from "./ExtraContent";

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
		  <Drawer open={true} transitionDuration={500} onClose={() => setOpenDrawer(false)} anchor="right" PaperProps={{
			sx: { opacity: 0.95, backgroundColor: "#F5F5F5" }
  			}} >
			<Box paddingTop='7vh' display="flex" sx={{ minWidth: '30vw' }}>
				<Box>
					{
						extraContent &&
						<ExtraContent/>
					}
				</Box>
				<Box boxShadow="20px 20px 50px grey" height="86vh">
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
