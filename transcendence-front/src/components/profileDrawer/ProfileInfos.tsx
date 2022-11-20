import React from "react";
import { MatchHistory } from "./match-history/MatchHistory";
import { MainInfos } from "./main-infos/MainInfos";

export const ProfileInfos = ({userProfile} : {userProfile: {[key: string]: any}}) => {
	return (
		<>
			<MainInfos userProfile={userProfile}/>
			<MatchHistory userProfile={userProfile}/>
		</>
		
	)
}
