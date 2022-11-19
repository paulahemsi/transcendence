import React, { FunctionComponent } from "react";
import { booleanSetState, numberSetState } from "../../utils/constants";
import Loading from "../Loading";
import FriendsList from "./FriendsList";

interface Props {
    friendsData: {[key: string]: any};
    setExtraContent: booleanSetState;
	setActiveChannel: numberSetState;
	setChannelsAdminPanel: booleanSetState;
	loading: boolean;
	activeChannel: number;
}

export const DM : FunctionComponent<Props> = ({ friendsData, setExtraContent, setChannelsAdminPanel, activeChannel, setActiveChannel, loading }) => {

	if (loading) {
		return (
			<Loading />
		)
	}
	return (
		<FriendsList
			friendsData={friendsData}
			setChannelsAdminPanel={setChannelsAdminPanel}
			setExtraContent={setExtraContent}
			setActiveChannel={setActiveChannel}
			activeChannel={activeChannel}
		/>

	)
}

export default DM
