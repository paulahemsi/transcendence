import React, { FunctionComponent } from "react";
import Loading from "../Loading";
import GroupsList from "./GroupsList";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>
type numberSetState = React.Dispatch<React.SetStateAction<number>>

interface Props {
    groupsData: {[key: string]: any};
    setExtraContent : booleanSetState;
	setActiveChannel: numberSetState;
	activeChannel: number;
}

export const GroupChannels : FunctionComponent<Props> = ({ groupsData, setExtraContent, activeChannel, setActiveChannel }) => {
	return (
		<>
		{
			groupsData[0]
			?
				<GroupsList
					setExtraContent={setExtraContent}
					activeChannel={activeChannel}
					setActiveChannel={setActiveChannel} 
					groupsData={groupsData}
				/>
			:
				<Loading />
		}
		</>
	)
}

export default GroupChannels
