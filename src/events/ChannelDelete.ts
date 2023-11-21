import { AuditLogEvent, Client, EmbedBuilder, GuildChannel, TextChannel } from "discord.js";
import { EventProps } from "../types/EventProps";
import { guildConfigCache } from "../lib/cache";
import { CodeBlock } from "../utils/codeBlock";
import { ExecutorNotFound, SetExecutor } from "../utils/util";
import { ColorType } from "../constant/ColorType";
import { ChannelType } from "../constant/ChannelType";

const ChannelDelete: EventProps = {
	name: "channelDelete",
	once: false,
	handler: async (client: Client, channel: GuildChannel) => {
		const config = guildConfigCache.get(channel.guildId);

		if (
			typeof config === "undefined" ||
			!config?.guildChannelConfig.isEnable ||
			!config.guildChannelConfig.isChannelDeleteEnable ||
			!client.channels.resolveId(config.guildChannelConfig.channelId)
		) {
			return;
		}

		const type = String(ChannelType[channel.type]);
		const embed = new EmbedBuilder().setColor(ColorType.DANGER).setTitle(`${type} Channel Delete`);

		const channelDeleteAudit = await channel.guild.fetchAuditLogs({
			type: AuditLogEvent.ChannelDelete,
			limit: 1,
		});
		const audit = channelDeleteAudit.entries.first();

		const resultData: string[] = [];

		resultData.push(`Channel Name: ${channel.name}`);
		resultData.push(`Channel ID: ${channel.id}`);

		if (type !== "Category" && channel.parent) {
			resultData.push(`Parent Name: ${channel.parent.name}`);
			resultData.push(`Parent ID: ${channel.parent.id}`);
		}

		if (audit?.executor) {
			SetExecutor(audit.executor, embed, "Deleted");
		} else {
			ExecutorNotFound(embed, "deleted", ChannelType[channel.type]!);
		}

		embed.setDescription(CodeBlock(resultData.join("\n")));

		const configChannel = client.channels.cache.get(config.guildChannelConfig.channelId) as TextChannel;
		await configChannel.send({ embeds: [embed] });
	},
};

export default ChannelDelete;