import { EventProps } from "../types/EventProps";
import { AuditLogEvent, Client, EmbedBuilder, GuildEmoji } from "discord.js";
import { guildConfigCache } from "../lib/cache";
import { ColorType } from "../constant/ColorType";
import { CreateDelete } from "../components/emoji/CreateDelete";

const EmojiCreate: EventProps = {
	name: "emojiCreate",
	once: false,
	handler: async (client: Client, emoji: GuildEmoji) => {
		const config = guildConfigCache.get(emoji.guild.id);

		if (
			typeof config === "undefined" ||
			!config.emojiConfig.isEnable ||
			!config.emojiConfig.isEmojiCreateEnable ||
			!client.channels.resolveId(config.emojiConfig.channelId)
		)
			return;

		const embed = new EmbedBuilder().setColor(ColorType.SUCCESS).setTitle("Emoji Create").setImage(emoji.url);

		const emojiCreateAudit = await emoji.guild.fetchAuditLogs({
			type: AuditLogEvent.EmojiCreate,
			limit: 1,
		});

		const audit = emojiCreateAudit.entries.first();

		return CreateDelete(client, emoji, embed, audit, config, "CREATE");
	},
};

export default EmojiCreate;
