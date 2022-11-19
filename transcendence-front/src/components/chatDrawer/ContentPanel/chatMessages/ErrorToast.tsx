import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { booleanSetState, objectSetState } from "../../../utils/constants";

export const ErrorToast = ({state, setState, setOpenDialog} : {state: {[key: string]: any}, setState: objectSetState, setOpenDialog: booleanSetState}) => {
	
	const handleClose = () => {
		setState({ toastError: false });
		setOpenDialog(false);
	}
	
	return (
		<Snackbar
			open={state.toastError}
			autoHideDuration={6000}
			onClose={handleClose}
			anchorOrigin={{vertical: 'top', horizontal: 'right'}}
		>
			<Alert variant="filled" onClose={handleClose} severity="error" sx={{ width: '100%' }}>
				{state.toastMessage}
			</Alert>
		</Snackbar>
	)
}

export default ErrorToast
