import { Collection } from "discord.js";
import { CommandProps } from "../types/CommandProps";
import { ConfigCacheProps } from "../types/ConfigCache";

export const commandCache = new Collection<string, CommandProps>();
export const guildConfigCache = new Collection<string, ConfigCacheProps>();
