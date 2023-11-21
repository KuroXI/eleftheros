export type ConfigCacheProps = {
  id: string;
  created_at: string;
  guildChannelConfig: GuildChannelConfig;
};

export type GuildChannelConfig = {
  id: string;
  channelId: string;
  isEnable: boolean;
  isChannelCreateEnable: boolean;
  isChannelDeleteEnable: boolean;
  isChannelUpdateEnable: boolean;
};
