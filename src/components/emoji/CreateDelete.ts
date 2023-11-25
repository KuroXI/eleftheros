import { AuditLogEvent, Client, EmbedBuilder, GuildAuditLogsEntry, GuildEmoji, TextChannel } from "discord.js";
import { ConfigCacheProps } from "../../types/ConfigCache";
import { ExecutorNotFound, SetExecutor } from "../../utils/util";
import { CodeBlock } from "../../utils/codeBlock";

export const CreateDelete = async (
	client: Client,
	emoji: GuildEmoji,
	embed: EmbedBuilder,
	audit:
		| GuildAuditLogsEntry<
				AuditLogEvent.EmojiCreate | AuditLogEvent.EmojiDelete,
				"Create" | "Delete",
				"Emoji",
				AuditLogEvent.EmojiCreate | AuditLogEvent.EmojiDelete
		  >
		| undefined,
	config: ConfigCacheProps,
	type: "CREATE" | "DELETE",
) => {
	const resultData: string[] = [];

	resultData.push(`Name: ${emoji.name}`);
	resultData.push(`ID: ${emoji.id}`);
	resultData.push(`Animated: ${emoji.animated}`);

	if (audit?.executor) {
		SetExecutor(audit.executor, embed, type === "CREATE" ? "Created" : "Deleted");
	} else {
		ExecutorNotFound(embed, type === "CREATE" ? "created" : "deleted", "emoji");
	}

	embed.setDescription(CodeBlock(resultData.join("\n")));

	const configChannel = client.channels.cache.get(config.emojiConfig.channelId) as TextChannel;
	await configChannel.send({ embeds: [embed] });
};
