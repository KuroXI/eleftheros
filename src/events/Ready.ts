import "dotenv/config";
import logger from "../lib/logger";
import { Client } from "discord.js";
import { EventProps } from "../types/EventProps";
import { CommandDeployment } from "../lib/deployment";
import { GUILD_ID_NOT_SET_MSG } from "../lib/constant";

export = {
  name: "ready",
  once: true,
  handler: async (client: Client) => {
    /**
     * TODO: Guild Config Cache
     *
     * Instead of requesting the configuration for each event in the database.
     * It cache the configuration to the Collection built in discord.js.
     * 
     * const { data } = await supabase.from("guildConfig").select("*");
     */

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
} as EventProps;
