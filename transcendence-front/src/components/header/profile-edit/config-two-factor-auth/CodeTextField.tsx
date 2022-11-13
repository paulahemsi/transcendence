import React from "react";
import { TextField } from "@mui/material";
import { Box } from "@mui/system";

export const CodeTextField = ({
	code,
	setState,
} : {
	code: string,
	setState: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>,
}) => {

	const handleChange = (event :  React.ChangeEvent<HTMLInputElement>) => {
		setState({ code: event.target.value});
	}
	
	const handleKeyDown= ( event :  React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault();
		}
	}

	return (
		<>
			<Box
				component="form"
				sx={{
					'& .MuiInputBase-input': { 
						m: 1,
						width: '7ch',
						fontFamily: 'Orbitron',
						fontWeight: 400,
						fontSize: '3vh',
					},
				}}
				autoComplete="off"
			>
				<TextField
					required
					id="outlined-basic"
					variant="outlined"
					type="number"
					value={code}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
				/>
			</Box>
		</>
	);
  }
