import React, { FunctionComponent } from "react";
import DM from "./DM";
import GroupChannels from "./GroupChannels";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
	direct: boolean;
    groupsData: {[key: string]: any};
    setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
	activeChannel: number;
	friendsData: {[key: string]: any};
}

export const ChannelsList : FunctionComponent<Props> = ({ groupsData, setExtraContent, activeChannel, setActiveChannel, friendsData, direct }) => {
	return (
		<>
		{
			direct
			? 
			<DM
				friendsData={friendsData}
				setExtraContent={setExtraContent}
				setActiveChannel={setActiveChannel}
			/>
			:
			<GroupChannels
				setExtraContent={setExtraContent}
				activeChannel={activeChannel}
				setActiveChannel={setActiveChannel} 
				groupsData={groupsData}
			/>
		}
		</>
	)
}

export default ChannelsList
