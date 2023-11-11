import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Ping pong!"),
  cooldown: 0,
  handler: async (client: Client, interaction: CommandInteraction) => {
    return await interaction.reply(`Websocket - ${client.ws.ping}ms`);
  },
};
