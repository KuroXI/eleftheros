import { EventProps } from "../types/EventProps";
import { AuditLogEvent, Client, EmbedBuilder, GuildEmoji } from "discord.js";
import { guildConfigCache } from "../lib/cache";
import { ColorType } from "../constant/ColorType";
import { CreateDelete } from "../components/emoji/CreateDelete";

const EmojiDelete: EventProps = {
	name: "emojiDelete",
	once: false,
	handler: async (client: Client, emoji: GuildEmoji) => {
		const config = guildConfigCache.get(emoji.guild.id);

		if (
			typeof config === "undefined" ||
			!config.emojiConfig.isEnable ||
			!config.emojiConfig.isEmojiDeleteEnable ||
			!client.channels.resolveId(config.emojiConfig.channelId)
		)
			return;

		const embed = new EmbedBuilder().setColor(ColorType.DANGER).setTitle("Emoji Delete").setImage(emoji.url);

		const emojiCreateAudit = await emoji.guild.fetchAuditLogs({
			type: AuditLogEvent.EmojiDelete,
			limit: 1,
		});

		const audit = emojiCreateAudit.entries.first();

		return CreateDelete(client, emoji, embed, audit, config, "DELETE");
	},
};

export default EmojiDelete;
