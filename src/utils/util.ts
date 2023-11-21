import { EmbedBuilder, User } from "discord.js";
import { EXECUTOR_NOT_FOUND } from "../lib/constant";

export const SetExecutor = (executor: User, embed: EmbedBuilder, type: string): EmbedBuilder => {
	embed.setAuthor({
		name: `${type} by: ${executor.tag}`,
		iconURL: executor.displayAvatarURL(),
	});

	embed.setFooter({ text: `User ID: ${executor.id}` });

	return embed;
};

export const ExecutorNotFound = (embed: EmbedBuilder, action: string, type: string): EmbedBuilder => {
	embed.addFields([
		{
			name: "\u200b",
			value: EXECUTOR_NOT_FOUND.replace("%a", action).replace("%s", type.toLowerCase()),
		},
	]);

	return embed;
};
