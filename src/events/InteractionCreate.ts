import logger from "../lib/logger";
import { Client, CommandInteraction, EmbedBuilder } from "discord.js";
import { commandCache } from "../lib/cache";
import { COMMAND_CACHE_ERROR_MSG, ERROR_MSG } from "../lib/constant";
import { EventProps } from "../types/EventProps";

const InteractionCreate: EventProps = {
  name: "interactionCreate",
  once: false,
  handler: async (client: Client, interaction: CommandInteraction) => {
    if (interaction.isCommand()) {
      const command = commandCache.get(interaction.commandName);

      if (!command) {
        logger.error(
          COMMAND_CACHE_ERROR_MSG.replace("%s", interaction.commandName),
        );

        return interaction.reply({
          embeds: [
            new EmbedBuilder().setColor("Red").setDescription(ERROR_MSG),
          ],
        });
      }

      try {
        command.handler(client, interaction);
      } catch (err) {
        logger.error(err);

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: ERROR_MSG, ephemeral: true });
        } else {
          await interaction.reply({ content: ERROR_MSG, ephemeral: true });
        }
      }
    }
  },
};

export default InteractionCreate;