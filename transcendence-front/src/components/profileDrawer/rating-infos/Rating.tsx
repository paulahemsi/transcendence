import React from "react";
import { Box, Typography } from "@mui/material";

export const Rating = ({ rating } : { rating: number }) => {
	return (
			<Box display='flex' justifyContent='center' flexDirection='column'>
				<Typography alignSelf='flex-start' sx={{ color: '#1E1E1E', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '3vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
							Rating:
				</Typography>
				<Typography alignSelf='flex-end' sx={{ color: '#212980', fontFamily: 'Orbitron', fontWeight: 600, fontSize: '8vh', paddingLeft: '1.7vh', paddingRight: '1.7vh'}}>
							{rating}
				</Typography>
			</Box>
	)
}
