import React from "react";
import { Box, Typography } from "@mui/material";
import { typographyCSS } from "../../../utils/constants";

const noMessages = "it's so quiet in here ......"

export const NoMessages = () => {
	return (
		<Box 
			display="flex"
			alignItems="center"
			flexDirection="column"
			flexWrap="wrap"
			justifyContent="center"
			sx={{width: '100%',  height: '50vh'}}
		>
			<Typography
				sx={typographyCSS}
			>
				{noMessages}
			</Typography>
		</Box>
	)
}

export default NoMessages
