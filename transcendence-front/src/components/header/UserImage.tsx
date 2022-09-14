import React from "react";
import { Box } from "@mui/material";

export const UserImage = ({imageUrl} : {imageUrl: string}) => {
	return (
		<Box component='img' src={imageUrl} alt='Profile picture'
				sx={{
					height: '5vh',
					width: '5vh',
					borderRadius: 2,
					boxShadow: 1
				}}>
		</Box>
	)
}

export default UserImage
