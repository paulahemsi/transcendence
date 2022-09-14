import React from "react";
import { AppBar, Stack } from "@mui/material"
import ProfileInfo from "./ProfileInfo";

export const Header = ({ userData } : {[key: string]: any}) => {
	return (
	<AppBar sx={{ height: '7vh', background: '#F5F5F5'}}>
		<Stack display='flex' flexDirection='row' alignItems="center" sx={{ paddingTop: '0.5vh', paddingLeft: '1.5vh', paddingBottom: '2vh' }}>
			<ProfileInfo userData={userData}/>
		</Stack>
	</AppBar>
	)
}

export default Header
