import { Client, EmbedBuilder, TextChannel, VoiceState } from "discord.js";
import { EventProps } from "../types/EventProps";
import { guildConfigCache } from "../lib/cache";
import { ColorType } from "../constant/ColorType";
import { CodeBlock } from "../utils/codeBlock";

const VoiceStateUpdate: EventProps = {
	name: "voiceStateUpdate",
	once: false,
	handler: async (client: Client, oldVoice: VoiceState, newVoice: VoiceState) => {
		const config = guildConfigCache.get(oldVoice.guild.id);

		if (
			typeof config === "undefined" ||
			!config?.voiceConfig.isEnable ||
			!client.channels.resolveId(config.voiceConfig.channelId)
		) {
			return;
		}

		const embed = new EmbedBuilder().setTimestamp();

		const configChannel = client.channels.cache.get(config.voiceConfig.channelId) as TextChannel;
		const data = [];

		data.push(`User: ${newVoice.member?.user.tag ?? oldVoice.member?.user.tag}`);
		data.push(`User ID: ${newVoice.member?.user.id ?? oldVoice.member?.user.id}`);
		data.push(`Channel: ${newVoice.channel?.name ?? oldVoice.channel?.name}`);
		data.push(`Channel ID: ${newVoice.channelId ?? oldVoice.channelId}`);

		if (oldVoice.channelId !== null) {
			if (!config.voiceConfig.isVoiceJoinEnable) return;

			embed
				.setColor(ColorType.SUCCESS)
				.setAuthor({
					name: "User joined the voice channel",
					iconURL: newVoice.member?.displayAvatarURL(),
				})
				.setDescription(CodeBlock(data.join("\n")));

			return configChannel.send({ embeds: [embed] });
		}

		if (newVoice.channelId !== null) {
			if (!config.voiceConfig.isVoiceLeftEnable) return;

			embed
				.setColor(ColorType.DANGER)
				.setAuthor({
					name: "User left the voice channel",
					iconURL: oldVoice.member?.displayAvatarURL(),
				})
				.setDescription(CodeBlock(data.join("\n")));

			return configChannel.send({ embeds: [embed] });
		}

		if (oldVoice.channelId !== newVoice.channelId) {
			if (!config.voiceConfig.isVoiceChangeEnable) return;

			embed
				.setColor(ColorType.UPDATE)
				.setAuthor({
					name: "User changed the voice channel",
					iconURL: newVoice.member?.displayAvatarURL(),
				})
				.addFields([
					{ name: "User", value: CodeBlock(newVoice.member?.user.tag), inline: true },
					{ name: "User ID", value: CodeBlock(newVoice.member?.user.id), inline: true },
					{
						name: "Before",
						value: CodeBlock(`Channel: ${oldVoice.channel?.name}\nChannel ID: ${oldVoice.channelId}`),
					},
					{
						name: "After",
						value: CodeBlock(`Channel: ${newVoice.channel?.name}\nChannel ID: ${newVoice.channelId}`),
					},
				]);

			return configChannel.send({ embeds: [embed] });
		}
	},
};

export default VoiceStateUpdate;
