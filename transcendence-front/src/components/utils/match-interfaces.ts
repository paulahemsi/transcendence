export type matchInfosSetState = React.Dispatch<React.SetStateAction<MatchInfos>>

export interface MatchInfos {
  id: string;
  player1: string;
  player2: string;
}

export interface MatchInviteAnswer {
  matchInfos: MatchInfos;
  accepted: boolean;
}