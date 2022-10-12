import React from "react";
import { Skeleton, Stack } from "@mui/material";

export const Loading = () => {
	return (
		<Stack spacing={1}>
			<Skeleton variant="rectangular" width='20vh' height='20vh' />
			<Skeleton variant="rectangular" width='80vh' height='15vh' />
			<Skeleton variant="text" sx={{ fontSize: '3vh' }} />
		</Stack>
	)
}
