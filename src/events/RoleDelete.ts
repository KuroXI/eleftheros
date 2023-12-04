import { AuditLogEvent, Client, EmbedBuilder, Role } from "discord.js";
import { EventProps } from "../types/EventProps";
import { guildConfigCache } from "../lib/cache";
import { ColorType } from "../constant/ColorType";
import { CreateDelete } from "../components/role/CreateDelete";

const RoleDelete: EventProps = {
	name: "roleDelete",
	once: true,
	handler: async (client: Client, role: Role) => {
		const config = guildConfigCache.get(role.guild.id);

		if (
			typeof config === "undefined" ||
			!config.roleConfig.isEnable ||
			!config.roleConfig.isRoleDeleteEnable ||
			!client.channels.resolveId(config.roleConfig.channelId)
		)
			return;

		const embed = new EmbedBuilder()
			.setColor(ColorType.DANGER)
			.setTitle("Role Delete");

		const roleDeleteAudit = await role.guild.fetchAuditLogs({
			type: AuditLogEvent.RoleDelete,
			limit: 1,
		});

		const audit = roleDeleteAudit.entries.first();

		return CreateDelete(client, role, embed, audit, config, "DELETE");
	},
};

export default RoleDelete;
