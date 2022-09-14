import React from "react";
import { AppBar, Stack } from "@mui/material"
import ProfileInfo from "./ProfileInfo";
import FriendshipInfo from "./FriendshipInfo";

export const Header = ({ userData } : {[key: string]: any}) => {
	return (
	<AppBar sx={{ height: '7vh', background: '#F5F5F5'}}>
		<Stack display='flex' flexDirection='row' alignItems="center" justifyContent="space-between" sx={{ paddingTop: '0.5vh', paddingLeft: '1.5vh', paddingBottom: '2vh' }}>
			<ProfileInfo userData={userData}/>
			<FriendshipInfo />
		</Stack>
	</AppBar>
	)
}

export default Header
