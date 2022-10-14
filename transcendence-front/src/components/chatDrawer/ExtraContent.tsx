import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

export const ExtraContent = () => {
	return (
		<Box display="flex" flexDirection="column" bgcolor="blue" margin='2vh' padding="3vh" sx={{minWidth: '50vw', height: '74vh',
			background: '#F5F5F5',
			border: 2,
			borderColor: '#212980',
			borderRadius: 3,
			boxShadow: 5
			}}>
			<Box sx={{ minWidth: '50vw', height: '70vh' }}>
				
			</Box>
			<Box>
				<TextField
					autoFocus
					margin="dense"
					id="name"
					type="email"
					sx={{ width: '50vw' }}
					variant="standard"
					// value={username}
					// onKeyDown={keyDownHandler}
					// onChange={handleChange}
				/>
			</Box>
		</Box>
	)
}

export default ExtraContent
