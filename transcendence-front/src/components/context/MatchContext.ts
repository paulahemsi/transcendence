import { createContext } from 'react';

interface MatchContextProps {
  matchInfos: { id: string; player1: string; player2: string };
  setMatchInfos: React.Dispatch<React.SetStateAction<{ id: string; player1: string; player2: string }>>;
}

export const MatchContext = createContext<MatchContextProps>({
  matchInfos: { id: '', player1: '', player2: '' },
  setMatchInfos: () => {},
});