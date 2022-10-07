import React from "react";
import { Box, Typography } from "@mui/material";

export const UserImage = ({imageUrl} : {imageUrl: string}) => {
	return (
		<Box component='img' src={imageUrl} alt='Profile picture'
				sx={{
					height: '20vh',
					width: '20vh',
					borderRadius: 2,
					boxShadow: 1
				}}>
		</Box>
	)
}
