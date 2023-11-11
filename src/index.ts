import "dotenv/config";
import logger from "./lib/logger";
import { Client } from "discord.js";
import { commandCache } from "./lib/cache";
import { CommandProps } from "./types/CommandProps";
import { readdirSync } from "fs";
import { MISSING_DISCORD_TOKEN_MSG } from "./lib/constant";

const client = new Client({
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildMessages",
    "GuildModeration",
    "MessageContent",
  ],
});

readdirSync(`${__dirname}/events`)
  .filter((file) => file.endsWith(".ts"))
  .forEach((file) => {
    const { default: eventFile } = require(`${__dirname}/events/${file}`);

    try {
      eventFile.once
        ? client.once(eventFile.name, (...args) =>
            eventFile.handler(client, ...args),
          )
        : client.on(eventFile.name, (...args) =>
            eventFile.handler(client, ...args),
          );
    } catch (err) {
      logger.error(err);
    }
  });

readdirSync(`${__dirname}/commands`)
  .filter((file) => file.endsWith(".ts"))
  .forEach((file) => {
    const commandFile: CommandProps = require(`${__dirname}/commands/${file}`);

    if ("data" in commandFile && "handler" in commandFile) {
      commandCache.set(commandFile.data.name, commandFile);
    } else {
      logger.warn(
        `${file} is missing a required "data" and "handler" property.`,
      );
    }
  });

process.env.DISCORD_TOKEN
  ? client.login(process.env.DISCORD_TOKEN)
  : logger.error(MISSING_DISCORD_TOKEN_MSG);
