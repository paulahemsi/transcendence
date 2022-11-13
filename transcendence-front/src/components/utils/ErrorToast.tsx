import { Alert, Snackbar } from "@mui/material";
import React from "react";

type objectSetState = React.Dispatch<React.SetStateAction<{[key: string]: any}>>

export const ErrorToast = ({state, setState} : {state: {[key: string]: any}, setState: objectSetState}) => {
	return (
		<Snackbar
			open={state.toastError}
			autoHideDuration={6000}
			onClose={() => setState({ toastError: false })}
			anchorOrigin={{vertical: 'top', horizontal: 'right'}}
		>
			<Alert variant="filled" onClose={() => setState({ toastError: false })} severity="error" sx={{ width: '100%' }}>
				{state.toastMessage}
			</Alert>
		</Snackbar>
	)
}

export default ErrorToast;
