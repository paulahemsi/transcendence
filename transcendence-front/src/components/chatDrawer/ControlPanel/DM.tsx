import React, { FunctionComponent } from "react";
import Loading from "../Loading";
import FriendsList from "./FriendsList";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

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
