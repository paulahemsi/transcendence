import React, { FunctionComponent } from "react";
import DM from "./DM";
import GroupChannels from "./GroupChannels";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
	direct: boolean;
    setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
	activeChannel: number;
	friendsData: {[key: string]: any};
	groupsData: {[key: string]: any};
	loading: boolean;
}

export const ChannelsList : FunctionComponent<Props> = ({ setExtraContent, activeChannel, setActiveChannel, friendsData, direct, groupsData, loading }) => {

	if (direct) {
		return (
			<DM
				friendsData={friendsData}
				setExtraContent={setExtraContent}
				setActiveChannel={setActiveChannel}
			/>
		)
	}

	return (
		<GroupChannels
			setExtraContent={setExtraContent}
			activeChannel={activeChannel}
			setActiveChannel={setActiveChannel}
			groupsData={groupsData}
			loading={loading}
		/>
	)
}

export default ChannelsList
