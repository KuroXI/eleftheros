export const GuildConfigQuery = `
	id,
	created_at,
	channelConfig(id, channelId, isEnable, isChannelCreateEnable, isChannelDeleteEnable, isChannelUpdateEnable),
	emojiConfig(id, channelId, isEnable, isEmojiCreateEnable, isEmojiDeleteEnable, isEmojiUpdateEnable)
`;
