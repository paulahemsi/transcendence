import React, { FunctionComponent, useEffect, useState } from "react";
import Loading from "../Loading";
import GroupsList from "./GroupsList";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
    setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
	setChannelsAdminPanel: booleanSetState;
	groupsData: {[key: string]: any};
	loading: boolean;
	activeChannel: number;
}

export const GroupChannels : FunctionComponent<Props> = ({ setExtraContent, setChannelsAdminPanel, activeChannel, setActiveChannel, groupsData, loading }) => {

	if (loading) {
		return (
			<Loading />
		)
	}
	return (
		<GroupsList
			setExtraContent={setExtraContent}
			setChannelsAdminPanel={setChannelsAdminPanel}
			activeChannel={activeChannel}
			setActiveChannel={setActiveChannel} 
			groupsData={groupsData}
		/>
	)
}

export default GroupChannels
