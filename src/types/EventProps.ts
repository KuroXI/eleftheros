import { Client, ClientEvents } from "discord.js";

export type EventProps = {
	name: keyof ClientEvents;
	once: boolean;
	/* eslint-disable @typescript-eslint/no-explicit-any */
	handler: (client: Client, ...args: any[]) => void;
};
