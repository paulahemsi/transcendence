import React, { FunctionComponent } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, } from "@mui/material"

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
    open: boolean;
    setOpen: booleanSetState;
	userData: { [key: string]: any; };
	setUserData: React.Dispatch<React.SetStateAction<{ [key: string]: any; }>>;
}

export const DisableTwoFactorAuthDialog : FunctionComponent<Props> = ({ open, setOpen, userData, setUserData }) => {

	const handleDisable = () => {
		setOpen(false);
	}
	
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Dialog open={open} fullWidth maxWidth="sm" onClose={handleClose}>
				<DialogTitle sx={{fontFamily: 'Orbitron'}}>
					Configure Two-Factor Authentication
				</DialogTitle>
				<DialogContent>
				</DialogContent>
				<DialogActions>
				<Button
					onClick={() => setOpen(false)}
					sx={{fontFamily: 'Orbitron'}}
				>
					Cancel
				</Button>
				<Button
					variant="contained"
					onClick={handleDisable}
					sx={{fontFamily: 'Orbitron'}}
				>
					Disable
				</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}