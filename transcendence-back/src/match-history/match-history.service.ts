import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistory } from 'src/entity';
import { Repository } from 'typeorm';

export class matchInfos {
  opponent: string;
  userScore: number;
  opponentScore: number;
  isWinner: boolean;
}

@Injectable()
export class MatchHistoryService {
	constructor(
		@InjectRepository(MatchHistory) private readonly matchHistoryRepository: Repository<MatchHistory>,
	) {}

	isPlayer1(id: string, match: MatchHistory) : boolean {
		return match.player1.id === id;
	}
	
	setOpponentsName(isUserPlayer1: boolean, match: MatchHistory) : string {
		if (isUserPlayer1) {
		  return match.player2.username;
		}
		return match.player1.username;
	}
	
	setUserScore(isUserPlayer1: boolean, match: MatchHistory) : number {
		if (isUserPlayer1) {
		  return (match.player1Score);
		}
		return match.player2Score;
	}
	
	setOpponentScore(isUserPlayer1: boolean, match: MatchHistory) : number {
		if (isUserPlayer1) {
		  return match.player2Score;
		}
		return match.player1Score;
	}
	
	isUserTheWinner(matchInfo: matchInfos) : boolean {
		return matchInfo.userScore > matchInfo.opponentScore;
	}
	
	executeMatchHistoryQuery(id: string) : Promise<MatchHistory[]> {
		return this.matchHistoryRepository.find({
		  select: {
			player1Score: true,
			player2Score: true,
		},
		  relations: {
			player1: true,
			player2: true,
		},
		  where: [
			{ player1: { id: id } },
			{ player2: { id: id } },
		  ]
		});
	}
	
	async buildMatchHistory(id: string) {
		
		const matches: Awaited<Promise<MatchHistory[]>> = await this.executeMatchHistoryQuery(id);
		
		let matchHistory: Array<matchInfos> = [];
		
		matches.map( (match) => {
			let matchInfo : matchInfos = new matchInfos();
			let isUserPlayer1 : boolean = this.isPlayer1(id, match);
	
			matchInfo.opponent = this.setOpponentsName(isUserPlayer1, match);
			matchInfo.userScore = this.setUserScore(isUserPlayer1, match);
			matchInfo.opponentScore = this.setOpponentScore(isUserPlayer1, match);
			matchInfo.isWinner = this.isUserTheWinner(matchInfo);
	
			matchHistory.push(matchInfo);
		  }
		)
		
		return matchHistory;
	}
	
}
