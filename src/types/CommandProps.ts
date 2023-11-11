import { Client, SlashCommandBuilder } from "discord.js"

export type CommandProps = {
	data: SlashCommandBuilder
	/* eslint-disable @typescript-eslint/no-explicit-any */
	handler: (client: Client, ...args: any[]) => void
}