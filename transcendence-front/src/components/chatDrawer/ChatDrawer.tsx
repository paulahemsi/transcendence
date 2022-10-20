import React, { FunctionComponent, useState, useEffect } from "react";
import { Drawer, Box } from '@mui/material';
import ExtraContent from "./ContentPanel/ExtraContent";
import ControlPanel from "./ControlPanel/ControlPanel";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

interface Props {
    friendsData: {[key: string]: any};
    setOpenDrawer: booleanSetState;
	setFriendsData: objectSetState;
}

export const ChatDrawer : FunctionComponent<Props> = ({ friendsData, setOpenDrawer, setFriendsData }) => {
	const [extraContent, setExtraContent] = useState(false);
	const [activeChannel, setActiveChannel] = useState(0)

	return (
		<>
		  <Drawer
		  	open={true}
			transitionDuration={500}
			onClose={() => setOpenDrawer(false)}
			anchor="right"
			PaperProps={{
			sx: { opacity: 0.95, backgroundColor: "#F5F5F5" }
  			}} 
		>
			<Box paddingTop='7vh' display="flex" sx={{ minWidth: '30vw' }}>
				<Box>
					{
						extraContent &&
						<ExtraContent activeChannel={activeChannel} />
					}
				</Box>
				<ControlPanel 
					setExtraContent={setExtraContent}
					setActiveChannel={setActiveChannel}
					friendsData={friendsData}
					activeChannel={activeChannel}
					setFriendsData={setFriendsData}
				/>
			</Box>
		  </Drawer>
		</>
	  )
}

export default ChatDrawer
