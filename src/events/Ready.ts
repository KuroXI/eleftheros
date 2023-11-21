import "dotenv/config";
import logger from "../lib/logger";
import { Client } from "discord.js";
import { EventProps } from "../types/EventProps";
import { CommandDeployment } from "../lib/deployment";
import { GUILD_ID_NOT_SET_MSG } from "../lib/constant";
import { supabase } from "../lib/supabase";
import { ConfigCacheProps } from "../types/ConfigCache";
import { guildConfigCache } from "../lib/cache";
import { GuildConfigQuery } from "../constant/SupabaseQuery";

const Ready: EventProps = {
	name: "ready",
	once: true,
	handler: async (client: Client) => {
		/**
		 * Guild Config Cache
		 *
		 * Instead of requesting the configuration for each event in the database.
		 * It caches the configuration to the Collection built in discord.js.
		 */
		const { data } = await supabase.from("guildConfig").select(GuildConfigQuery).returns<ConfigCacheProps[]>();

		if (data) {
			for (const config of data) {
				guildConfigCache.set(config.id, config);
			}
		}

		/**
		 * Automatic Guild Interaction Reload
		 *
		 * It will automatically reload the guild slash command.
		 * It will skip if the ENVIRONMENT is not in development and GUILD_ID is not set.
		 */
		if (process.env.ENVIRONMENT === "development") {
			if (process.env.GUILD_ID?.length) {
				await CommandDeployment(client);
			} else {
				logger.info(GUILD_ID_NOT_SET_MSG);
			}
		}

		logger.info(`${client.user?.username} is ready!`);
	},
};

export default Ready;
