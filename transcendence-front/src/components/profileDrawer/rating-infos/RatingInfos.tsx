import React from "react";
import { Box } from "@mui/material";
import { WinsAndLosses } from "./WinsAndLosses";
import { Rating } from "./Rating";

export const RatingInfos = ({userProfile} : {userProfile: {[key: string]: any}}) => {
	return (
		<Box display='flex' justifyContent='space-between' padding='4vh'>
			<Rating rating={userProfile.rating}/>
			<WinsAndLosses matchHistory={userProfile.matchHistory}/>
		</Box>
	)
}
