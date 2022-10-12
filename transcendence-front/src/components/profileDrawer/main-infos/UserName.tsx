import React from "react";
import { Typography } from "@mui/material";

export const UserName = ({userName} : {userName : string}) => {
	return (
		<Typography sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '7vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
					{userName}
		</Typography>
	)
}
