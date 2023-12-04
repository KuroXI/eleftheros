import { Client } from "discord.js";
import { EventProps } from "../types/EventProps";
import logger from "../lib/logger";

const Debug: EventProps = {
	name: "debug",
	once: false,
	handler: async (_client: Client, info: string) => {
		logger.debug(info)
	},
};

export default Debug;
