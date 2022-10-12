import React from "react";
import { Box } from "@mui/material";

export const UserStatus = ({statusColor} : {statusColor : string}) => {
	return (
		<Box
			sx={{ 
				backgroundColor: statusColor,
				height: '3vh',
				width: '3vh',
				borderRadius: 50,
				boxShadow: 1,
				alignSelf: 'center'}}>
		</Box>
	)
}
