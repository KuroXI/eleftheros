import { AuditLogEvent, Client, EmbedBuilder, GuildAuditLogsEntry, GuildChannel, TextChannel } from "discord.js";
import { ConfigCacheProps } from "../../types/ConfigCache";
import { ExecutorNotFound, SetExecutor } from "../../utils/util";
import { ChannelType } from "../../constant/ChannelType";
import { CodeBlock } from "../../utils/codeBlock";

export const CreateDelete = async (
	client: Client,
	channel: GuildChannel,
	embed: EmbedBuilder,
	audit:
		| GuildAuditLogsEntry<
				AuditLogEvent.ChannelCreate | AuditLogEvent.ChannelDelete,
				"Create" | "Delete",
				"Channel",
				AuditLogEvent.ChannelCreate | AuditLogEvent.ChannelDelete
		  >
		| undefined,
	config: ConfigCacheProps,
	type: "CREATE" | "DELETE",
) => {
	const resultData: string[] = [];

	resultData.push(`Channel Name: ${channel.name}`);
	resultData.push(`Channel ID: ${channel.id}`);

	if (ChannelType[channel.type] !== "Category" && channel.parent) {
		resultData.push(`Parent Name: ${channel.parent.name}`);
		resultData.push(`Parent ID: ${channel.parent.id}`);
	}

	if (audit?.executor) {
		SetExecutor(audit.executor, embed, type === "CREATE" ? "Created" : "Deleted");
	} else {
		ExecutorNotFound(embed, type === "CREATE" ? "created" : "deleted", ChannelType[channel.type]! + " channel");
	}

	embed.setDescription(CodeBlock(resultData.join("\n")));

	const configChannel = client.channels.cache.get(config.channelConfig.channelId) as TextChannel;
	await configChannel.send({ embeds: [embed] });
};
