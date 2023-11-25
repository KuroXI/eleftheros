import { AuditLogEvent, Client, EmbedBuilder, GuildChannel } from "discord.js";
import { EventProps } from "../types/EventProps";
import { guildConfigCache } from "../lib/cache";
import { ColorType } from "../constant/ColorType";
import { ChannelType } from "../constant/ChannelType";
import { CreateDelete } from "../components/channel/CreateDelete";

const ChannelCreate: EventProps = {
	name: "channelCreate",
	once: false,
	handler: async (client: Client, channel: GuildChannel) => {
		const config = guildConfigCache.get(channel.guildId);

		if (
			typeof config === "undefined" ||
			!config?.channelConfig.isEnable ||
			!config.channelConfig.isChannelCreateEnable ||
			!client.channels.resolveId(config.channelConfig.channelId)
		) {
			return;
		}

		const type = String(ChannelType[channel.type]);
		const embed = new EmbedBuilder().setColor(ColorType.SUCCESS).setTitle(`${type} Channel Create`);

		const channelCreateAudit = await channel.guild.fetchAuditLogs({
			type: AuditLogEvent.ChannelCreate,
			limit: 1,
		});
		const audit = channelCreateAudit.entries.first();

		return CreateDelete(client, channel, embed, audit, config, "CREATE");
	},
};

export default ChannelCreate;
