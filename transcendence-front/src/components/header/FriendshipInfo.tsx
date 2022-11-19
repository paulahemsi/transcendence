import React, { FunctionComponent } from "react";
import { Box, Button, Typography } from "@mui/material";
import { booleanSetState } from "../utils/constants";

interface Props {
    setOpenDrawer: booleanSetState;
}

const Friends : FunctionComponent<Props> = ({ setOpenDrawer }) => {
	
	const handleOpenDrawer = () => {
		setOpenDrawer(true)
	}

	return (
		<Button onClick={handleOpenDrawer}>
			<Typography sx={{ color: '#1E1E1E', textTransform: 'lowercase', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
				Chat
			</Typography>
		</Button>
	)
}

export const FriendshipInfo : FunctionComponent<Props> = ({ setOpenDrawer }) => {
	return (
		<Box alignSelf={"flex-end"} >
			<Friends setOpenDrawer={setOpenDrawer} />
		</Box>
	)
}

export default FriendshipInfo
