import { AuditLogEvent, Client, EmbedBuilder, Role } from "discord.js";
import { EventProps } from "../types/EventProps";
import { guildConfigCache } from "../lib/cache";
import { ColorType } from "../constant/ColorType";
import { CreateDelete } from "../components/role/CreateDelete";

const RoleCreate: EventProps = {
	name: "roleCreate",
	once: false,
	handler: async (client: Client, role: Role) => {
		const config = guildConfigCache.get(role.guild.id);

		if (
			typeof config === "undefined" ||
			!config.roleConfig.isEnable ||
			!config.roleConfig.isRoleCreateEnable ||
			!client.channels.resolveId(config.roleConfig.channelId)
		)
			return;

		const embed = new EmbedBuilder()
			.setColor(ColorType.SUCCESS)
			.setTitle("Role Create");

		const roleCreateAudit = await role.guild.fetchAuditLogs({
			type: AuditLogEvent.RoleCreate,
			limit: 1,
		});

		const audit = roleCreateAudit.entries.first();

		return CreateDelete(client, role, embed, audit, config, "CREATE");
	},
};

export default RoleCreate;
