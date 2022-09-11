import { User } from './user.entity';
import { MatchHistory } from './match-history.entity';
import { Friendship } from './friendship.entity';
import { Channel } from './channel.entity';
import { Message } from './message.entity';
import { ChannelType } from './channel-type.entity';

const entities = [User, MatchHistory, Friendship, Channel, Message, ChannelType];

export { User, MatchHistory, Friendship, Channel, Message, ChannelType };
export default entities;
