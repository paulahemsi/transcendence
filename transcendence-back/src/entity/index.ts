import { User } from './user.entity';
import { MatchHistory } from './match-history.entity';
import { Friendship } from './friendship.entity';
import { Channel } from './channel.entity';
import { Message } from './message.entity';
import { ChannelType } from './channel-type.entity';
import { ChannelMember } from './channel-member.entity';
import { ChannelAdmin } from './channel-admin.entity';

const entities = [
  User,
  MatchHistory,
  Friendship,
  Channel,
  Message,
  ChannelType,
  ChannelMember,
  ChannelAdmin,
];

export {
  User,
  MatchHistory,
  Friendship,
  Channel,
  Message,
  ChannelType,
  ChannelMember,
  ChannelAdmin,
};
export default entities;
