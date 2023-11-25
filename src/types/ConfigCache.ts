export type ConfigCacheProps = {
	id: string;
	created_at: string;
	channelConfig: ChannelConfig;
	emojiConfig: EmojiConfig;
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
