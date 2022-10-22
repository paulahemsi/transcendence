import { Box } from "@mui/material";
import React, { FunctionComponent, useState } from "react";
import ChannelsList from "./ChannelsList";
import ChatAuxiliaryButton from "./ChatAuxiliaryButton";
import ChatButton from "./ChatButton";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>
type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

interface Props {
    setExtraContent: booleanSetState;
	setActiveChannel: numberSetState;
	setGroupsData: objectSetState;
	friendsData: {[key: string]: any};
	activeChannel: number,
	groupsData:  {[key: string]: any},
}

export const ControlPanel : FunctionComponent<Props> = ({  setExtraContent, setActiveChannel, setGroupsData, friendsData, activeChannel, groupsData }) => {

	const [direct, setDirect] = useState(true);

	return (
		<Box boxShadow="20px 20px 50px grey" height="86vh">
			<ChatButton
				direct={direct}
				setDirect={setDirect}
				setExtraContent={setExtraContent}
				setActiveChannel={setActiveChannel}
			/>
			<ChatAuxiliaryButton
				direct={direct}
				setExtraContent={setExtraContent}
				setActiveChannel={setActiveChannel}
				setGroupsData={setGroupsData}
			/>
			<ChannelsList
				direct={direct}
				setExtraContent={setExtraContent}
				activeChannel={activeChannel}
				setActiveChannel={setActiveChannel} 
				groupsData={groupsData}
				friendsData={friendsData}
			/>
		</Box>
	)
}

export default ControlPanel
