import { User } from './user.entity';
import { MatchHistory } from './match-history.entity';
import { Friendship } from './friendship.entity';
import { Channel } from './channel.entity';
import { Message } from './message.entity';
import { ChannelType } from './channel-type.entity';
import { ChannelMember } from './channel-member.entity';

const entities = [User, MatchHistory, Friendship, Channel, Message, ChannelType, ChannelMember];

export { User, MatchHistory, Friendship, Channel, Message, ChannelType, ChannelMember };
export default entities;
