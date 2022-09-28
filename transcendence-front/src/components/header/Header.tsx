import React, { FunctionComponent } from "react";
import { AppBar, Stack } from "@mui/material"
import ProfileInfo from "./ProfileInfo";
import FriendshipInfo from "./FriendshipInfo";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    userData: {[key: string]: any};
    setOpenDrawer: booleanSetState;
	numberOfFriends: number;
}


export const Header : FunctionComponent<Props> = ({ userData, setOpenDrawer, numberOfFriends }) => {
	return (
	<AppBar sx={{ height: '7vh', background: '#F5F5F5', position: 'fixed'}}>
		<Stack display='flex' flexDirection='row' alignItems="center" justifyContent="space-between" sx={{ paddingTop: '0.5vh', paddingLeft: '1.5vh', paddingBottom: '2vh' }}>
			<ProfileInfo userData={userData}/>
			<FriendshipInfo setOpenDrawer={setOpenDrawer} numberOfFriends={numberOfFriends} />
		</Stack>
	</AppBar>
	)
}

export default Header
