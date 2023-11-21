import { AuditLogEvent, Client, EmbedBuilder, GuildChannel, TextChannel, VoiceChannel } from "discord.js";
import { EventProps } from "../types/EventProps";
import { guildConfigCache } from "../lib/cache";
import { CodeBlock } from "../utils/codeBlock";
import { PermissionUpdate } from "../components/channel/PermissionUpdate";
import { ExecutorNotFound, SetExecutor } from "../utils/util";
import { ChannelUpdateText } from "../components/channel/ChannelUpdateText";
import { ChannelUpdateVoice } from "../components/channel/ChannelUpdateVoice";
import { ColorType } from "../constant/ColorType";
import { ChannelType } from "../constant/ChannelType";

const ChannelUpdate: EventProps = {
	name: "channelUpdate",
	once: false,
	handler: async (client: Client, oldChannel: GuildChannel, newChannel: GuildChannel) => {
		const config = guildConfigCache.get(oldChannel.guildId || newChannel.guildId);

		if (
			typeof config === "undefined" ||
			!config?.guildChannelConfig.isEnable ||
			!config.guildChannelConfig.isChannelUpdateEnable ||
			!client.channels.resolveId(config.guildChannelConfig.channelId)
		) {
			return;
		}

		const type = String(ChannelType[oldChannel.type]);
		const embed = new EmbedBuilder().setColor(ColorType.UPDATE).setTitle(`${type} Channel Update`);

		const oldPermission = JSON.stringify(oldChannel.permissionOverwrites.cache.first());
		const newPermission = JSON.stringify(newChannel.permissionOverwrites.cache.first());

		if (oldPermission !== newPermission) {
			return PermissionUpdate(client, oldChannel, embed, config, type);
		}

		const channelUpdateAudit = await oldChannel.guild.fetchAuditLogs({
			type: AuditLogEvent.ChannelUpdate,
			limit: 1,
		});

		const audit = channelUpdateAudit.entries.first();
		const resultOldSetting: string[] = [];
		const resultNewSetting: string[] = [];

		if (audit?.executor) {
			SetExecutor(audit.executor, embed, "Created");
		} else {
			ExecutorNotFound(embed, "updated", type);
		}

		if (oldChannel.name !== newChannel.name) {
			resultOldSetting.push(`Name: ${oldChannel.name}`);
			resultNewSetting.push(`Name: ${newChannel.name}`);
		}

		if (oldChannel.isTextBased() && newChannel.isTextBased()) {
			const { resultOld, resultNew } = ChannelUpdateText(oldChannel as TextChannel, newChannel as TextChannel);
			resultOldSetting.push(...resultOld);
			resultNewSetting.push(...resultNew);
		}

		if (oldChannel.isVoiceBased() && newChannel.isVoiceBased()) {
			const { resultOld, resultNew } = ChannelUpdateVoice(oldChannel as VoiceChannel, newChannel as VoiceChannel);
			resultOldSetting.push(...resultOld);
			resultNewSetting.push(...resultNew);
		}

		if (resultOldSetting.length === 0) return;

		resultOldSetting.sort((a, b) => a.localeCompare(b));
		resultNewSetting.sort((a, b) => a.localeCompare(b));

		embed.addFields([
			{ name: "Before", value: CodeBlock(resultOldSetting.join("\n")), inline: true },
			{ name: "After", value: CodeBlock(resultNewSetting.join("\n")), inline: true },
		]);

		const configChannel = client.channels.cache.get(config.guildChannelConfig.channelId) as TextChannel;
		await configChannel.send({ embeds: [embed] });
	},
};

export default ChannelUpdate;
