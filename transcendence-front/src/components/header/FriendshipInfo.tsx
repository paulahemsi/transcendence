import React from "react";
import { Box, Button, Typography } from "@mui/material";

const handleOpenDrawer = () => {
	console.log("click")
}

const Friends = () => {
	return (
		<Button onClick={handleOpenDrawer}>
			<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
						2 friends
			</Typography>
		</Button>
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
