import React, { FunctionComponent } from "react";
import FriendsList from "./FriendsList";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
    friendsData: {[key: string]: any};
    setExtraContent: booleanSetState;
	setActiveChannel: numberSetState;
}

export const DM : FunctionComponent<Props> = ({ friendsData, setExtraContent, setActiveChannel }) => {
	return (
		<FriendsList
			friendsData={friendsData}
			setExtraContent={setExtraContent}
			setActiveChannel={setActiveChannel}
		/>
	)
}

export default DM
