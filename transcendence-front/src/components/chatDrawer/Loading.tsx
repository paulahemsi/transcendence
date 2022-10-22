import React from "react";
import { CircularProgress, Box } from "@mui/material";

export const Loading = () => {
	return (
		<Box height="50vh" display="flex" justifyContent="center" alignItems="center">
			<CircularProgress size="10vh"/>
		</Box>
	)
}

export default Loading
