import React from "react";
import { AppBar } from "@mui/material"
import ProfileInfo from "./ProfileInfo";

export const Header = ({ userData } : {[key: string]: any}) => {
	return (
		<AppBar sx={{ height: '7vh', background: '#F5F5F5'}}>
			<ProfileInfo userData={userData}/>
		</AppBar>
	)
}

export default Header
