import { User } from './user.entity';
import { MatchHistory } from './match-history.entity';
import { Friendship } from './friendship.entity';
import { Channel } from './channel.entity';
import { Message } from './message.entity';
import { ChannelType } from './channel-type.entity';
import { ChannelMember } from './channel-member.entity';
import { ChannelAdmin } from './channel-admin.entity';
import { ConnectedUser } from './connected-user.entity';

const entities = [
  User,
  MatchHistory,
  Friendship,
  Channel,
  Message,
  ChannelType,
  ChannelMember,
  ChannelAdmin,
  ConnectedUser,
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
  ConnectedUser,
};
export default entities;
