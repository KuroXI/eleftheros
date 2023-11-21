import "dotenv/config";
import logger from "./logger";
import { readdirSync } from "fs";
import { CommandProps } from "../types/CommandProps";
import { Client, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";
import { INITIALIZE_RELOAD, MISSING_FILE_PROPERTY_MSG, SUCCESSFUL_RELOAD } from "./constant";
import { RestApplicationCommand } from "../types/RestCommand";

export const CommandDeployment = async (client: Client) => {
	const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];

	readdirSync(`${__dirname}/../commands`)
		.filter((file) => file.endsWith(".ts"))
		.forEach((file) => {
			const commandFile: CommandProps = require(`${__dirname}/../commands/${file}`);

			if ("data" in commandFile && "handler" in commandFile) {
				commands.push(commandFile.data.toJSON());
			} else {
				logger.warn(MISSING_FILE_PROPERTY_MSG.replace("&s", file));
			}
		});

	const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

	try {
		logger.info(INITIALIZE_RELOAD.replace("%s", String(commands.length)));

		const data = (await rest.put(Routes.applicationGuildCommands(client.user!.id, process.env.GUILD_ID!), {
			body: commands,
		})) as RestApplicationCommand[];

		logger.info(SUCCESSFUL_RELOAD.replace("%s", String(data.length)));
	} catch (err) {
		logger.error(err);
	}
};
