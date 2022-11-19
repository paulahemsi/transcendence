import { AppBar, Box } from "@mui/material";
import React from "react";
import { booleanSetState } from "../utils/constants";
import LogoutButton from "./LogoutButton";

export const Footer = ({ setLoggedIn } : { setLoggedIn: booleanSetState}) => {
	return (
	<AppBar position="fixed" sx={{ height: '7vh', background: '#F5F5F5', top: 'auto', bottom: 0, zIndex: 1280 }}>
		<Box display="flex" justifyContent="right" sx={{ paddingTop: '1vh', paddingRight: '1vh', paddingBottom: '1vh' }}>
			<LogoutButton setLoggedIn={setLoggedIn}/>
		</Box>
	</AppBar>
		
	)
}
