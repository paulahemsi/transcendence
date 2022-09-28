import React, { FunctionComponent } from "react";
import { Box, Button, Typography } from "@mui/material";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    setOpenDrawer: booleanSetState;
	numberOfFriends: number;
}

const Friends : FunctionComponent<Props> = ({ setOpenDrawer, numberOfFriends }) => {
	
	const handleOpenDrawer = () => {
		setOpenDrawer(true)
	}

	return (
		<Button onClick={handleOpenDrawer}>
			<Typography sx={{ color: '#1E1E1E', textTransform: 'lowercase', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '4vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
						{`${numberOfFriends} friends`}
			</Typography>
		</Button>
	)
}

export const FriendshipInfo : FunctionComponent<Props> = ({ setOpenDrawer, numberOfFriends }) => {
	return (
		<Box alignSelf={"flex-end"} >
			<Friends setOpenDrawer={setOpenDrawer} numberOfFriends={numberOfFriends} />
		</Box>
	)
}

export default FriendshipInfo
