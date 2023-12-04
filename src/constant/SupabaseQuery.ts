export const GuildConfigQuery = `
	id,
	created_at,
	channelConfig(id, channelId, isEnable, isChannelCreateEnable, isChannelDeleteEnable, isChannelUpdateEnable),
	emojiConfig(id, channelId, isEnable, isEmojiCreateEnable, isEmojiDeleteEnable, isEmojiUpdateEnable),
	voiceConfig(id, channelId, isEnable, isVoiceJoinEnable, isVoiceLeftEnable, isVoiceChangeEnable),
	roleConfig(id, channelId, isEnable, isRoleCreateEnable, isRoleDeleteEnable, isRoleUpdateEnable)
`;
