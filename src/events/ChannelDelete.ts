import { AuditLogEvent, Client, EmbedBuilder, GuildChannel } from "discord.js";
import { EventProps } from "../types/EventProps";
import { guildConfigCache } from "../lib/cache";
import { ColorType } from "../constant/ColorType";
import { ChannelType } from "../constant/ChannelType";
import { CreateDelete } from "../components/channel/CreateDelete";

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

		return CreateDelete(client, channel, embed, audit, config, "DELETE");
	},
};

export default ChannelDelete;
