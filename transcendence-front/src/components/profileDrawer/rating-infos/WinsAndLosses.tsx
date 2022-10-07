import React from "react";
import { Box, Typography } from "@mui/material";

type matchInfos = {
	opponentName: string;
	userScore: number;
	opponentScore: number;
	isWinner: boolean;
}

const getWinsAndLosses = (matchHistory : Array<matchInfos>) => {
	let wins : number = 0;
	let losses : number = 0;
	if (matchHistory) {
		matchHistory.forEach(match => {
			if (match.isWinner) {
				wins += 1;
			}
		})
		losses = matchHistory.length - wins;
	}
	return { wins, losses };
}

export const WinsAndLosses = ({ matchHistory } : { matchHistory : Array<matchInfos> }) => {
	const { wins, losses } = getWinsAndLosses(matchHistory);

	return (
		<Box display='flex' flexDirection='column' justifyContent='center'>
			<Typography alignSelf='flex-end' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
				wins: {wins}
			</Typography>
			<Typography alignSelf='flex-end' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
				losses: {losses}
			</Typography>
		</Box>
	)
}
