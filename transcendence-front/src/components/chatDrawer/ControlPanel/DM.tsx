import React, { FunctionComponent } from "react";
import Loading from "../Loading";
import FriendsList from "./FriendsList";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
    friendsData: {[key: string]: any};
    setExtraContent: booleanSetState;
	setActiveChannel: numberSetState;
	loading: boolean;
}

export const DM : FunctionComponent<Props> = ({ friendsData, setExtraContent, setActiveChannel, loading }) => {

	if (loading) {
		return (
			<Loading />
		)
	}
	return (
		<FriendsList
			friendsData={friendsData}
			setExtraContent={setExtraContent}
			setActiveChannel={setActiveChannel}
		/>

	)
}

export default DM
