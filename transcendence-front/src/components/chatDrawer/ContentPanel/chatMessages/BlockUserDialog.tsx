import React, { FunctionComponent, useReducer } from "react"
import { Button, DialogActions, DialogTitle } from "@mui/material"
import ErrorToast from "../../../utils/ErrorToast";
import { DEFAULT_TOAST_MSG } from "../../../utils/constants";

type booleanSetState = React.Dispatch<React.SetStateAction<boolean>>

interface Props {
	setOpenDialog: booleanSetState;
	friendId: string
}

const reducer = (state: {[key: string]: any}, newState : {[key: string]: any}) => {
	return { ...state, ...newState};
}

export const BlockUserDialog : FunctionComponent<Props> = ({ setOpenDialog, friendId }) => {
	const [state, setState] = useReducer(reducer, {
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});

	const handleBlock = () => {
		console.log('block')
	}

	return (
		<>
		<DialogTitle sx={{fontFamily: 'Orbitron'}}>
			This action cannot be undone. Are you sure?
		</DialogTitle>
		<DialogActions>
		<Button
			onClick={() => setOpenDialog(false)}
			sx={{fontFamily: 'Orbitron'}}
		>
			Cancel
		</Button>
		<Button
			variant="contained"
			onClick={handleBlock}
			sx={{fontFamily: 'Orbitron'}}
		>
			Block
		</Button>
		</DialogActions>
		<ErrorToast state={state} setState={setState}/>
	</>
	)
}

export default BlockUserDialog
