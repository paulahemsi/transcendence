import React, { FunctionComponent } from "react";
import { booleanSetState, numberSetState } from "../../utils/constants";
import DM from "./DM";
import GroupChannels from "./GroupChannels";

interface Props {
	direct: boolean;
    setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
	setChannelsAdminPanel: booleanSetState;
	activeChannel: number;
	friendsData: {[key: string]: any};
	groupsData: {[key: string]: any};
	loading: boolean;
}

export const ChannelsList : FunctionComponent<Props> = ({ setExtraContent, setChannelsAdminPanel, activeChannel, setActiveChannel, friendsData, direct, groupsData, loading }) => {

	if (direct) {
		return (
			<DM
				friendsData={friendsData}
				setExtraContent={setExtraContent}
				setActiveChannel={setActiveChannel}
				setChannelsAdminPanel={setChannelsAdminPanel}
				activeChannel={activeChannel}
				loading={loading}
			/>
		)
	}

	return (
		<GroupChannels
			setExtraContent={setExtraContent}
			setChannelsAdminPanel={setChannelsAdminPanel}
			activeChannel={activeChannel}
			setActiveChannel={setActiveChannel}
			groupsData={groupsData}
			loading={loading}
		/>
	)
}

export default ChannelsList
