import React from "react";
import { Box, Typography } from "@mui/material";

const noGroups = "you are not part of any group chats :("

const joinOne =	"start or join one!"

export const GroupsList = () => {

	return (
		<Box display="flex" alignItems="center" flexDirection="column" flexWrap="wrap" justifyContent="center" sx={{width: '100%', height: '100%'}}>
			<Typography sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', padding: '1.7vh'}}>
						{noGroups}
			</Typography>
			<Typography sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', padding: '1.7vh'}}>
						{joinOne}
			</Typography>
		</Box>
	)
}

export default GroupsList
