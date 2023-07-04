import React, { FunctionComponent, useContext, useReducer } from "react";
import { Box, DialogTitle, DialogActions, CircularProgress } from "@mui/material";
import { sessionSocket } from "../../../context/socket";
import { booleanSetState, DEFAULT_TOAST_MSG, getIdFromToken, stringSetState } from "../../../utils/constants";
import ErrorToast from "./ErrorToast";
import { MatchInfos, MatchInviteAnswer } from "../../../utils/match-interfaces";

const GAME_DECLINED = "It seems your friend is not available now :( ";

interface Props {
    setGameActive: booleanSetState;
    setIsHost: booleanSetState;
    setOpenDialog: booleanSetState;
	friendId: string;
	setMatchRoom: stringSetState;
	setMatchInfos: React.Dispatch<React.SetStateAction<MatchInfos>>,
}

const reducer = (state: {[key: string]: any}, newState : {[key: string]: any}) => {
	return { ...state, ...newState};
}

export const AskFriend: FunctionComponent<Props> = ({
	setGameActive, setIsHost, setOpenDialog, friendId, setMatchRoom, setMatchInfos
}) => {
	const [stateToast, setStateToast] = useReducer(reducer, {
		toastError: false,
		toastMessage: DEFAULT_TOAST_MSG,
	});
	
	sessionSocket.off('answerToGameRequest').on('answerToGameRequest', (answer: MatchInviteAnswer) => {
		const userId = getIdFromToken();
		const answerMatchInfos: MatchInfos = answer.matchInfos;
		const isNotMyMatch: boolean = !(answerMatchInfos.player1 == userId && answerMatchInfos.player2 == friendId);
		if (isNotMyMatch) {
			return ;
		}
		if (answer.accepted) {
			setMatchRoom(answerMatchInfos.id);
			setIsHost(true);
			setGameActive(true);
			setMatchInfos(answerMatchInfos);
		}
		else {
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
