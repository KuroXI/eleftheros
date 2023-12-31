export type ConfigCacheProps = {
	id: string;
	created_at: string;
	channelConfig: ChannelConfig;
	emojiConfig: EmojiConfig;
	voiceConfig: VoiceConfig;
	roleConfig: RoleConfig
};

export type ChannelConfig = {
	id: string;
	channelId: string;
	isEnable: boolean;
	isChannelCreateEnable: boolean;
	isChannelDeleteEnable: boolean;
	isChannelUpdateEnable: boolean;
};

export type EmojiConfig = {
	id: string;
	channelId: string;
	isEnable: boolean;
	isEmojiCreateEnable: boolean;
	isEmojiDeleteEnable: boolean;
	isEmojiUpdateEnable: boolean;
};

export type VoiceConfig = {
	id: string;
	channelId: string;
	isEnable: boolean;
	isVoiceJoinEnable: boolean;
	isVoiceLeftEnable: boolean;
	isVoiceChangeEnable: boolean;
};

export type RoleConfig = {
	id: string;
	channelId: string;
	isEnable: boolean;
	isRoleCreateEnable: boolean;
	isRoleDeleteEnable: boolean;
	isRoleUpdateEnable: boolean;
}