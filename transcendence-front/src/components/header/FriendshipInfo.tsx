import React from "react";
import { Box, Button, Typography } from "@mui/material";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

const Friends = ({ setOpenDrawer } : { setOpenDrawer: booleanSetState }) => {
	
	const handleOpenDrawer = () => {
		setOpenDrawer(true)
	}

	return (
		<Button onClick={handleOpenDrawer}>
			<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
						2 friends
			</Typography>
		</Button>
	)
}

export const FriendshipInfo = ({ setOpenDrawer } : { setOpenDrawer: booleanSetState }) => {
	return (
		<Box alignSelf={"flex-end"} >
			<Friends setOpenDrawer={setOpenDrawer}/>
		</Box>
	)
}

export default FriendshipInfo
