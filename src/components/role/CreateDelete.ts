import { AuditLogEvent, Client, EmbedBuilder, GuildAuditLogsEntry, Role, TextChannel } from "discord.js";
import { ConfigCacheProps } from "../../types/ConfigCache";
import { ExecutorNotFound, SetExecutor } from "../../utils/util";
import { CodeBlock } from "../../utils/codeBlock";

export const CreateDelete = async (
	client: Client,
	role: Role,
	embed: EmbedBuilder,
	audit:
		| GuildAuditLogsEntry<
				AuditLogEvent.RoleCreate | AuditLogEvent.RoleDelete,
				"Create" | "Delete",
				"Role",
				AuditLogEvent.RoleCreate | AuditLogEvent.RoleDelete
		  >
		| undefined,
	config: ConfigCacheProps,
	type: "CREATE" | "DELETE",
) => {
	const resultData: string[] = [];

	resultData.push(`Name: ${role.name}`);
	resultData.push(`ID: ${role.id}`);
	resultData.push(`Animated: ${role.hexColor.replace("#", "").toUpperCase()}`);
	resultData.push(`Display Separately: ${role.hoist}`);
	resultData.push(`Mentionable: ${role.mentionable}`);
	resultData.push(`Position: ${role.rawPosition}`);

	if (role.icon) {
		embed.setThumbnail(role.iconURL({ size: 4096 }));
	}

	if (audit?.executor) {
		SetExecutor(audit.executor, embed, type === "CREATE" ? "Created" : "Deleted");
	} else {
		ExecutorNotFound(embed, type === "CREATE" ? "created" : "deleted", "role");
	}

	embed.setDescription(CodeBlock(resultData.join("\n")));

	const configChannel = client.channels.cache.get(config.emojiConfig.channelId) as TextChannel;
	await configChannel.send({ embeds: [embed] });
};
