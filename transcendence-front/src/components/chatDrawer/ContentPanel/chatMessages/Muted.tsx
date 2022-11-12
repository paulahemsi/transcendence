import React from "react";
import { Box, Typography } from "@mui/material";
import { messagesBorderCSS, typographyCSS } from "../../../utils/constants";

const muted = "ooops! You're muted... Wait for a while..."

export const Muted = () => {
	return (
		<Box
			display="flex" 
			flexDirection="column"
			justifyContent="space-between"
			bgcolor="blue"
			padding="3vh"
			sx={{minWidth: '50vw', height: '80vh', background: '#F5F5F5',}}
		>
			<Box sx={messagesBorderCSS}>
				<Box 
					display="flex"
					alignItems="center"
					flexDirection="column"
					flexWrap="wrap"
					justifyContent="center"
					sx={{width: '100%',  height: '50vh'}}
				>
					<Typography sx={typographyCSS}>
						{muted}
					</Typography>
				</Box>
			</Box>
		</Box>
	)
}

export default Muted
