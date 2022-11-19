import React, { FunctionComponent, useReducer } from "react";
import { Box, DialogTitle, DialogActions, CircularProgress } from "@mui/material";
import { chatSocket } from "../../../context/socket";
import { booleanSetState, DEFAULT_TOAST_MSG } from "../../../utils/constants";
import ErrorToast from "./ErrorToast";

const GAME_DECLINED = "It seems your friend are not available now :( ";

interface Props {
    setGameActive: booleanSetState;
    setIsHost: booleanSetState;
    setOpenDialog: booleanSetState;
	activeChannel: number;
}

const reducer = (state: {[key: string]: any}, newState : {[key: string]: any}) => {
	return { ...state, ...newState};
}

export const AskFriend: FunctionComponent<Props> = ({ setGameActive, setIsHost, setOpenDialog, activeChannel }) => {
	const [stateToast, setStateToast] = useReducer(reducer, {
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});
	
	chatSocket.off('answerToGameRequest').on('answerToGameRequest', (answer) => {
		if (answer.room != activeChannel) {
			return ;
		}
		if (answer.accepted) {
			setIsHost(true);
			setGameActive(true);
		}
		else {
			console.log('declined')
			setStateToast({ toastError: true, toastMessage: GAME_DECLINED });
		}
	} )

	setTimeout(() =>{
		setStateToast({ toastError: true, toastMessage: GAME_DECLINED });
	}, 30000);

	return (
		<>
			<DialogTitle sx={{fontFamily: 'Orbitron'}}>
				Waiting for you opponent..
			</DialogTitle>
			<DialogActions sx={{justifyContent: "center", margin: '2vh'}}>
				<Box display="flex" justifyContent="center" alignItems="center">
					<CircularProgress />
				</Box>
			</DialogActions>
			<ErrorToast state={stateToast} setState={setStateToast} setOpenDialog={setOpenDialog} />
		</>
	)
}

export default AskFriend
