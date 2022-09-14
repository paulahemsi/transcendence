import { Box, Typography } from "@mui/material";
import React from "react";

const Friends = () => {
	return (
		<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
					friends
		</Typography>
	)
}

export const FriendshipInfo = () => {
	return (
		<Box alignSelf={"flex-end"} >
			<Friends />
		</Box>
	)
}

export default FriendshipInfo
