import { Collection } from "discord.js";
import { CommandProps } from "../types/CommandProps";

export const commandCache = new Collection<string, CommandProps>();