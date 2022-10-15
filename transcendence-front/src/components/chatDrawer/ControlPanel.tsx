import { Box } from "@mui/material";
import React, { FunctionComponent, useState } from "react";
import ChatAuxiliaryButton from "./ChatAuxiliaryButton";
import ChatButton from "./ChatButton";
import FriendsList from "./FriendsList";
import GroupsList from "./GroupsList";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
    setExtraContent: booleanSetState;
	setActiveChannel: numberSetState;
	friendsData: {[key: string]: any};
	activeChannel: number,
	groupsData:  {[key: string]: any},
}

export const ControlPanel : FunctionComponent<Props> = ({  setExtraContent, setActiveChannel, friendsData, activeChannel, groupsData }) => {

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
			/>
			{
				direct
				?
				<FriendsList
					friendsData={friendsData}
					setExtraContent={setExtraContent}
					setActiveChannel={setActiveChannel}
				/>
				:
				<GroupsList
					setExtraContent={setExtraContent}
					activeChannel={activeChannel}
					setActiveChannel={setActiveChannel} 
					groupsData={groupsData}
				/>
			}
		</Box>
	)
}

export default ControlPanel
