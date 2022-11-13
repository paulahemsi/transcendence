import React from "react";
import { Divider, List, ListItem, Typography } from "@mui/material";
import { MatchDetails } from "./MatchDetails";

export const MATCH_HISTORY_CSS = {
	maxHeight: '25%',
	width: '100%',
	position: 'relative',
	overflow: 'auto',
	overflowY: "auto",
	margin: 0,
	padding: 0,
	listStyle: "none",
	'&::-webkit-scrollbar': {
	width: '0.4em',
	borderRadius: 5,
	},
	'&::-webkit-scrollbar-track': {
		boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
		webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
		borderRadius: 5,
	},
	'&::-webkit-scrollbar-thumb': {
		backgroundColor: '#212980',
		outline: 'none',
		borderRadius: 5,
	}
}

export const MatchHistory = ({userProfile} : {userProfile: {[key: string]: any}}) => {
	const matchHistory = [] as JSX.Element[];

	if (userProfile.matchHistory) {
		userProfile.matchHistory.forEach((element: {[key: string]: any}, index: number) => {
			matchHistory.push(
			<ListItem key={index} sx={{paddingLeft: '15%', paddingTop: '3vh'}}> <MatchDetails opponentName={element.opponentName} opponentScore={element.opponentScore} userName={userProfile.name} userScore={element.userScore} userImage={userProfile.image_url} opponentImage={element.opponentImage}/> </ListItem>
			);
		})
	}

	return (
		<>
			<Divider variant='middle' sx={{ borderBottomWidth: 3, margin: 2,  border: "1px solid #B998FF" }} />
			<Typography alignSelf='flex-start' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh', paddingBottom: '1.7vh'}}>
			match history:
			</Typography>
			<List sx={MATCH_HISTORY_CSS} subheader={<li />}>
				{matchHistory}
			</List>
		</>
	)
}
