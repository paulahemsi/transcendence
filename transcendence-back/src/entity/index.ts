import { User } from './user.entity';
import { MatchHistory } from './match-history.entity';
import { Friendship } from './friendship.entity';
import { Channel } from './channel.entity';

const entities = [User, MatchHistory, Friendship, Channel];

export { User, MatchHistory, Friendship, Channel };
export default entities;
