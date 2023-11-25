import { EventProps } from "../types/EventProps";
import { AuditLogEvent, Client, EmbedBuilder, GuildEmoji, TextChannel } from "discord.js";
import { guildConfigCache } from "../lib/cache";
import { ColorType } from "../constant/ColorType";
import { ExecutorNotFound, SetExecutor } from "../utils/util";
import { CodeBlock } from "../utils/codeBlock";

const EmojiUpdate: EventProps = {
	name: "emojiUpdate",
	once: false,
	handler: async (client: Client, oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => {
		const config = guildConfigCache.get(oldEmoji.guild.id);

		if (
			typeof config === "undefined" ||
			!config.emojiConfig.isEnable ||
			!config.emojiConfig.isEmojiUpdateEnable ||
			!client.channels.resolveId(config.emojiConfig.channelId)
		)
			return;

		const embed = new EmbedBuilder().setColor(ColorType.UPDATE).setTitle("Emoji Update").setImage(oldEmoji.url);

		const emojiCreateAudit = await oldEmoji.guild.fetchAuditLogs({
			type: AuditLogEvent.EmojiUpdate,
			limit: 1,
		});

		const audit = emojiCreateAudit.entries.first();

		if (audit?.executor) {
			SetExecutor(audit.executor, embed, "Updated");
		} else {
			ExecutorNotFound(embed, "updated", "emoji");
		}

		if (oldEmoji.name !== newEmoji.name) {
			embed.addFields([
				{ name: "Before", value: CodeBlock(`Name: ${oldEmoji.name}\nID: ${oldEmoji.id}`), inline: true },
				{ name: "After", value: CodeBlock(`Name: ${newEmoji.name}\nID: ${newEmoji.id}`), inline: true },
			]);
		}

		const configChannel = client.channels.cache.get(config.emojiConfig.channelId) as TextChannel;
		await configChannel.send({ embeds: [embed] });
	},
};

export default EmojiUpdate;
