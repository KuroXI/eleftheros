import { TextChannel } from "discord.js";

export const ChannelUpdateText = (oldChannel: TextChannel, newChannel: TextChannel) => {
	const resultOld: string[] = [];
	const resultNew: string[] = [];

	if (oldChannel.nsfw !== newChannel.nsfw) {
		resultOld.push(`Age Restrict: ${oldChannel.nsfw}`);
		resultNew.push(`Age Restrict: ${newChannel.nsfw}`);
	}

	if (oldChannel.rateLimitPerUser != newChannel.rateLimitPerUser) {
		resultOld.push(`Slow mode: ${oldChannel.rateLimitPerUser} second(s)`);
		resultNew.push(`Slow mode: ${newChannel.rateLimitPerUser} second(s)`);
	}

	if (oldChannel.topic !== newChannel.topic) {
		const oldTopic = oldChannel.topic ? oldChannel.topic : "N/A";
		resultOld.join("\n").length + oldChannel.topic!.length >= 1003
			? resultOld.push(`Topic: ${oldChannel.topic!.substring(0, 1003 - resultOld.join("\n").length) + "..."}`)
			: resultOld.push(`Topic: ${oldTopic}`);

		const newTopic = newChannel.topic ? newChannel.topic : "N/A";
		resultNew.join("\n").length + newChannel.topic!.length >= 1003
			? resultNew.push(`Topic: ${newChannel.topic!.substring(0, 1003 - resultNew.join("\n").length) + "..."}`)
			: resultNew.push(`Topic: ${newTopic}`);
	}

	return { resultOld, resultNew };
};
